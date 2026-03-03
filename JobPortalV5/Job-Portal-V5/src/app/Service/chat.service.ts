import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

    // Add BehaviorSubject for job code

  private chatVisibleSource = new BehaviorSubject<boolean>(false);
  chatVisible$ = this.chatVisibleSource.asObservable();

  private currentJobCodeSource = new BehaviorSubject<string | null>(null);
  currentJobCode$ = this.currentJobCodeSource.asObservable();

  private jobTitleSource = new BehaviorSubject<string | null>(null);
  jobTitle$ = this.jobTitleSource.asObservable();

  showChat(jobCode?: string, jobTitle?: string) {
    debugger;
    if (jobCode) {
      this.currentJobCodeSource.next(jobCode);
      this.jobTitleSource.next(jobTitle);
    }
    this.chatVisibleSource.next(true);
  }

  hideChat() {
    this.chatVisibleSource.next(false);
    this.currentJobCodeSource.next(null);
    this.jobTitleSource.next(null);
  }
}
