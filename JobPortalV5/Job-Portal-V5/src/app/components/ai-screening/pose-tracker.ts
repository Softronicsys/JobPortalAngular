/*
 * Head movement tracking for one answer, running in the applicant's browser.
 *
 * WHAT THIS IS AND IS NOT
 * It reports how steadily someone faced their camera while answering. It is
 * NOT a proctoring verdict and must never be presented as one. It runs on a
 * device we do not control, on a model that can fail to load, through a
 * camera that may be mounted anywhere - so the output is an observation, and
 * the stored row says so by naming its Source.
 *
 * MEASURED AGAINST THE APPLICANT'S OWN NEUTRAL, NOT AN ABSOLUTE
 * Absolute head pose from a webcam is unreliable in exactly the ways that
 * matter here: a laptop on a low desk tilts every face downward, a phone held
 * to one side skews every yaw, and face geometry differs between people. Any
 * fixed "facing the camera" threshold therefore penalises hardware and bone
 * structure rather than behaviour.
 *
 * So the first second and a half of each answer establishes THIS applicant's
 * neutral on THIS camera, and everything after is measured as deviation from
 * it. The question becomes "did they turn away from where they started",
 * which is both answerable and fair.
 *
 * DEGREES ARE APPROXIMATE
 * Yaw and pitch are derived from the geometry of a handful of landmarks, not
 * from a solved 3D pose. They are calibrated to be about right in the range
 * that matters (roughly +-40 degrees) and should be read as indicative
 * magnitudes, not measurements. They are stored because "turned 35 degrees
 * away" is more useful to a person than a unitless score, not because they
 * are precise.
 *
 * FAILURE IS SILENT AND TOTAL
 * If the CDN is blocked, the model will not load, or the device is too slow,
 * the tracker reports that it is unavailable and the interview proceeds with
 * no pose metrics at all. There is no degraded mode, because a stability
 * score built from four samples of a half-loaded model is worse than none.
 */

export interface PoseSummary {
    /* Share of samples in which a face was found, 0-100. Low numbers mean
       the applicant was out of frame, in the dark, or the model struggled -
       which is why it is reported separately rather than folded into the
       stability score. */
    faceVisiblePercent: number;

    /* 0-100. 100 is a person who held the position they started in. Falls as
       they turn away, and falls faster for sustained turns than for glances. */
    stabilityScore: number;

    /* A look away is a sustained turn, not a flicker - see LookAwayHoldMs. */
    lookAwayCount: number;
    lookAwaySeconds: number;

    meanAbsYawDegrees: number;
    meanAbsPitchDegrees: number;
    maxAbsYawDegrees: number;
    maxAbsPitchDegrees: number;

    sampleCount: number;
}

/* The CDN build. A classic script exposing a global, deliberately: this
   project builds with Angular 6 and TypeScript 2.7, where a dynamic import of
   an ES module is transpiled to require() and fails at runtime. A <script>
   tag sidesteps the build entirely.

   The version is pinned. An unpinned MediaPipe URL has broken before when the
   wasm and the JS drifted apart mid-release. */
const MEDIAPIPE_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/';
const MEDIAPIPE_SCRIPT = MEDIAPIPE_BASE + 'face_mesh.js';

/* Landmark indices in MediaPipe's 468-point mesh. */
const LM_NOSE_TIP = 1;
const LM_FOREHEAD = 10;
const LM_CHIN = 152;
const LM_EYE_OUTER_L = 33;
const LM_EYE_OUTER_R = 263;

/* One shared load for the whole page. Two answers in a row must not fetch
   the model twice, and the second question must not wait for a second load. */
let scriptPromise: Promise<boolean> = null;

function loadMediaPipe(): Promise<boolean> {
    if (scriptPromise) { return scriptPromise; }

    scriptPromise = new Promise<boolean>(function (resolve) {
        if ((window as any).FaceMesh) { resolve(true); return; }

        var el = document.createElement('script');
        el.src = MEDIAPIPE_SCRIPT;
        el.async = true;
        el.crossOrigin = 'anonymous';

        /* A model that never arrives must not hang the interview. Ten
           seconds is generous for a CDN and short enough that an applicant
           on a blocked network is not left staring at a dead page - they
           simply get no pose metrics. */
        var settled = false;
        var finish = function (ok: boolean) {
            if (settled) { return; }
            settled = true;
            resolve(ok && !!(window as any).FaceMesh);
        };

        el.onload = function () { finish(true); };
        el.onerror = function () { finish(false); };
        setTimeout(function () { finish(false); }, 10000);

        document.head.appendChild(el);
    });

    return scriptPromise;
}

export class PoseTracker {

    /* Five samples a second. Enough to catch a two-second glance away, and
       light enough not to compete with the encoder for CPU on a phone -
       which matters, because the recording is the thing that must not
       stutter. */
    private static readonly SampleMs = 200;

    /* How long the neutral position is learned for, before measurement
       starts. */
    private static readonly BaselineMs = 1500;

    /* Deviation from neutral that counts as turned away. */
    private static readonly YawAwayDegrees = 25;
    private static readonly PitchAwayDegrees = 20;

