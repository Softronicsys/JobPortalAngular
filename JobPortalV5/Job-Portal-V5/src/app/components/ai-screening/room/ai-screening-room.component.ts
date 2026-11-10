import {
    Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef, NgZone
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    AiScreeningService,
    ScreeningRoomAccess,
    ScreeningQuestion,
    ScreeningTheme
} from '@app/Service/ai-screening.service';
import { applyScreeningTheme } from '../screening-theme';

/* MediaRecorder is absent from the DOM typings shipped with TypeScript 2.7,
   which is what this project builds with. */
declare var MediaRecorder: any;

/*
 * The AI screening interview room.
 *
 * Reached from the SECOND email, with the room token in the link. That token
 * is the credential: it is replayed in X-Room-Token on every call, and the API
 * additionally requires the attempt to be InProgress and inside its time
 * window, so a token cannot be used before the room was properly opened or
 * after the interview ends.
 *
 * CAMERA ACCESS IS AN EXPLICIT BUTTON, AND HAS TO BE
 * "Grant Access" is not a styling choice copied from the prototype - it is the
 * only reliable way to get the prompt. Browsers show the camera/microphone
 * dialog only for a getUserMedia() call made inside the user-activation window
 * of a real click. Call it on page load, or after a couple of awaited HTTP
 * round-trips, and the prompt is suppressed SILENTLY: no error, no dialog,
 * just a page that never gets a camera. That is the worst kind of failure,
 * because the interview looks like it is working.
 *
 * ONE CONSENT CONTROL, TWO CONSENT ROWS
 * The applicant ticks one box covering recording and AI analysis. Accepting it
 * records BOTH rows the API requires (Terms and Recording). Our schema storing
 * consent in two places is not a reason to ask a person to agree twice.
 *
 * ONE ANSWER AT A TIME, UPLOADED AS IT FINISHES
 * Not one file at the end. A dropped connection then costs one answer rather
 * than the whole interview, and GetProgress tells us which question to resume
 * from - so reopening the link after a crash picks up where it stopped.
 */
@Component({
    selector: 'app-ai-screening-room',
    templateUrl: './ai-screening-room.component.html',
    styleUrls: ['./ai-screening-room.component.css']
})
export class AiScreeningRoomComponent implements OnInit, OnDestroy, AfterViewChecked {

    /* 'loading' | 'consent' | 'arming' | 'ready' | 'recording' | 'uploading'
       | 'done' | 'error' */
    state = 'loading';

    token = '';
    access: ScreeningRoomAccess = null;
    errorMsg = '';
    notice = '';

    /* consent - one control, as the prototype.

       v2 names the three analyses separately (recording, non-verbal /
       behavioural, voice) instead of the single "analyzed by AI" of v1. The
       version is stamped on every tblAIScreeningConsent row, so a consent
       given against the older wording stays distinguishable rather than being
       silently re-interpreted as agreement to something broader. */
    agreeConsent = false;
    private readonly policyVersion = 'v2';

    /* devices */
    cameras: any[] = [];
    mics: any[] = [];
    speakers: any[] = [];
    selectedCameraId = '';
    selectedMicId = '';
    selectedSpeakerId = '';

    /* The device test. micLevel is 0-100 and drives the meter; speakerTested
       and micSeenSound are what the applicant is actually told. */
    micLevel = 0;
    micSeenSound = false;
    speakerTested = false;
    speakerSupported = true;
    private audioCtx: any = null;
    private analyser: any = null;
    private meterTimer: any = null;

    /* questions */
    questions: ScreeningQuestion[] = [];
    currentIndex = 0;
    answeredIds: number[] = [];

    /* recording */
    secondsLeft = 0;
    mediaStream: any = null;
    private recorder: any = null;
    private chunks: any[] = [];
    private tickHandle: any = null;
    private startedAt = 0;
    /* The <video> lives inside an *ngIf, so it does not exist while the camera
       is being opened. This tracks whether the live stream has actually been
       attached to it; see ngAfterViewChecked. */
    private streamAttached = false;

    @ViewChild('preview') preview: ElementRef;

    constructor(private route: ActivatedRoute,
                private api: AiScreeningService,
                private zone: NgZone,
                private host: ElementRef) { }

    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'] || '';

        if (!this.token) {
            this.fail('This interview link is incomplete. Please use the link exactly as it appears in your email.');
            return;
        }

