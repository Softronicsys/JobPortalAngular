import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AiScreeningService, ScreeningInviteLanding } from '@app/Service/ai-screening.service';

/*
 * The AI screening scheduling page - the whole of the applicant's interaction.
 *
 * "The applicant receives an email, clicks the link, and lands on a page to set
 * date and time and submit the form. That is the whole interaction."
 *
 * The applicant does NOT request an interview and does not wait for an approval:
 * HR invites them, and their only decision is which slot to take. There is no
 * "Request AI Interview" action anywhere on this page, by design.
 *
 * NO LOGIN IS REQUIRED. The token in the emailed link is the credential, which
 * is what makes this work when the applicant clicks days later with no live
 * portal session. Nothing here reads storage or sends an auth header.
 */
@Component({
    selector: 'app-ai-screening-schedule',
    templateUrl: './ai-screening-schedule.component.html',
    styleUrls: ['./ai-screening-schedule.component.css']
})
export class AiScreeningScheduleComponent implements OnInit {

    /* 'loading' | 'ready' | 'saving' | 'done' | 'error' */
    state = 'loading';

    token = '';
    invite: ScreeningInviteLanding = null;
    errorMsg = '';

    /* The picker is split into date + time because Angular 6 has no datetime
       control and the native datetime-local is inconsistent across the browsers
       this portal supports. Both are plain strings, combined on submit. */
    pickedDate = '';
    pickedTime = '';

    /* Bounds for the date input, as yyyy-MM-dd. */
    minDate = '';
    maxDate = '';

    /* Set once the slot is taken. */
    confirmedStart: string = null;
    confirmedEnd: string = null;
    successMsg = '';

    /* TEMPORARY - REMOVE WHEN THE INTERVIEW EMAIL IS WIRED.
       The room link, which the second email will carry. Shown on the
       confirmation screen so the flow is usable end to end today. */
    interviewUrl = '';

    constructor(private route: ActivatedRoute, private api: AiScreeningService) { }

    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'] || '';

        if (!this.token) {
            this.state = 'error';
            this.errorMsg = 'This scheduling link is incomplete. Please use the link exactly as it appears in your email.';
            return;
        }

        this.load();
    }

    load() {
        this.state = 'loading';

        this.api.openInvite(this.token).subscribe(
            invite => {
                this.invite = invite;
                this.minDate = this.toDateInput(invite.EarliestStartAt);
                this.maxDate = this.toDateInput(invite.LatestStartAt);

                /* Pre-fill with the existing slot when rescheduling, otherwise
                   with the earliest time they may pick - so the form is valid
                   the moment it loads rather than starting in an error state. */
                var seed = invite.IsScheduled && invite.ScheduledStartAt
                    ? invite.ScheduledStartAt
                    : invite.EarliestStartAt;

                this.pickedDate = this.toDateInput(seed);
                this.pickedTime = this.toTimeInput(seed);

                this.state = 'ready';
            },
            err => {
                this.state = 'error';
                this.errorMsg = this.messageFrom(err,
                    'This scheduling link is not valid. Please contact HR for a new invitation.');
            });
    }

    submit() {
        if (this.state === 'saving') { return; }

        var local = this.combine(this.pickedDate, this.pickedTime);
        if (!local) {
            this.errorMsg = 'Please choose both a date and a time.';
            return;
        }

        this.errorMsg = '';
        this.state = 'saving';

        this.api.submitSlot(this.token, local).subscribe(
            result => {
                this.state = 'done';
                this.successMsg = result.Message;
                this.confirmedStart = result.ScheduledStartAt;
                this.confirmedEnd = result.ScheduledEndAt;
                this.interviewUrl = result.InterviewUrl;
            },
            err => {
                /* Back to 'ready', not 'error': the rejection is almost always
                   a slot outside the allowed window, which the applicant can
                   fix by picking another one. Sending them to a dead end would
                   be wrong. */
                this.state = 'ready';
                this.errorMsg = this.messageFrom(err,
                    'That time could not be booked. Please choose another slot.');
            });
    }

    /* Shown after booking so the applicant can reschedule without hunting for
       the email again. */
    changeSlot() {
        this.errorMsg = '';
        this.successMsg = '';
        this.load();
    }

    get hasSupportContact(): boolean {
        return !!(this.invite && this.invite.SupportContactName);
    }

    /* ---- helpers ---------------------------------------------------------- */

    /* The API returns and expects local, unzoned times ("2026-10-15T10:00:00").
       Everything here stays in that form deliberately: converting to UTC and
       back would shift an applicant's chosen slot by their offset, and the
       scheduled time means the company's local time on both sides. */
    private combine(date: string, time: string): string {
        if (!date || !time) { return null; }
        var t = time.length === 5 ? time + ':00' : time;
        return date + 'T' + t;
    }

    private toDateInput(value: string): string {
        if (!value) { return ''; }
        return value.indexOf('T') >= 0 ? value.substring(0, value.indexOf('T')) : value;
    }

    private toTimeInput(value: string): string {
        if (!value || value.indexOf('T') < 0) { return '09:00'; }
        return value.substring(value.indexOf('T') + 1, value.indexOf('T') + 6);
    }

    /* The API reports refusals as { message: "..." } with a 400, and those
       messages are written for the applicant, so they are shown as-is. Anything
       else (network, 500) falls back to the caller's wording rather than
       leaking a stack trace. */
    private messageFrom(err: any, fallback: string): string {
        if (err && err.error && err.error.message) { return err.error.message; }
        if (err && err.status === 0) {
            return 'We could not reach the server. Please check your connection and try again.';
        }
        return fallback;
    }
}
