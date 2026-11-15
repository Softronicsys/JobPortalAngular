/*
 * Watches the microphone while an answer is being recorded, and says
 * something out loud when the applicant has been silent too long.
 *
 * WHY A SOUND AND NOT A BANNER
 * Someone who has stopped talking is usually looking at the camera, or at
 * nothing, or at their own hands - not reading the page. A line of text
 * appearing in the corner is the one form of nudge they are least likely to
 * notice. A sound reaches them without asking them to look anywhere.
 *
 * A TONE, NOT A VOICE
 * A synthesised voice talking over an interview is intrusive in a way a
 * chime is not: it interrupts the applicant's train of thought, it lands in
 * the recording as a second speaker, and on a shared machine it announces to
 * the room that someone has gone quiet. Two short notes carry the same
 * message - "we are still waiting" - and stop mattering the moment they are
 * understood.
 *
 * THE CUE MUST NOT COUNT AS SPEECH
 * It comes out of the speakers and goes straight back into the microphone,
 * which would read as the applicant answering: the silence run resets, and
 * the next prompt never fires. So measurement is suspended across the cue.
 * Without this the feature appears to work and quietly alerts exactly once.
 *
 * SEPARATE FROM THE DEVICE-TEST METER
 * Same idea, different lifetime and different question. The meter runs before
 * the interview and answers "can we hear you at all"; this runs during an
 * answer and answers "are you still talking". Sharing one AudioContext across
 * both would tie the meter's teardown to the recording's.
 */

export interface SpeechSummary {
    /* Share of the answer during which the applicant was audible, 0-100. */
    speakingPercent: number;

    /* The longest unbroken quiet stretch, in seconds. The number HR actually
       wants: a candidate who paused for 40 seconds once reads very
       differently from one who paused for 4 seconds ten times. */
    longestSilenceSeconds: number;

    /* How many times they were prompted aloud. */
    silenceAlertCount: number;

    sampleCount: number;
}

export class SpeechMonitor {

    /* 100ms, matching the device-test meter. Fast enough that a short pause
       is measured honestly, slow enough to cost nothing. */
    private static readonly SampleMs = 100;

    /* Peak deviation from the 128 centre line, out of 128. Deliberately low:
       the question is "is anybody talking", not "are they talking clearly",
       and a quiet speaker on a laptop microphone must not be logged as
       silent. */
    private static readonly SpeakingThreshold = 0.06;

    /* 300ms of speech before the prompt is considered answered. Long
       enough to ignore a noise, short enough that it feels immediate. */
    private static readonly ResumeSamples = 3;

    /* How long quiet has to last before the applicant is prompted. */
    private readonly silenceAlertSeconds: number;

    private ctx: any = null;
    private analyser: any = null;
    private timer: any = null;

    private samples = 0;
    private speakingSamples = 0;
    private currentSilenceMs = 0;
    private longestSilenceMs = 0;
    private alerts = 0;

    /* True from the start of a spoken prompt until a moment after it ends.
       See the header: our own voice must not be measured as theirs. */
    private muted = false;
    private mutedUntil = 0;

    /* One prompt per quiet stretch. Re-armed when speech resumes, so an
       applicant who goes quiet twice is prompted twice, but one who simply
       stays quiet is not nagged every thirty seconds. */
    private alertedThisRun = false;

    /* Consecutive speaking samples since the quiet ended. A single sample is
       a cough, a chair, a door - not an answer resuming - and clearing the
       notice on one would make it flicker at every small noise. */
    private resumeRun = 0;

    constructor(silenceAlertSeconds?: number) {
        this.silenceAlertSeconds = silenceAlertSeconds > 0 ? silenceAlertSeconds : 30;
    }

    /* Returns false when the browser has no Web Audio at all. The caller
       carries on recording regardless - a missing monitor costs a metric, not
       an interview. */
    start(stream: any, alert: () => void, resumed: () => void): boolean {
        this.stop();
        this.reset();

        var Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!Ctx || !stream) { return false; }

        try {
            this.ctx = new Ctx();
            var source = this.ctx.createMediaStreamSource(stream);
            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 512;
            source.connect(this.analyser);
        } catch (e) {
            this.analyser = null;
            this.ctx = null;
            return false;
        }

        /* Safari suspends a context created outside a user gesture. The
           recording itself starts from a click, so this resolves - but it
           has to be asked for explicitly or every sample reads as silence. */
        if (this.ctx.state === 'suspended' && this.ctx.resume) {
            try { this.ctx.resume(); } catch (e) { /* best effort */ }
        }

        var buffer = new Uint8Array(this.analyser.frequencyBinCount);
        var self = this;

