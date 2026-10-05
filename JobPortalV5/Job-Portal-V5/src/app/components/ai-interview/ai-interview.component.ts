import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GeminiService } from '@app/Service/gemini.service';
import { ROLES_DATA } from './ai-interview.roles';
import {
  CandidateMetrics,
  INITIAL_METRICS,
  LogEntry,
  MediaDeviceOption,
  METRICS_SCHEMA,
  INTRO_TEXT,
  INTERVIEW_QUESTIONS,
  OUTRO_TEXT
} from './ai-interview.model';

/* MediaRecorder is absent from the DOM typings shipped with TypeScript 2.7. */
declare var MediaRecorder: any;

interface ChartBar {
  name: string;
  score: number;
  fill: string;
}

interface Verdict {
  label: string;
  cssClass: string;
}

@Component({
  selector: 'app-ai-interview',
  templateUrl: './ai-interview.component.html',
  styleUrls: ['./ai-interview.component.css']
})
export class AiInterviewComponent implements OnInit, OnDestroy {

  /* 'recruiter' | 'candidate' | 'schedule' */
  viewMode = 'recruiter';
  /* 'idle' | 'recording' | 'review' | 'analyzing' | 'complete' */
  appState = 'idle';

  selectedModel = 'gemini-2.5-flash';
  metrics: CandidateMetrics = this.cloneMetrics(INITIAL_METRICS);
  logs: LogEntry[] = [];
  errorMsg: string = null;

  /* Recording */
  recordedBlob: Blob = null;
  recordingTime = 0;
  private mediaRecorder: any = null;
  private chunks: Blob[] = [];
  private timerId: any = null;

  /* Interview flow */
  interviewQuestions: string[] = [];
  currentQuestionIndex = -1; // -1 renders the introduction
  isGeneratingQuestions = false;
  aiSpeaking = false;
  isPreparingNext = false;

  /* Audio */
  private audioContext: AudioContext = null;
  private currentSource: AudioBufferSourceNode = null;
  private audioCache: { [key: string]: AudioBuffer } = {};
  private ttsPromises: { [key: string]: Promise<AudioBuffer> } = {};
  private lastTtsRequest: Promise<any> = Promise.resolve();

  /* Devices */
  videoDevices: MediaDeviceOption[] = [];
  audioDevices: MediaDeviceOption[] = [];
  selectedVideoId = '';
  selectedAudioId = '';
  hasPermissions = false;
  hasConsented = false;
  private stream: MediaStream = null;

  /* Schedule tab */
  scheduleDate = '';
  scheduleTime = '';
  isScheduled = false;

  private liveVideoEl: HTMLVideoElement = null;
  private previewVideoEl: HTMLVideoElement = null;
  private deviceChangeHandler: any = null;
  private destroyed = false;

  readonly models = [
    { value: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'llama-4-vision', label: 'Llama 4 Vision' },
    { value: 'llama-3.2-90b-vision', label: 'Llama 3.2 90B Vision' },
    { value: 'qwen2.5-vl-max', label: 'Qwen2.5 VL Max' },
    { value: 'qwen-vl-max', label: 'Qwen VL Max' }
  ];

  constructor(private gemini: GeminiService, private zone: NgZone) { }

  /* The live preview and the playback element both sit behind *ngIf, so we bind
     the stream as soon as Angular hands us the element. */
  @ViewChild('liveVideo')
  set liveVideo(ref: ElementRef) {
    this.liveVideoEl = ref ? ref.nativeElement : null;
    this.attachStream();
  }

  @ViewChild('previewVideo')
  set previewVideo(ref: ElementRef) {
    this.previewVideoEl = ref ? ref.nativeElement : null;
    this.attachRecordedBlob();
  }

  ngOnInit() {
    this.loadDevices();
    this.deviceChangeHandler = () => this.zone.run(() => this.loadDevices());
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', this.deviceChangeHandler);
    }

    if (!this.gemini.isConfigured) {
      this.addLog('system', 'Gemini API key is not configured - speech and analysis are disabled.');
    }

