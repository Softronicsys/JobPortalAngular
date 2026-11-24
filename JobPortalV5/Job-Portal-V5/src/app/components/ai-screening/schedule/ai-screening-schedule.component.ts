import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AiScreeningService, ScreeningInviteLanding, ScreeningTheme } from '@app/Service/ai-screening.service';
import { applyScreeningTheme } from '../screening-theme';

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
 *
 * DATES ARE WRITTEN OUT, NEVER LEFT TO THE BROWSER
 * Every date on this page is formatted by the helpers at the bottom of this
 * file rather than by DatePipe or a native control, so it reads the same for
 * everyone: "Tue 24 Nov 2026", never 11/24/2026.
 *
 * That is also why the date is a SELECT of the days actually available and not
 * an <input type="date">. A native date field renders in the browser's UI
 * locale - a machine set to US English shows 11/24/2026 and there is no markup
 * that changes it; lang="en-GB" on the input, on a wrapper, or on the document
 * is ignored by Chrome, which was tested rather than assumed. Listing the valid
 * days has two further advantages: the booking window stops being something the
 * applicant must read and remember, and a day outside it cannot be chosen.
 */
@Component({
    selector: 'app-ai-screening-schedule',
    templateUrl: './ai-screening-schedule.component.html',
    styleUrls: ['./ai-screening-schedule.component.css']
})
export class AiScreeningScheduleComponent implements OnInit {

    /* 'loading' | 'ready' | 'saving' | 'locked' | 'done' | 'error' */
    state = 'loading';

    token = '';
    invite: ScreeningInviteLanding = null;
    errorMsg = '';

    /* The picker is split into date + time because Angular 6 has no datetime
       control. Both are plain strings, combined on submit. */
    pickedDate = '';
    pickedTime = '';

    /* The days the applicant may actually choose, earliest first. */
    availableDates: { value: string, label: string }[] = [];

    /* Bounds for the time input, applied only on the first and last day of the
       window - in between, any time of day is inside it. */
    minTime = '';
    maxTime = '';

    /* Set once the slot is taken. */
    confirmedStart: string = null;
    confirmedEnd: string = null;
    successMsg = '';

    /* TEMPORARY - REMOVE WHEN THE INTERVIEW EMAIL IS WIRED.
       The room link, which the second email will carry. Shown on the
       confirmation screen so the flow is usable end to end today. */
    interviewUrl = '';

    constructor(private route: ActivatedRoute, private api: AiScreeningService,
                private host: ElementRef) { }

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

                /* The company's colours, before anything is painted. */
                applyScreeningTheme(this.host, 'ais', invite.Theme);

                this.availableDates = this.buildDateList(invite.EarliestStartAt, invite.LatestStartAt);

                /* Pre-fill with the existing slot when rescheduling, otherwise
                   with the earliest time they may pick - so the form is valid
                   the moment it loads rather than starting in an error state. */
                var seed = invite.IsScheduled && invite.ScheduledStartAt
                    ? invite.ScheduledStartAt
                    : invite.EarliestStartAt;

                this.pickedDate = this.datePart(seed);
                this.pickedTime = this.timePart(seed);

                /* A booked slot that has since fallen outside the window - the
                   invite's last day moving closer - would otherwise leave the
                   select showing nothing at all. */
                if (!this.isDateAvailable(this.pickedDate) && this.availableDates.length > 0) {
                    this.pickedDate = this.availableDates[0].value;
                }

                this.onDateChange();

