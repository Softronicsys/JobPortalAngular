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

/* What the room observed while one answer was being recorded.

   Every field is optional on purpose. The two measurements are independent:
   speech comes from the microphone meter and always works, head pose needs a
   model that may not load on an older phone. One failing must not take the
   other's numbers with it, so each is sent if and only if it was measured. */
export interface ScreeningQuestionMetrics {
    Source: string;
    SampleCount?: number;

    /* head pose */
    FaceVisiblePercent?: number;
    StabilityScore?: number;
    LookAwayCount?: number;
    LookAwaySeconds?: number;
    MeanAbsYawDegrees?: number;
    MeanAbsPitchDegrees?: number;
    MaxAbsYawDegrees?: number;
    MaxAbsPitchDegrees?: number;

    /* speech */
    SpeakingPercent?: number;
    LongestSilenceSeconds?: number;
    SilenceAlertCount?: number;
}

/* The company's portal colours, served with both landing payloads.

   These pages open from an emailed link with no portal session, so the usual
   route - app.component calling GetJobPortalConfiguration with
   GetCompanyParameter.CompanyId - cannot work here: that service is filled in
   during the normal landing flow and is empty on a token-only page. The API
   knows the company from the attempt the token resolved to, so it sends the
   theme rather than the browser asking about a company it does not know. */
/* What the signed-in applicant is told about their AI screening.

   Stage is decided on the server, so the rules about what counts as expired
   live in one place rather than being reimplemented here:

     None | Schedule | Interview | Completed | Expired

   Token is populated only for Schedule and Interview, and is the same token
   the matching email carries. */
export interface ScreeningMyStatus {
    Stage: string;
    Message: string;
    AttemptId: number;
    Token: string;
    RoleName: string;
    InviteStatus: string;
    InterviewStatus: string;
    ScheduledStartAt: string;
    ScheduledEndAt: string;

    /* The vacancy this screening belongs to, so My Jobs can put the button on
       the right row rather than assuming one application. */
    JobCode: string;

    /* True once the room will actually admit them. Decided on the server, not
       from the browser clock. */
    IsRoomOpen: boolean;
}

export interface ScreeningTheme {
    ThemeColor: string;
    HeaderColor: string;
    FontColor: string;
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

    /* The reschedule allowance. Limit 0 means the first slot is final.
       Remaining is already clamped at 0 by the API. */
    RescheduleLimit: number;
    ReschedulesUsed: number;
    ReschedulesRemaining: number;

    /* When the room link starts and stops working, either side of the
       booked slot, in minutes. */
    LinkAccessBeforeMinutes: number;
    LinkAccessAfterMinutes: number;

    SupportContactName: string;
    SupportContactChannel: string;
    Theme: ScreeningTheme;
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
    Theme: ScreeningTheme;
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

    /* ---- the signed-in route ---------------------------------------------

       The emailed links stay the primary way in. This is for an applicant who
       has signed into the portal and no longer has the email: the server says
       which stage they are at and hands back the same token the matching email
       carries, so both doors lead to the same two pages.

       No header is set here - jobportal-auth.interceptor attaches the Bearer
       token to every HttpClient request, and the session IS the credential for
       this one call. */
    /* One status per vacancy the applicant has applied for.

       "Vacancies I have applied for" is a list, so the status beside each
       row has to be one too. MyScreening (singular) still answers with the
       most actionable one, for the page that shows a single status. */
    getMyScreenings(): Observable<ScreeningMyStatus[]> {
        return this.http.get<ScreeningMyStatus[]>(this.url('api/AIScreeningAttempt/MyScreenings'));
    }

    getMyScreening(): Observable<ScreeningMyStatus> {
        return this.http.get<ScreeningMyStatus>(this.url('api/AIScreeningAttempt/MyScreening'));
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

    /* What the room observed while one answer was recorded.

       Fired after the answer itself is safely uploaded, and deliberately not
       waited on: a stability score is a side-observation of the interview,
       and nobody's interview should stall - let alone fail - because a
       metrics row did not save. The caller subscribes and ignores the result
       either way. */
    saveQuestionMetrics(roomToken: string, attemptId: number,
                        attemptQuestionId: number, metrics: ScreeningQuestionMetrics): Observable<any> {
        var body: any = {
            AttemptId: attemptId,
            AttemptQuestionId: attemptQuestionId,
            Source: metrics.Source
        };

        /* Only send what was actually measured. A browser with no pose model
           sends its speech numbers alone, and the absent fields stay null in
           the database rather than arriving as a confident zero. */
        var keys = ['SampleCount', 'FaceVisiblePercent', 'StabilityScore',
                    'LookAwayCount', 'LookAwaySeconds',
                    'MeanAbsYawDegrees', 'MeanAbsPitchDegrees',
                    'MaxAbsYawDegrees', 'MaxAbsPitchDegrees',
                    'SpeakingPercent', 'LongestSilenceSeconds', 'SilenceAlertCount'];
        for (var i = 0; i < keys.length; i++) {
            var v = (metrics as any)[keys[i]];
            if (v !== null && v !== undefined && !isNaN(v)) { body[keys[i]] = v; }
        }

        return this.http.post<any>(
            this.url('api/AIScreeningRoom/SaveQuestionMetrics'),
            body,
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