    /* A turn has to persist to count. Without this, every blink-adjacent
       jitter and every model hiccup becomes a "look away" and the count is
       meaningless. */
    private static readonly LookAwayHoldMs = 1000;

    private mesh: any = null;
    private timer: any = null;
    private video: any = null;
    private busy = false;
    private running = false;

    /* baseline */
    private baselineUntil = 0;
    private baseYawSum = 0;
    private basePitchSum = 0;
    private baseCount = 0;
    private baseYaw = 0;
    private basePitch = 0;

    /* measurements */
    private samples = 0;
    private facesSeen = 0;

    /* Faces that were actually measured, which is NOT the same as faces
       seen: the ones spent learning the neutral position contribute no
       deviation, and dividing by them would dilute the mean and flatter
       every candidate whose baseline took a while. */
    private scoredSamples = 0;
    private absYawSum = 0;
    private absPitchSum = 0;
    private maxAbsYaw = 0;
    private maxAbsPitch = 0;
    private deviationSum = 0;

    /* look-away run tracking */
    private awayMs = 0;
    private awayTotalMs = 0;
    private awayCount = 0;
    private countedThisRun = false;

    /* Loads the model and begins sampling the given <video>.
       Resolves false when pose tracking is not available here, in which case
       nothing was started and stop() will report no samples. */
    start(videoEl: any): Promise<boolean> {
        var self = this;
        this.stop();
        this.reset();

        if (!videoEl) { return Promise.resolve(false); }

        return loadMediaPipe().then(function (ok) {
            if (!ok) { return false; }

            try {
                var FaceMesh = (window as any).FaceMesh;
                self.mesh = new FaceMesh({
                    locateFile: function (file: string) { return MEDIAPIPE_BASE + file; }
                });
                self.mesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: false,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });
                self.mesh.onResults(function (results: any) { self.onResults(results); });
            } catch (e) {
                self.mesh = null;
                return false;
            }

            self.video = videoEl;
            self.running = true;
            self.baselineUntil = Date.now() + PoseTracker.BaselineMs;

            self.timer = setInterval(function () { self.tick(); }, PoseTracker.SampleMs);
            return true;
        });
    }

    stop(): PoseSummary {
        this.running = false;
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
        if (this.mesh && this.mesh.close) {
            try { this.mesh.close(); } catch (e) { /* already closed */ }
        }
        this.mesh = null;
        this.video = null;
        return this.summary();
    }

    summary(): PoseSummary {
        var measured = this.samples;
        var faces = this.facesSeen;
        var scored = this.scoredSamples;

        /* Stability is the mean deviation from neutral, expressed as a
           score. The divisor sets how unforgiving it is: at 45 degrees of
           average deviation the score reaches zero. Someone glancing at
           their notes briefly loses a little; someone facing away for half
           the answer loses most of it.

           Samples with no face found are NOT counted as deviation. They are
           reported in faceVisiblePercent instead, because "we could not see
           them" and "they turned away" are different claims and merging them
           would invent the more accusatory one. */
        var meanDeviation = scored > 0 ? (this.deviationSum / scored) : 0;
        var stability = scored > 0
            ? Math.max(0, Math.min(100, 100 - (meanDeviation / 45) * 100))
            : 100;

        return {
            faceVisiblePercent: measured > 0 ? round1((faces / measured) * 100) : 0,
            /* With a face seen but nothing yet scored - a very short answer,
               entirely inside the baseline window - the honest reading is
               "nothing observed against them", not zero. */
            stabilityScore: faces > 0 ? round1(stability) : 0,
            lookAwayCount: this.awayCount,
            lookAwaySeconds: round1(this.awayTotalMs / 1000),
            meanAbsYawDegrees: scored > 0 ? round1(this.absYawSum / scored) : 0,
            meanAbsPitchDegrees: scored > 0 ? round1(this.absPitchSum / scored) : 0,
            maxAbsYawDegrees: round1(this.maxAbsYaw),
            maxAbsPitchDegrees: round1(this.maxAbsPitch),
            sampleCount: measured
        };
    }

    /* Whether anything was actually measured. The room uses this to decide
       whether to send pose numbers at all - sending zeros from a tracker
       that never ran would read as a candidate who never looked up. */
    get hasData(): boolean {
        return this.samples > 0 && this.facesSeen > 0;
    }

    private reset() {
        this.busy = false;
        this.baseYawSum = 0; this.basePitchSum = 0; this.baseCount = 0;
        this.baseYaw = 0; this.basePitch = 0;
        this.samples = 0; this.facesSeen = 0; this.scoredSamples = 0;
        this.absYawSum = 0; this.absPitchSum = 0;
        this.maxAbsYaw = 0; this.maxAbsPitch = 0;
        this.deviationSum = 0;
        this.awayMs = 0; this.awayTotalMs = 0; this.awayCount = 0;
        this.countedThisRun = false;
    }

    /* One sample. Skipped while a previous frame is still in the model:
        falling behind would queue frames and make the whole page stutter,
        and a dropped sample costs nothing we need. */
    private tick() {
        if (!this.running || !this.mesh || !this.video || this.busy) { return; }
        if (this.video.readyState < 2) { return; }

        this.busy = true;
        var self = this;
        try {
            var p = this.mesh.send({ image: this.video });
            if (p && p.then) {
                p.then(function () { self.busy = false; },
                       function () { self.busy = false; });
            } else {
                this.busy = false;
            }
        } catch (e) {
            this.busy = false;
        }
    }

    private onResults(results: any) {
        if (!this.running) { return; }

        this.samples++;

        var marks = results && results.multiFaceLandmarks && results.multiFaceLandmarks.length
            ? results.multiFaceLandmarks[0]
            : null;

        if (!marks) {
            /* No face. Not a look away - we cannot tell the difference
               between someone who left and someone the model lost - so only
               the visibility figure moves. */
            this.endAwayRun();
            return;
        }

        this.facesSeen++;

        var pose = estimatePose(marks);
        if (pose === null) { return; }

        /* Still learning this applicant's neutral - or still waiting for a
           first look at them.

           The second condition matters more than it looks. If the baseline
           window elapses with nobody in frame, baseYaw and basePitch would
           stay at zero and every later sample would be measured against a
           head pointing exactly at the lens. A normal face sits around 20
           degrees of apparent pitch under this estimator, so the applicant
           would be scored as permanently looking down for the whole answer -
           penalised, in other words, for having started slightly late or
           sat slightly off-centre. Learning continues until there is
           actually something to learn from. */
        if (Date.now() < this.baselineUntil || this.baseCount === 0) {
            this.baseYawSum += pose.yaw;
            this.basePitchSum += pose.pitch;
            this.baseCount++;
            this.baseYaw = this.baseYawSum / this.baseCount;
            this.basePitch = this.basePitchSum / this.baseCount;
            return;
        }

        var yaw = pose.yaw - this.baseYaw;
        var pitch = pose.pitch - this.basePitch;
        var absYaw = Math.abs(yaw);
        var absPitch = Math.abs(pitch);

        this.scoredSamples++;
        this.absYawSum += absYaw;
        this.absPitchSum += absPitch;
        if (absYaw > this.maxAbsYaw) { this.maxAbsYaw = absYaw; }
        if (absPitch > this.maxAbsPitch) { this.maxAbsPitch = absPitch; }

        /* One number for "how far from neutral", combining both axes. */
        this.deviationSum += Math.sqrt(yaw * yaw + pitch * pitch);

        if (absYaw > PoseTracker.YawAwayDegrees || absPitch > PoseTracker.PitchAwayDegrees) {
            this.awayMs += PoseTracker.SampleMs;
            this.awayTotalMs += PoseTracker.SampleMs;
            if (!this.countedThisRun && this.awayMs >= PoseTracker.LookAwayHoldMs) {
                this.countedThisRun = true;
                this.awayCount++;
            }
        } else {
            this.endAwayRun();
        }
    }

    private endAwayRun() {
        this.awayMs = 0;
        this.countedThisRun = false;
    }
}

