import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

/*
 * AI screening - the applicant's side.
 *
 * TWO LINKS, TWO TOKENS, NO SESSION
 * The applicant reaches these pages from an email, possibly days after it was
 * sent, when any portal session has long expired. So the token in the link IS
 * the credential and every endpoint here is anonymous: no Authorization header,
 * no "login" header, nothing read from storage.
 *
 *   inviteToken -> the scheduling page (openInvite / submitSlot)
 *   roomToken   -> the interview room  (openInterview, then the room calls)
 *
 * The room calls replay the room token in X-Room-Token on every request, which
 * is what the API's AIScreeningRoomController expects.
 *
 * The applicant never requests an interview - HR invites them - so there is
 * deliberately no "request" call here.
 */

/* ---- response shapes, mirroring the API DTOs ------------------------------ */

export interface ScreeningQuestion {
    AttemptQuestionId: number;
    Priority: number;
    QuestionText: string;
    TimeLimitSeconds: number;
}

/* What the scheduling page shows. EarliestStartAt/LatestStartAt bound the
   picker; InviteExpiresAt is when the chance to answer runs out, which is a
   different thing and is shown separately. */
export interface ScreeningInviteLanding {
    AttemptId: number;
    CandidateName: string;
    RoleName: string;
    JobTitle: string;
    JobCode: string;
    DurationMinutes: number;
    QuestionCount: number;
    EarliestStartAt: string;
    LatestStartAt: string;
    InviteExpiresAt: string;
    IsScheduled: boolean;
    ScheduledStartAt: string;
    ScheduledEndAt: string;
    SupportContactName: string;
    SupportContactChannel: string;
}

export interface ScreeningSlotResult {
    Message: string;
    AttemptId: number;
    ScheduledStartAt: string;
    ScheduledEndAt: string;
    InviteStatus: string;
    InterviewStatus: string;
    /* TEMPORARY - the room link, which the second email will carry. Shown on
       the confirmation screen only while email is not wired. */
    InterviewUrl: string;
    InterviewLinkExpiresAt: string;
}

export interface ScreeningRoomAccess {
    AttemptId: number;
    AppId: number;
    CandidateName: string;
    RoleName: string;
    ScheduledStartAt: string;
    ScheduledEndAt: string;
    ExpiresAt: string;
    SupportContactName: string;
    SupportContactChannel: string;
    Questions: ScreeningQuestion[];
}

export interface ScreeningConsentState {
    AttemptId: number;
    MayRecord: boolean;
    MissingConsents: string[];
    Consents: any[];
}

export interface ScreeningProgress {
    AttemptId: number;
    InterviewStatus: string;
    QuestionCount: number;
    AnsweredCount: number;
    IsComplete: boolean;
    NextAttemptQuestionId: number;
    Answers: any[];
}

@Injectable()
export class AiScreeningService {

    constructor(private http: HttpClient, private config: AppConfigService) { }

    /* baseUrl comes from assets/app-config.json, the same source every other
       service uses. The AI screening controllers are attribute-routed under
       api/<controller>, unlike the older endpoints that sit at the root. */
    private url(path: string): string {
        var base = (this.config.environment && this.config.environment.baseUrl) || '';
        if (base.length > 0 && base.charAt(base.length - 1) !== '/') {
            base = base + '/';
        }
        return base + path;
    }

    private roomHeaders(roomToken: string): HttpHeaders {
        return new HttpHeaders({ 'X-Room-Token': roomToken });
    }

    /* ---- the scheduling page --------------------------------------------- */

    /* Opens the invite. Reads only - it does not consume the token or start
       any clock, so an applicant may look at the page and come back. */
    openInvite(inviteToken: string): Observable<ScreeningInviteLanding> {
        return this.http.get<ScreeningInviteLanding>(
            this.url('api/AIScreeningAttempt/OpenInvite'),
            { params: { token: inviteToken } });
    }

    /* The whole of the applicant's interaction. Calling it again reschedules,
       which issues a new room token and kills the previously emailed link. */
    submitSlot(inviteToken: string, scheduledStartAt: string): Observable<ScreeningSlotResult> {
        return this.http.post<ScreeningSlotResult>(
            this.url('api/AIScreeningAttempt/SubmitSlot'),
            { Token: inviteToken, ScheduledStartAt: scheduledStartAt });
    }

    /* ---- the interview room ----------------------------------------------- */

    /* Entering the room. A DIFFERENT token from the one above. Refused before
       the scheduled start, and refused without starting the expiry clock, so
       opening the email early is harmless. */
    openInterview(roomToken: string): Observable<ScreeningRoomAccess> {
        return this.http.get<ScreeningRoomAccess>(
            this.url('api/AIScreeningAttempt/OpenInterview'),
            { params: { token: roomToken } });
    }

    getConsentState(roomToken: string, attemptId: number): Observable<ScreeningConsentState> {
        return this.http.get<ScreeningConsentState>(
            this.url('api/AIScreeningRoom/GetConsentState'),
            { headers: this.roomHeaders(roomToken), params: { AttemptId: String(attemptId) } });
    }

    recordConsent(roomToken: string, attemptId: number, consentType: string,
                  granted: boolean, policyVersion: string): Observable<ScreeningConsentState> {
        return this.http.post<ScreeningConsentState>(
            this.url('api/AIScreeningRoom/RecordConsent'),
            {
                AttemptId: attemptId,
                ConsentType: consentType,
                Granted: granted,
                PolicyVersion: policyVersion
            },
            { headers: this.roomHeaders(roomToken) });
    }

    /* One answer per question, uploaded as each finishes rather than all at the
       end - so a dropped connection costs one answer, not the whole interview.
       multipart/form-data: Content-Type is deliberately NOT set, so the browser
       adds the multipart boundary itself. */
    uploadAnswer(roomToken: string, attemptId: number, attemptQuestionId: number,
                 durationSeconds: number, file: Blob, fileName: string): Observable<any> {
        var form = new FormData();
        form.append('AttemptId', String(attemptId));
        form.append('AttemptQuestionId', String(attemptQuestionId));
        form.append('DurationSeconds', String(durationSeconds));
        form.append('file', file, fileName);

        return this.http.post<any>(
            this.url('api/AIScreeningRoom/UploadAnswer'),
            form,
            { headers: this.roomHeaders(roomToken) });
    }

    getProgress(roomToken: string, attemptId: number): Observable<ScreeningProgress> {
        return this.http.get<ScreeningProgress>(
            this.url('api/AIScreeningRoom/GetProgress'),
            { headers: this.roomHeaders(roomToken), params: { AttemptId: String(attemptId) } });
    }

    /* Finishing. Unanswered questions are allowed - a partial sitting is kept
       and shown to HR as partial rather than discarded - and it still counts as
       Conducted, because submitting IS reaching the end. */
    completeInterview(roomToken: string, attemptId: number): Observable<any> {
        return this.http.post<any>(
            this.url('api/AIScreeningRoom/CompleteInterview'),
            { AttemptId: attemptId },
            { headers: this.roomHeaders(roomToken) });
    }
}