        this.api.openInterview(this.token).subscribe(
            access => {
                this.access = access;

                /* The company's colours, before anything is painted. */
                applyScreeningTheme(this.host, 'air', access.Theme);

                this.questions = access.Questions || [];

                if (this.questions.length === 0) {
                    this.fail('No questions have been set up for this interview. Please contact HR.');
                    return;
                }

                /* Resume rather than restart: if answers already exist the
                   applicant is reconnecting after a drop. */
                this.api.getProgress(this.token, access.AttemptId).subscribe(
                    progress => {
                        if (progress && progress.AnsweredCount > 0) {
                            this.answeredIds = (progress.Answers || [])
                                .map(a => a.AttemptQuestionId)
                                .filter(id => !!id);
                            this.currentIndex = this.firstUnansweredIndex();
                            this.notice = 'Welcome back — we picked up where you left off.';
                        }
                        this.state = 'consent';
                    },
                    () => { this.state = 'consent'; });
            },
            err => {
                this.fail(this.messageFrom(err, 'This interview link is not valid. Please contact HR.'));
            });
    }

    /* Attaches the camera stream to the <video> once that element exists.
       It cannot be done where the stream arrives: the element is inside an
       *ngIf and the ViewChild is undefined at that point, so assigning there
       silently does nothing. Guarded so it runs once, not on every change
       detection pass. */
    ngAfterViewChecked() {
        if (this.streamAttached || !this.mediaStream) { return; }
        if (!this.preview || !this.preview.nativeElement) { return; }

        this.preview.nativeElement.srcObject = this.mediaStream;
        this.streamAttached = true;
    }

    ngOnDestroy() {
        this.stopTicking();
        this.stopMicMeter();
        this.releaseCamera();
    }

    /* ---- camera ----------------------------------------------------------- */

    /* MUST be called straight from a click - see the class comment. */
    grantAccess() {
        this.errorMsg = '';
        this.openStream(null, null);
    }

    switchDevice() {
        if (!this.mediaStream) { return; }
        this.releaseCamera();
        this.openStream(this.selectedCameraId || null, this.selectedMicId || null);
    }

    private openStream(cameraId: string, micId: string) {
        var nav: any = navigator;
        var getUserMedia = nav.mediaDevices && nav.mediaDevices.getUserMedia
            ? nav.mediaDevices.getUserMedia.bind(nav.mediaDevices)
            : null;

        if (!getUserMedia) {
            this.errorMsg = 'This browser cannot record video. Please use a recent Chrome, Edge or Firefox. ' +
                            'Camera access also needs the page to be on localhost or https.';
            return;
        }

        var constraints: any = {
            video: cameraId ? { deviceId: { exact: cameraId } } : true,
            audio: micId ? { deviceId: { exact: micId } } : true
        };

        getUserMedia(constraints).then(
            (stream: any) => {
                this.zone.run(() => {
                    this.mediaStream = stream;
                    this.streamAttached = false;
                    this.errorMsg = '';
                    this.listDevices();

                    /* Switching device rebuilds the stream, so the old meter
                       is torn down first - otherwise it would keep reading
                       the microphone that has just been released. */
                    this.stopMicMeter();
                    this.startMicMeter();
                });
            },
            (err: any) => {
                this.zone.run(() => {
                    // Separated because the remedies differ: a refusal needs
                    // the browser's site settings changed, a missing device
                    // needs hardware.
                    var name = err && err.name ? err.name : '';
                    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
                        this.errorMsg = 'Camera and microphone access was blocked. Allow it for this site ' +
                                        '(the icon at the left of the address bar), then press Grant Access again.';
                    } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
                        this.errorMsg = 'No camera or microphone was found. Please connect one and try again.';
                    } else {
                        this.errorMsg = 'Failed to access camera: ' +
                                        (err && err.message ? err.message : 'unknown error');
                    }
                });
            });
    }

    /* Device labels are only populated once permission has been granted, which
       is why this runs after the stream opens rather than on load. */
    private listDevices() {
        var nav: any = navigator;
        if (!nav.mediaDevices || !nav.mediaDevices.enumerateDevices) { return; }

        nav.mediaDevices.enumerateDevices().then((devices: any[]) => {
            this.zone.run(() => {
                this.cameras = devices.filter(d => d.kind === 'videoinput');
                this.mics = devices.filter(d => d.kind === 'audioinput');
                this.speakers = devices.filter(d => d.kind === 'audiooutput');

                /* Only Chromium enumerates outputs and implements setSinkId.
                   Firefox and Safari report none, and the applicant there can
                   only use the system default - so the picker is hidden rather
                   than shown empty and broken. The test tone still works. */
                this.speakerSupported = this.speakers.length > 0;
            });
        }, () => { /* listing is a convenience; the stream already works */ });
    }

    /* ---- the device test --------------------------------------------------- */

    /* A live level meter off the microphone track already open for the
       interview - no second getUserMedia, which would prompt again on some
       browsers and can fail outright while the first stream holds the device.

       Runs on a timer outside Angular and only re-enters the zone when the
       rounded value actually changes: at 10fps an unconditional zone.run would
       trigger change detection across the whole page for the entire sitting. */
    private startMicMeter() {
        if (!this.mediaStream || this.analyser) { return; }

        var Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) { return; }

        try {
            this.audioCtx = new Ctx();
            var source = this.audioCtx.createMediaStreamSource(this.mediaStream);
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 512;
            source.connect(this.analyser);
        } catch (e) {
            this.analyser = null;
            return;
        }

        var buffer = new Uint8Array(this.analyser.frequencyBinCount);
        var self = this;

        this.zone.runOutsideAngular(function () {
            self.meterTimer = setInterval(function () {
                if (!self.analyser) { return; }
                self.analyser.getByteTimeDomainData(buffer);

                /* Peak deviation from the 128 centre line, as a percentage.
                   Scaled by 2.2 so ordinary speech fills a useful part of the
                   meter rather than creeping along the bottom. */
                var peak = 0;
                for (var i = 0; i < buffer.length; i++) {
                    var d = Math.abs(buffer[i] - 128);
                    if (d > peak) { peak = d; }
                }
                var level = Math.min(100, Math.round((peak / 128) * 100 * 2.2));

                if (level !== self.micLevel) {
                    self.zone.run(function () {
                        self.micLevel = level;
                        if (level > 12) { self.micSeenSound = true; }
                    });
                }
            }, 100);
        });
    }

    private stopMicMeter() {
        if (this.meterTimer) { clearInterval(this.meterTimer); this.meterTimer = null; }
        this.analyser = null;
        if (this.audioCtx && this.audioCtx.close) {
            try { this.audioCtx.close(); } catch (e) { /* already closed */ }
        }
        this.audioCtx = null;
    }

    /* A short tone rather than an audio file: nothing to ship, nothing to
       fail to load, and it routes through the chosen output device so the
       applicant hears whether their pick is the right one. */
    testSpeaker() {
        var Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) { this.speakerTested = true; return; }

        try {
            var ctx = new Ctx();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = 528;

            /* Ramped, not switched: an abrupt start and stop on a sine wave
               produces an audible click on most hardware. */
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);

            osc.connect(gain);
            gain.connect(ctx.destination);

            /* Route to the chosen speaker where the browser allows it. */
            var dest: any = ctx.destination;
            if (this.selectedSpeakerId && dest.setSinkId) {
                dest.setSinkId(this.selectedSpeakerId).catch(function () { /* default output */ });
            }

            osc.start();
            osc.stop(ctx.currentTime + 0.8);
            osc.onended = function () { try { ctx.close(); } catch (e) { /* closed */ } };
        } catch (e) {
            /* The tone is a convenience; a browser that refuses it must not
               stand between the applicant and their interview. */
        }

        this.speakerTested = true;
    }

    /* True once camera, microphone and speaker have each been seen working.
       Deliberately NOT a gate on starting - see the template. */
    get devicesChecked(): boolean {
        return !!this.mediaStream && this.micSeenSound && this.speakerTested;
    }

    private releaseCamera() {
        if (this.mediaStream && this.mediaStream.getTracks) {
            var tracks = this.mediaStream.getTracks();
            for (var i = 0; i < tracks.length; i++) { tracks[i].stop(); }
        }
        this.mediaStream = null;
        this.streamAttached = false;
    }

    /* ---- starting ---------------------------------------------------------- */

    get canStart(): boolean {
        return !!this.mediaStream && this.agreeConsent && this.state === 'consent';
    }

    /* Consent is recorded only once we know a camera actually exists. Consent
       stored for a sitting that can never record anything is misleading
       evidence, not useful evidence. */
    beginInterview() {
        if (!this.canStart) { return; }

        this.state = 'arming';
        var attemptId = this.access.AttemptId;

        /* One at a time rather than in parallel: the rows are append-only
           evidence and a failure part-way should leave a coherent trail. */
        this.api.recordConsent(this.token, attemptId, 'Terms', true, this.policyVersion).subscribe(
            () => {
                this.api.recordConsent(this.token, attemptId, 'Recording', true, this.policyVersion).subscribe(
                    consentState => {
                        if (consentState && !consentState.MayRecord) {
                            this.fail('Consent could not be recorded. Please contact HR.');
                            return;
                        }
                        /* The test is over once the interview starts, and the
                           meter would otherwise keep sampling the microphone
                           for the whole sitting for nothing. */
                        this.stopMicMeter();
                        this.notice = '';
                        this.state = 'ready';
                    },
                    err => this.fail(this.messageFrom(err, 'Consent could not be recorded.')));
            },
            err => this.fail(this.messageFrom(err, 'Consent could not be recorded.')));
    }

    /* ---- recording -------------------------------------------------------- */

    get currentQuestion(): ScreeningQuestion {
        return this.questions[this.currentIndex] || null;
    }

    startRecording() {
        if (this.state !== 'ready' || !this.mediaStream) { return; }

        var q = this.currentQuestion;
        if (!q) { return; }

        this.chunks = [];
        this.errorMsg = '';

        try {
            this.recorder = new MediaRecorder(this.mediaStream);
        } catch (e) {
            this.errorMsg = 'This browser cannot record video. Please use a recent Chrome, Edge or Firefox.';
            return;
        }

        this.recorder.ondataavailable = (e: any) => {
            if (e.data && e.data.size > 0) { this.chunks.push(e.data); }
        };

        /* Upload happens on stop, whether the applicant stopped early or the
           timer ran out - one path, so a timed-out answer is never lost. */
        this.recorder.onstop = () => {
            this.zone.run(() => this.uploadCurrent());
        };

        this.recorder.start();
        this.startedAt = Date.now();
        this.state = 'recording';

        /* A limit of 0 - or a missing one - means the applicant answers for as
           long as they need and stops when they are ready. No countdown is
           started, so nothing can cut them off mid-sentence. */
        this.secondsLeft = q.TimeLimitSeconds > 0 ? q.TimeLimitSeconds : 0;
        if (this.secondsLeft > 0) { this.startTicking(); }
    }

    /* Whether this answer is on the clock. Drives the countdown pill and the
       wording underneath the button. */
    get isTimed(): boolean {
        return !!this.currentQuestion && this.currentQuestion.TimeLimitSeconds > 0;
    }

    stopRecording() {
        if (this.state !== 'recording') { return; }
        this.stopTicking();
        try { this.recorder.stop(); } catch (e) { /* already stopped */ }
    }

    private startTicking() {
        this.stopTicking();
        this.tickHandle = setInterval(() => {
            this.zone.run(() => {
                this.secondsLeft--;
                if (this.secondsLeft <= 0) { this.stopRecording(); }
            });
        }, 1000);
    }

    private stopTicking() {
        if (this.tickHandle) { clearInterval(this.tickHandle); this.tickHandle = null; }
    }

    /* ---- upload ----------------------------------------------------------- */

    private uploadCurrent() {
        var q = this.currentQuestion;
        if (!q) { return; }

        var seconds = Math.max(1, Math.round((Date.now() - this.startedAt) / 1000));
        var blob = new Blob(this.chunks, { type: 'video/webm' });
        this.chunks = [];
        this.state = 'uploading';

        this.api.uploadAnswer(this.token, this.access.AttemptId, q.AttemptQuestionId,
                              seconds, blob, 'answer-' + q.AttemptQuestionId + '.webm').subscribe(
            () => {
                if (this.answeredIds.indexOf(q.AttemptQuestionId) < 0) {
                    this.answeredIds.push(q.AttemptQuestionId);
                }
                this.advance();
            },
            err => {
                /* Back to 'ready' on the SAME question, not forward: the answer
                   did not reach the server, so moving on would silently drop
                   it. Re-recording is allowed - the newest take counts. */
                this.state = 'ready';
                this.errorMsg = this.messageFrom(err,
                    'That answer could not be uploaded. Please record it again.');
            });
    }

    private advance() {
        var next = this.firstUnansweredIndex();
        if (next < 0) { this.finish(); return; }
        this.currentIndex = next;
        this.notice = '';
        this.state = 'ready';
    }

    private firstUnansweredIndex(): number {
        for (var i = 0; i < this.questions.length; i++) {
            if (this.answeredIds.indexOf(this.questions[i].AttemptQuestionId) < 0) { return i; }
        }
        return -1;
    }

    /* ---- finishing -------------------------------------------------------- */

    /* Submitting early is allowed. A partial sitting is kept and shown to HR as
       partial rather than discarded, and it still counts as Conducted - the
       applicant reached the end of their session. */
    finish() {
        this.state = 'loading';
        this.api.completeInterview(this.token, this.access.AttemptId).subscribe(
            () => {
                this.releaseCamera();
                this.state = 'done';
            },
            err => {
                this.state = 'ready';
                this.errorMsg = this.messageFrom(err, 'We could not submit your interview. Please try again.');
            });
    }

    get answeredCount(): number { return this.answeredIds.length; }
    get totalCount(): number { return this.questions.length; }

    /* ---- helpers ----------------------------------------------------------- */

    private fail(message: string) {
        this.stopTicking();
        this.releaseCamera();
        this.state = 'error';
        this.errorMsg = message;
    }

    private messageFrom(err: any, fallback: string): string {
        if (err && err.error && err.error.message) { return err.error.message; }
        if (err && err.status === 0) {
            return 'We could not reach the server. Please check your connection and try again.';
        }
        return fallback;
    }
}