        this.timer = setInterval(function () {
            if (!self.analyser) { return; }

            if (self.muted || Date.now() < self.mutedUntil) { return; }

            self.analyser.getByteTimeDomainData(buffer);

            var peak = 0;
            for (var i = 0; i < buffer.length; i++) {
                var d = Math.abs(buffer[i] - 128);
                if (d > peak) { peak = d; }
            }

            self.samples++;
            var speaking = (peak / 128) >= SpeechMonitor.SpeakingThreshold;

            if (speaking) {
                self.speakingSamples++;
                self.currentSilenceMs = 0;
                self.resumeRun++;

                /* Tell the caller once, and only if they were prompted:
                   there is nothing to take down otherwise. Re-arming here
                   rather than on the first speaking sample is what makes
                   the next quiet stretch promptable again. */
                if (self.alertedThisRun && self.resumeRun >= SpeechMonitor.ResumeSamples) {
                    self.alertedThisRun = false;
                    try { resumed(); } catch (e) { /* nothing to undo */ }
                }
                return;
            }

            self.resumeRun = 0;
            self.currentSilenceMs += SpeechMonitor.SampleMs;
            if (self.currentSilenceMs > self.longestSilenceMs) {
                self.longestSilenceMs = self.currentSilenceMs;
            }

            if (!self.alertedThisRun
                && self.currentSilenceMs >= self.silenceAlertSeconds * 1000) {
                self.alertedThisRun = true;
                self.alerts++;
                self.cueAndIgnoreOurOwnSound(alert);
            }
        }, SpeechMonitor.SampleMs);

        return true;
    }

    /* Stops sampling and hands back what was measured. Safe to call twice. */
    stop(): SpeechSummary {
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
        this.analyser = null;
        if (this.ctx && this.ctx.close) {
            try { this.ctx.close(); } catch (e) { /* already closed */ }
        }
        this.ctx = null;
        return this.summary();
    }

    summary(): SpeechSummary {
        return {
            speakingPercent: this.samples > 0
                ? Math.round((this.speakingSamples / this.samples) * 1000) / 10
                : 0,
            longestSilenceSeconds: Math.round(this.longestSilenceMs / 100) / 10,
            silenceAlertCount: this.alerts,
            sampleCount: this.samples
        };
    }

    private reset() {
        this.samples = 0;
        this.speakingSamples = 0;
        this.currentSilenceMs = 0;
        this.longestSilenceMs = 0;
        this.alerts = 0;
        this.muted = false;
        this.mutedUntil = 0;
        this.alertedThisRun = false;
        this.resumeRun = 0;
    }

    /* Sounds the cue, with measurement suspended across it.

       The tone is short, but the room's echo is not, so measurement stays
       off for a beat longer than the sound itself. */
    private cueAndIgnoreOurOwnSound(alert: () => void) {
        var self = this;
        this.muted = true;
        this.mutedUntil = Date.now() + 3000;

        /* The silence run is cleared around the cue. Keeping it would make
           the longest-silence figure include the time our own noise was
           covering the microphone, which is ours, not theirs. */
        this.currentSilenceMs = 0;

        try {
            alert();
        } catch (e) { /* a cue that cannot sound is not worth failing over */ }

        setTimeout(function () {
            self.muted = false;
            self.mutedUntil = Date.now() + 900;
        }, 1100);
    }
}

/* The silence cue: two short notes, generated rather than loaded.

   WHY A GENERATED TONE AND NOT AN AUDIO FILE
   Nothing to ship, nothing to 404, nothing to wait for on a slow connection
   at the one moment it is needed. The device test already sounds a tone the
   same way, so this also routes through whichever output the applicant
   picked there.

   WHY TWO NOTES AND NOT ONE
   A single beep is the sound every other thing on a computer makes. A rising
   pair reads as a prompt rather than an error, and is distinct enough from
   notification noise that the applicant knows it came from the interview.

   The envelope matters more than it looks: ramping the gain up and down
   instead of switching it produces a soft chime rather than a click, and a
   click is both unpleasant and much more likely to be picked up as speech by
   the very meter that triggered it. Returns false when the browser has no
   Web Audio, which the room treats as "show the notice alone". */
export function playSilenceCue(): boolean {
    var Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) { return false; }

    try {
        var ctx = new Ctx();
        var now = ctx.currentTime;

        /* A5 then D6 - a small rising interval, quiet and brief. */
        note(ctx, 880, now, 0.18);
        note(ctx, 1175, now + 0.22, 0.22);

        /* The context is closed once the sound is done. A page that opens one
           per prompt and never closes them runs into the browser's limit on
           live audio contexts, after which the cue silently stops working. */
        setTimeout(function () {
            if (ctx.close) { try { ctx.close(); } catch (e) { /* already closed */ } }
        }, 900);

        return true;
    } catch (e) {
        return false;
    }
}

function note(ctx: any, hz: number, at: number, seconds: number) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = hz;

    /* Deliberately well below full scale. This plays over an interview, not
       into an empty room. */
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.18, at + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(at);
    osc.stop(at + seconds + 0.02);
}