                /* Out of changes means no picker at all - see isLocked. */
                this.state = this.isLocked ? 'locked' : 'ready';
            },
            err => {
                this.state = 'error';
                this.errorMsg = this.messageFrom(err,
                    'This scheduling link is not valid. Please contact HR for a new invitation.');
            });
    }

    /* The time bounds depend on which day is chosen: the first day of the
       window starts part-way through it, and the last day ends part-way
       through it. Without this an applicant can pick a valid-looking time on
       the first day that is already in the past, and only find out on submit. */
    onDateChange() {
        if (!this.invite) { return; }

        var firstDay = this.datePart(this.invite.EarliestStartAt);
        var lastDay = this.datePart(this.invite.LatestStartAt);

        this.minTime = this.pickedDate === firstDay ? this.timePart(this.invite.EarliestStartAt) : '';
        this.maxTime = this.pickedDate === lastDay ? this.timePart(this.invite.LatestStartAt) : '';

        if (this.minTime && this.pickedTime < this.minTime) { this.pickedTime = this.minTime; }
        if (this.maxTime && this.pickedTime > this.maxTime) { this.pickedTime = this.maxTime; }
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

    /* ---- what the page says about the rules ------------------------------- */

    /* Already booked, with no changes left. The form is not shown at all in
       that case: offering a picker the server will refuse is worse than saying
       plainly that the time is fixed. */
    get isLocked(): boolean {
        return !!(this.invite && this.invite.IsScheduled && this.invite.ReschedulesRemaining <= 0);
    }

    /* The booking window, as one line. */
    get windowText(): string {
        if (!this.invite) { return ''; }
        return this.longDateTime(this.invite.EarliestStartAt)
            + '  to  ' + this.longDateTime(this.invite.LatestStartAt);
    }

    get respondByText(): string {
        return this.invite ? this.longDateTime(this.invite.InviteExpiresAt) : '';
    }

    /* How many changes are left, in the applicant's terms rather than the
       policy's. What matters to them is none / this is the last one / a few. */
    get changesText(): string {
        if (!this.invite) { return ''; }

        if (this.invite.RescheduleLimit <= 0) {
            return 'The time you choose is final and cannot be changed afterwards.';
        }

        if (!this.invite.IsScheduled) {
            return this.invite.RescheduleLimit === 1
                ? 'After booking you may change your time once.'
                : 'After booking you may change your time up to '
                    + this.invite.RescheduleLimit + ' times.';
        }

        var left = this.invite.ReschedulesRemaining;
        if (left <= 0) { return 'You have used all your changes, so this time is now fixed.'; }
        if (left === 1) { return 'You may change your time once more - this will be your last change.'; }
        return 'You may change your time ' + left + ' more times.';
    }

    /* True when submitting now spends the applicant's final change - worth
       saying before they press the button, not after. */
    get isLastChange(): boolean {
        return !!(this.invite && this.invite.IsScheduled && this.invite.ReschedulesRemaining === 1);
    }

    /* When the room link works, either side of the slot. */
    get accessText(): string {
        if (!this.invite) { return ''; }

        var before = this.invite.LinkAccessBeforeMinutes;
        var after = this.invite.LinkAccessAfterMinutes;

        var opens = before > 0
            ? 'Your interview link opens ' + this.minutesText(before) + ' before your start time'
            : 'Your interview link opens at your start time';

        var closes = after > 0
            ? ', and stops working ' + this.minutesText(after) + ' after your slot ends.'
            : ', and stops working when your slot ends.';

        return opens + closes;
    }

    /* The slot selected right now, written out in full, so what is about to be
       booked is never in doubt. */
    get selectedSlotText(): string {
        if (!this.pickedDate || !this.pickedTime || !this.invite) { return ''; }

        var start = this.parseLocal(this.combine(this.pickedDate, this.pickedTime));
        if (!start) { return ''; }

        var end = new Date(start.getTime() + (this.invite.DurationMinutes || 0) * 60000);

        return this.longDate(start) + ', ' + this.ampm(start) + ' to ' + this.ampm(end);
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

    private datePart(value: string): string {
        if (!value) { return ''; }
        return value.indexOf('T') >= 0 ? value.substring(0, value.indexOf('T')) : value;
    }

    private timePart(value: string): string {
        if (!value || value.indexOf('T') < 0) { return '09:00'; }
        return value.substring(value.indexOf('T') + 1, value.indexOf('T') + 6);
    }

    private isDateAvailable(value: string): boolean {
        for (var i = 0; i < this.availableDates.length; i++) {
            if (this.availableDates[i].value === value) { return true; }
        }
        return false;
    }

    /* Every day from the first to the last, inclusive.

       Built by stepping a Date one calendar day at a time rather than by adding
       24 hours to a timestamp, so a daylight-saving change inside the window
       cannot drop or duplicate a day. */
    private buildDateList(from: string, to: string): { value: string, label: string }[] {
        var start = this.parseLocal(from);
        var end = this.parseLocal(to);
        var out: { value: string, label: string }[] = [];

        if (!start || !end) { return out; }

        var cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        var last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

        /* A guard, not a limit: the horizon is a policy value and a
           misconfigured one must not spin here forever. */
        var guard = 0;
        while (cursor.getTime() <= last.getTime() && guard < 400) {
            out.push({ value: this.isoDate(cursor), label: this.shortDate(cursor) });
            cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
            guard++;
        }

        return out;
    }

    /* "2026-11-24T23:58:00" -> Date, built from the parts.

       NOT new Date(string): browsers disagree about whether an unzoned string
       is local or UTC, and being wrong by the offset would move the slot to
       another day at the edges of the window. */
    private parseLocal(value: string): Date {
        if (!value) { return null; }

        var bits = this.datePart(value).split('-');
        if (bits.length !== 3) { return null; }

        var time = value.indexOf('T') >= 0 ? value.substring(value.indexOf('T') + 1) : '00:00:00';
        var tbits = time.split(':');

        return new Date(
            parseInt(bits[0], 10),
            parseInt(bits[1], 10) - 1,
            parseInt(bits[2], 10),
            parseInt(tbits[0] || '0', 10),
            parseInt(tbits[1] || '0', 10),
            0);
    }

    /* Month and day names are held here rather than taken from the browser, so
       the page reads identically whatever locale the machine is set to. */
    private static Months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    private static Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    private pad(n: number): string { return n < 10 ? '0' + n : '' + n; }

    private isoDate(d: Date): string {
        return d.getFullYear() + '-' + this.pad(d.getMonth() + 1) + '-' + this.pad(d.getDate());
    }

    /* Times are shown as 12-hour with AM/PM.

       Note what is NOT converted: pickedTime, minTime and maxTime stay in
       24-hour "HH:mm" form, because those are the value and the min/max of an
       <input type="time">, and the HTML spec requires that form regardless of
       how the control chooses to render it. Only text the page writes itself
       goes through here - displayTime() converts those bounds when they are
       shown to a reader rather than handed to the browser. */
    private ampm(d: Date): string {
        var h = d.getHours();
        var suffix = h < 12 ? 'AM' : 'PM';

        /* Midnight and noon are the two that catch a naive h % 12: both land
           on 0, and "0:17 AM" is not a time anyone writes. */
        var hour12 = h % 12;
        if (hour12 === 0) { hour12 = 12; }

        return hour12 + ':' + this.pad(d.getMinutes()) + ' ' + suffix;
    }

    /** "00:13" -> "12:13 AM". For showing a time bound, never for the input. */
    displayTime(value: string): string {
        if (!value) { return ''; }

        var bits = value.split(':');
        if (bits.length < 2) { return value; }

        var d = new Date(2000, 0, 1, parseInt(bits[0], 10), parseInt(bits[1], 10), 0);
        return this.ampm(d);
    }

    /** "Tue 24 Nov 2026" - day before month, always. */
    private shortDate(d: Date): string {
        return AiScreeningScheduleComponent.Days[d.getDay()].substring(0, 3) + ' '
            + d.getDate() + ' '
            + AiScreeningScheduleComponent.Months[d.getMonth()].substring(0, 3) + ' '
            + d.getFullYear();
    }

    /** "Tuesday 24 November 2026" */
    private longDate(d: Date): string {
        return AiScreeningScheduleComponent.Days[d.getDay()] + ' '
            + d.getDate() + ' '
            + AiScreeningScheduleComponent.Months[d.getMonth()] + ' '
            + d.getFullYear();
    }

    /** "Tue 24 Nov 2026, 23:58" - from an API string. */
    longDateTime(value: string): string {
        var d = this.parseLocal(value);
        return d ? this.shortDate(d) + ', ' + this.ampm(d) : '';
    }

    /** "Tuesday 24 November 2026" - from an API string, for the big lines. */
    fullDate(value: string): string {
        var d = this.parseLocal(value);
        return d ? this.longDate(d) : '';
    }

    /** "2:30 PM" - from an API string. */
    clock(value: string): string {
        var d = this.parseLocal(value);
        return d ? this.ampm(d) : '';
    }

    private minutesText(mins: number): string {
        if (mins < 60) { return mins + ' minutes'; }

        var hours = Math.floor(mins / 60);
        var rest = mins % 60;
        var text = hours + (hours === 1 ? ' hour' : ' hours');

        return rest > 0 ? text + ' ' + rest + ' minutes' : text;
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
