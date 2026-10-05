import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '@app/Service/app-config.service';

/**
 * Thin REST wrapper over the Gemini generateContent API.
 *
 * The official @google/genai SDK cannot be used in this project: it ships ESM-only
 * bundles and type definitions that TypeScript 2.7 (pinned by Angular 6) cannot parse.
 * Calling the REST endpoints directly keeps us on the supported toolchain.
 */
@Injectable()
export class GeminiService {

  private readonly endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/';

  constructor(private http: HttpClient, private _config: AppConfigService) { }

  get apiKey(): string {
    const cfg: any = this._config.environment || {};
    return cfg.GeminiApiKey || '';
  }

  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  /** POST {model}:generateContent and return the raw response body. */
  generateContent(model: string, parts: any[], generationConfig: any): Promise<any> {
    const url = this.endpoint + model + ':generateContent?key=' + encodeURIComponent(this.apiKey);
    const body: any = { contents: [{ parts: parts }] };
    if (generationConfig) {
      body.generationConfig = generationConfig;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, body, { headers: headers }).toPromise();
  }

  /**
   * Analyse a recorded interview and return the parsed metrics object.
   * `schema` is passed through as generationConfig.responseSchema so the model
   * is forced to answer with strict JSON.
   */
  analyseVideo(model: string, base64Video: string, mimeType: string, prompt: string, schema: any): Promise<any> {
    const parts = [
      { inlineData: { mimeType: mimeType, data: base64Video } },
      { text: prompt }
    ];
    const generationConfig = {
      responseMimeType: 'application/json',
      responseSchema: schema
    };
    return this.generateContent(model, parts, generationConfig).then((res: any) => {
      const text = this.extractText(res);
      if (!text) {
        throw new Error('The model returned an empty response.');
      }
      return JSON.parse(text);
    });
  }

  /** Request speech for `text`; resolves with base64 PCM audio, or null when unavailable. */
  textToSpeech(text: string): Promise<string> {
    const generationConfig = {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }
        }
      }
    };
    const parts = [{ text: 'Say nicely and professionally: ' + text }];
    return this.generateContent('gemini-2.5-flash-preview-tts', parts, generationConfig)
      .then((res: any) => this.extractInlineData(res));
  }

  private extractText(res: any): string {
    try {
      const parts = res.candidates[0].content.parts;
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].text) {
          return parts[i].text;
        }
      }
    } catch (e) { /* fall through */ }
    return '';
  }

  private extractInlineData(res: any): string {
    try {
      const parts = res.candidates[0].content.parts;
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].inlineData && parts[i].inlineData.data) {
          return parts[i].inlineData.data;
        }
      }
    } catch (e) { /* fall through */ }
    return null;
  }
}