/* Yaw and pitch from mesh geometry.

   Yaw: as the head turns, the nose tip slides toward the ear on that side,
   while the distance between the outer eye corners stays roughly fixed in the
   face's own frame. The nose's horizontal offset from the midpoint between
   the eyes, divided by half that eye span, is therefore a usable proxy. It is
   fed through asin so the response flattens near the extremes the way a real
   rotation does.

   Pitch: the nose sits a fairly constant fraction of the way down the face at
   rest, so the nose's vertical position between the eye line and the chin
   moves predictably as the head tips. The scale factor converts that ratio
   into something close to degrees over the useful range.

   Both are relative measures made absolute only by the caller's baseline, so
   a systematic error in either - a camera below eye level, say - cancels out.
   Returns null when the landmarks are degenerate, which happens on a face at
   the very edge of frame. */
function estimatePose(marks: any[]): { yaw: number, pitch: number } {
    var nose = marks[LM_NOSE_TIP];
    var eyeL = marks[LM_EYE_OUTER_L];
    var eyeR = marks[LM_EYE_OUTER_R];
    var chin = marks[LM_CHIN];
    var brow = marks[LM_FOREHEAD];

    if (!nose || !eyeL || !eyeR || !chin || !brow) { return null; }

    var eyeSpan = Math.abs(eyeR.x - eyeL.x);
    var faceHeight = Math.abs(chin.y - brow.y);
    if (eyeSpan < 0.01 || faceHeight < 0.01) { return null; }

    var eyeMidX = (eyeL.x + eyeR.x) / 2;
    var eyeMidY = (eyeL.y + eyeR.y) / 2;

    var yawRatio = clamp((nose.x - eyeMidX) / (eyeSpan / 2), -1, 1);
    var yaw = Math.asin(yawRatio) * (180 / Math.PI);

    var pitchRatio = (nose.y - eyeMidY) / faceHeight;
    var pitch = pitchRatio * 120;

    return { yaw: yaw, pitch: pitch };
}

function clamp(v: number, lo: number, hi: number): number {
    return v < lo ? lo : (v > hi ? hi : v);
}

function round1(v: number): number {
    return Math.round(v * 10) / 10;
}