    // Warm the cache so the intro and first question start without a delay.
    this.prefetchAudio(INTRO_TEXT);
    this.prefetchAudio(INTERVIEW_QUESTIONS[0]);
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.deviceChangeHandler && navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
      navigator.mediaDevices.removeEventListener('devicechange', this.deviceChangeHandler);
    }
    this.stopTimer();
    this.stopStream();
    this.stopSpeech();
    if (this.audioContext) {
      try { this.audioContext.close(); } catch (e) { /* ignore */ }
      this.audioContext = null;
    }
  }

  // ---------------------------------------------------------------- view mode

  setViewMode(mode: string) {
    if (this.appState === 'recording') {
      return;
    }
    this.viewMode = mode;
    if (mode === 'candidate' && this.appState === 'idle') {
      this.startCamera();
    } else if (mode !== 'candidate') {
      this.stopStream();
    }
  }

  // ------------------------------------------------------------------ devices

  private loadDevices(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      this.errorMsg = 'This browser does not expose media devices.';
      return Promise.resolve();
    }
    return navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) => {
      this.videoDevices = devices
        .filter(d => d.kind === 'videoinput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || 'Camera ' + d.deviceId.slice(0, 4) }));
      this.audioDevices = devices
        .filter(d => d.kind === 'audioinput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || 'Mic ' + d.deviceId.slice(0, 4) }));

      if (this.videoDevices.length > 0 && !this.selectedVideoId) {
        this.selectedVideoId = this.videoDevices[0].deviceId;
      }
      if (this.audioDevices.length > 0 && !this.selectedAudioId) {
        this.selectedAudioId = this.audioDevices[0].deviceId;
      }
      // Labels are only populated once permission has been granted.
      this.hasPermissions = devices.some(d => !!d.label);
    }).catch((e: any) => {
      console.error('Error loading devices:', e);
    });
  }

  requestPermissions() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((s: MediaStream) => {
        s.getTracks().forEach(t => t.stop());
        return this.loadDevices();
      })
      .then(() => {
        this.zone.run(() => {
          this.hasPermissions = true;
          this.errorMsg = null;
          this.startCamera();
        });
      })
      .catch((e: any) => {
        this.zone.run(() => {
          this.errorMsg = 'Permission denied. Please allow camera/microphone access.';
        });
      });
  }

  onDeviceChange() {
    if (this.viewMode === 'candidate' && this.appState === 'idle') {
      this.startCamera();
    }
  }

  private startCamera() {
    this.stopStream();
    const constraints: any = {
      video: this.selectedVideoId ? { deviceId: { exact: this.selectedVideoId } } : true,
      audio: this.selectedAudioId ? { deviceId: { exact: this.selectedAudioId } } : true
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((newStream: MediaStream) => {
        this.zone.run(() => {
          if (this.destroyed) {
            newStream.getTracks().forEach(t => t.stop());
            return;
          }
          this.stream = newStream;
          this.errorMsg = null;
          this.attachStream();
        });
      })
      .catch((e: any) => {
        this.zone.run(() => {
          this.errorMsg = 'Failed to access camera: ' + (e && e.message ? e.message : e);
        });
      });
  }

  private attachStream() {
    if (this.liveVideoEl && this.stream) {
      (this.liveVideoEl as any).srcObject = this.stream;
    }
  }

  private attachRecordedBlob() {
    if (this.previewVideoEl && this.recordedBlob) {
      this.previewVideoEl.src = URL.createObjectURL(this.recordedBlob);
    }
  }

  private stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  get cameraReady(): boolean {
    return !!this.stream;
  }

  // -------------------------------------------------------------------- audio

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const Ctor: any = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new Ctor({ sampleRate: 24000 });
    }
    return this.audioContext;
  }

  private ensureAudioContext(): Promise<void> {
    const ctx = this.getAudioContext();
    if (ctx.state === 'suspended') {
      return ctx.resume().catch(() => { /* ignore */ });
    }
    return Promise.resolve();
  }

  private decodeBase64(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /* Gemini returns raw signed 16-bit PCM, so we build the AudioBuffer by hand. */
  private pcmToAudioBuffer(data: Uint8Array, ctx: AudioContext, sampleRate = 24000, channels = 1): AudioBuffer {
    const ints = new Int16Array(data.buffer, data.byteOffset, Math.floor(data.byteLength / 2));
    const frameCount = Math.floor(ints.length / channels);
    const buffer = ctx.createBuffer(channels, frameCount, sampleRate);
    for (let channel = 0; channel < channels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = ints[i * channels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  /* Requests are chained (and spaced) so a burst of prefetches does not trip rate limits. */
  private prefetchAudio(text: string) {
    if (!text || !this.gemini.isConfigured) {
      return;
    }
    if (this.audioCache[text] || this.ttsPromises[text]) {
      return;
    }

    const promise = this.lastTtsRequest
      .then(() => new Promise(resolve => setTimeout(resolve, 250)))
      .then(() => this.gemini.textToSpeech(text))
      .then((base64: string) => {
        if (!base64) {
          return null;
        }
        const ctx = this.getAudioContext();
        const buffer = this.pcmToAudioBuffer(this.decodeBase64(base64), ctx);
        this.audioCache[text] = buffer;
        return buffer;
      })
      .catch((e: any) => {
        console.warn('TTS prefetch warning:', e && e.message ? e.message : e);
        return null; // keep the chain alive
      });

    this.lastTtsRequest = promise;
    this.ttsPromises[text] = promise;
  }

  private getAudioForText(text: string): Promise<AudioBuffer> {
    if (this.audioCache[text]) {
      return Promise.resolve(this.audioCache[text]);
    }
    if (!this.ttsPromises[text]) {
      this.prefetchAudio(text);
    }
    return this.ttsPromises[text] || Promise.resolve(null);
  }

  /* Resolves when playback finishes. Falls back to the browser speech engine. */
  private playAudio(text: string): Promise<void> {
    this.zone.run(() => this.aiSpeaking = true);
    this.stopSpeech(false);

    return new Promise<void>(resolve => {
      let settled = false;
      const complete = () => {
        if (settled) { return; }
        settled = true;
        this.zone.run(() => this.aiSpeaking = false);
        resolve();
      };

      const fallback = () => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.onend = complete;
          utterance.onerror = complete;
          window.speechSynthesis.speak(utterance);
        } else {
          complete();
        }
      };

      if (!this.gemini.isConfigured) {
        fallback();
        return;
      }

      this.getAudioForText(text).then((buffer: AudioBuffer) => {
        if (!buffer) {
          fallback();
          return;
        }
        const ctx = this.getAudioContext();
        const start = () => {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.onended = complete;
          source.start();
          this.currentSource = source;
        };
        if (ctx.state === 'suspended') {
          ctx.resume().then(start).catch(() => fallback());
        } else {
          start();
        }
      }).catch(() => fallback());
    });
  }

  private stopSpeech(clearFlag = true) {
    if (this.currentSource) {
      try { this.currentSource.onended = null; this.currentSource.stop(); } catch (e) { /* ignore */ }
      this.currentSource = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (clearFlag) {
      this.aiSpeaking = false;
    }
  }

  // ---------------------------------------------------------- interview flow

  startCandidateSession() {
    if (!this.stream) {
      this.errorMsg = 'Camera not ready.';
      return;
    }

    this.ensureAudioContext()
      .then(() => {
        this.prefetchAudio(INTRO_TEXT);
        this.isGeneratingQuestions = true;
        this.interviewQuestions = INTERVIEW_QUESTIONS.slice();
        this.isGeneratingQuestions = false;

        this.prefetchAudio(this.interviewQuestions[0]);
        if (this.interviewQuestions.length > 1) {
          this.prefetchAudio(this.interviewQuestions[1]);
        }

        if (!this.startRecording()) {
          return Promise.resolve();
        }

        this.currentQuestionIndex = -1;
        return this.playAudio(INTRO_TEXT).then(() => {
          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.zone.run(() => this.currentQuestionIndex = 0);
            return this.playAudio(this.interviewQuestions[0]);
          }
          return Promise.resolve();
        });
      })
      .catch((e: any) => {
        this.zone.run(() => this.errorMsg = 'Could not start the session: ' + (e && e.message ? e.message : e));
      });
  }

  nextQuestion() {
    this.ensureAudioContext().then(() => {
      const nextIdx = this.currentQuestionIndex + 1;

      if (nextIdx < this.interviewQuestions.length) {
        const nextText = this.interviewQuestions[nextIdx];
        if (!this.audioCache[nextText]) {
          this.isPreparingNext = true;
        }
        return this.getAudioForText(nextText).then(() => {
          this.zone.run(() => {
            this.isPreparingNext = false;
            this.currentQuestionIndex = nextIdx;
          });
          const playing = this.playAudio(nextText);
          if (nextIdx + 1 < this.interviewQuestions.length) {
            this.prefetchAudio(this.interviewQuestions[nextIdx + 1]);
          }
          return playing;
        });
      }

      this.prefetchAudio(OUTRO_TEXT);
      this.isPreparingNext = true;
      return this.getAudioForText(OUTRO_TEXT)
        .then(() => {
          this.zone.run(() => this.isPreparingNext = false);
          return this.playAudio(OUTRO_TEXT);
        })
        .then(() => {
          setTimeout(() => this.zone.run(() => this.stopRecording()), 1000);
        });
    });
  }

  // ----------------------------------------------------------------- recording

  private startRecording(): boolean {
    if (!this.stream) {
      this.errorMsg = 'No camera stream available. Check permissions.';
      return false;
    }
    if (typeof MediaRecorder === 'undefined') {
      this.errorMsg = 'This browser does not support MediaRecorder.';
      return false;
    }

    this.recordedBlob = null;
    this.chunks = [];

    let mimeType = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    try {
      const recorder = new MediaRecorder(this.stream, { mimeType: mimeType });
      recorder.ondataavailable = (e: any) => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        this.zone.run(() => {
          this.recordedBlob = new Blob(this.chunks, { type: 'video/webm' });
          this.appState = 'review';
          this.attachRecordedBlob();
        });
      };
      recorder.start(1000);
      this.mediaRecorder = recorder;
      this.appState = 'recording';
      this.recordingTime = 0;
      this.timerId = setInterval(() => this.zone.run(() => this.recordingTime++), 1000);
      this.addLog('system', 'Recording started...');
      return true;
    } catch (e) {
      this.errorMsg = 'Recording failed: ' + (e && e.message ? e.message : e);
      return false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.addLog('system', 'Recording stopped. Preparing preview...');
    }
    this.stopTimer();
    this.stopSpeech();
  }

  private stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.recordedBlob = file;
      this.addLog('system', 'Video uploaded for analysis.');
      this.analyzeRecording(file);
    }
    event.target.value = ''; // allow re-selecting the same file
  }

  // ------------------------------------------------------------------ analysis

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  analyzeRecording(blobToAnalyze?: Blob) {
    const target = blobToAnalyze || this.recordedBlob;
    if (!target) {
      return;
    }
    if (!this.gemini.isConfigured) {
      this.errorMsg = 'Gemini API key is not configured. Add "GeminiApiKey" to assets/app-config.json.';
      return;
    }

    this.appState = 'analyzing';
    this.errorMsg = null;
    this.addLog('system', 'Uploading video for analysis...');

    const model = this.selectedModel.indexOf('gemini') === 0 ? this.selectedModel : 'gemini-2.5-flash';
    const mimeType = target.type || 'video/webm';

    this.blobToBase64(target)
      .then(base64 => this.gemini.analyseVideo(model, base64, mimeType, this.buildPrompt(), METRICS_SCHEMA))
      .then((parsed: any) => {
        this.zone.run(() => {
          this.metrics = Object.assign(this.cloneMetrics(INITIAL_METRICS), this.metrics, parsed);
          this.appState = 'complete';
          this.addLog('ai', 'Analysis complete.');
        });
      })
      .catch((e: any) => {
        this.zone.run(() => {
          console.error(e);
          this.errorMsg = 'Analysis failed: ' + this.describeError(e);
          this.appState = 'review';
        });
      });
  }

  private describeError(e: any): string {
    if (!e) { return 'Unknown error.'; }
    if (e.error && e.error.error && e.error.error.message) { return e.error.error.message; }
    if (e.message) { return e.message; }
    return String(e);
  }

  private buildPrompt(): string {
    const questions = (this.interviewQuestions.length ? this.interviewQuestions : INTERVIEW_QUESTIONS)
      .map((q, i) => (i + 1) + '. ' + q).join('\n');

    return `
        You are an Expert HR Interview Analyst. Analyze the attached video.

        **CONTEXT:**
        Questions asked:
        ${questions}

        Roles Database: ${ROLES_DATA}

        **EVALUATION CRITERIA:**

        1. **English Proficiency (The "Mechanics")**
           - Grammar & Syntax: Correct tenses, agreement.
           - Vocabulary Breadth: Diverse vs repetitive.
           - Check for "text-speak" or incorrect idioms (Red Flags).

        2. **Communication (The "Impact")**
           - Structure: Uses STAR (Situation, Task, Action, Result) or PREP.
           - Signal-to-Noise: High signal, low fluff.
           - Narrative Flow: Logical beginning, middle, end.
           - Red Flags: Tangents, "Word Salad".

        3. **Interpersonal EQ (Emotional Intelligence)**
           - **Self-Awareness:** Ownership of error vs blaming others. Reflection on feelings.
           - **Social Awareness & Empathy:** Stakeholder perspective. Nuanced conflict description.
           - **Influence:** "We" vs "I". Psychological safety support.

        4. **Comprehension**
           - **Multi-Part Prompts:** Did they answer ALL parts of the question?
           - **Inferring Intent:** Do they understand the *implied* concern?
           - **Constraints:** Adherence to "last 12 months" etc.
           - **Logical Cohesion:** Does the Result solve the initial Challenge?

        **TASK:**
        Analyze the candidate based on the above criteria.
        Generate a DISC profile (Score D, I, S, C strictly on a scale of 1.0 to 5.0, where 5.0 is High).
        Suggest the best role match.
        Provide a final hiring recommendation.

        **IMPORTANT: DUMMY OR SILENT VIDEOS**
        If the video contains no speech, is completely silent, or is clearly a dummy/test video with no relevant interview content:
        - Score Communication, Comprehension, English, and Interpersonal EQ as 1.
        - Set the reasons for these scores to "No relevant speech or interview content detected in the video."
        - Set the recommendation to "No Fit".

        Return strictly formatted JSON matching the schema.
      `;
  }

  // -------------------------------------------------------------------- misc

  resetSession() {
    this.appState = 'idle';
    this.metrics = this.cloneMetrics(INITIAL_METRICS);
    this.recordedBlob = null;
    this.recordingTime = 0;
    this.logs = [];
    this.interviewQuestions = [];
    this.currentQuestionIndex = -1;
    this.errorMsg = null;
    this.audioCache = {};
    this.ttsPromises = {};
    this.lastTtsRequest = Promise.resolve();
    this.stopSpeech();
    if (this.viewMode === 'candidate') {
      this.startCamera();
    }
  }

  confirmSchedule() {
    if (this.scheduleDate && this.scheduleTime) {
      this.isScheduled = true;
    }
  }

  resetSchedule() {
    this.isScheduled = false;
    this.scheduleDate = '';
    this.scheduleTime = '';
  }

  private addLog(source: string, message: string) {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      source: source,
      message: message
    };
    this.logs = this.logs.slice(-4).concat([entry]);
  }

  private cloneMetrics(source: CandidateMetrics): CandidateMetrics {
    return JSON.parse(JSON.stringify(source));
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' + secs : '' + secs);
  }

  scoreColor(score: number): string {
    return score >= 4.0 ? '#34d399' : score >= 2.5 ? '#fbbf24' : '#f43f5e';
  }

  /* Percentage width for the inline bars (score is out of 5). */
  scoreWidth(score: number): number {
    return Math.min(100, Math.max(0, score * 20));
  }

  get chartData(): ChartBar[] {
    return [
      { name: 'Communication', score: this.metrics.communication, fill: this.scoreColor(this.metrics.communication) },
      { name: 'Comprehension', score: this.metrics.comprehension, fill: this.scoreColor(this.metrics.comprehension) },
      { name: 'English', score: this.metrics.english, fill: this.scoreColor(this.metrics.english) },
      { name: 'EQ', score: this.metrics.interpersonalEQ, fill: this.scoreColor(this.metrics.interpersonalEQ) }
    ];
  }

  get verdict(): Verdict {
    switch (this.metrics.recommendation) {
      case 'Strong Fit': return { label: 'STRONGLY RECOMMENDED', cssClass: 'verdict-strong' };
      case 'Fit': return { label: 'RECOMMENDED TO HIRE', cssClass: 'verdict-fit' };
      case 'Potential Fit': return { label: 'CONDITIONAL / POTENTIAL', cssClass: 'verdict-potential' };
      case 'No Fit': return { label: 'NOT RECOMMENDED', cssClass: 'verdict-no' };
      default: return { label: 'PENDING ANALYSIS', cssClass: 'verdict-pending' };
    }
  }

  get isGeminiModel(): boolean {
    return this.selectedModel.indexOf('gemini') === 0;
  }

  get questionLabel(): string {
    if (this.currentQuestionIndex === -1) {
      return 'Introduction';
    }
    return 'Question ' + (this.currentQuestionIndex + 1) + ' of ' + this.interviewQuestions.length;
  }

  get currentQuestionText(): string {
    if (this.currentQuestionIndex === -1) {
      return 'Welcome to the Interview';
    }
    const q = this.interviewQuestions[this.currentQuestionIndex];
    return q ? '"' + q + '"' : '';
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex >= this.interviewQuestions.length - 1;
  }
}
