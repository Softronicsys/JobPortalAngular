import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/Service/app-config.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(private _config: AppConfigService) {

  }

  private connection: any;
  private proxy: any;

  initializeConnection(onConnected: () => void, onDisconnected: () => void ): void {   
    const applicantId = localStorage.getItem("AppId");   
    const senderType = "1";                              // 1 = Applicant, 2 = HR

    this.connection = $.hubConnection(this._config.environment.baseUrl + 'signalr', {
      qs: {
        applicantId: applicantId || '',
        SenderType: senderType
      }
    });

    this.proxy = this.connection.createHubProxy('chatHub');

    this.proxy.on('broadcastMessage', (user: string, message: string, applicantId: number, EmpId: number, CompanyId: number, senderType: number, JobCode: string) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(user, message, applicantId, EmpId, CompanyId, senderType, JobCode);
      }
    });

    this.connection.start()
      .done(() => {
        console.log('SignalR connected');
        if (onConnected) onConnected();
      })
      .fail((err: any) => {
        console.error('SignalR connection error:', err);
        if (onDisconnected) onDisconnected();
      });

    this.connection.disconnected(() => {
      console.warn('SignalR disconnected');
      if (onDisconnected) onDisconnected();
    });
  }


  private onMessageCallback: (user: string, message: string, applicantId: number, EmpId: number, CompanyId: number, senderType: number, JobCode: string) => void;

  onMessageReceived(callback: (user: string, message: string, applicantId: number, EmpId: number, CompanyId: number, senderType: number, JobCode: string) => void) {
    this.onMessageCallback = callback;
  }

  sendMessage(user: string, message: string, applicantId: string, EmpId: number, companyId: string, senderType: number, JobCode: string) {
    this.proxy.invoke('sendMessage', user, message, applicantId, EmpId, companyId, senderType, JobCode)
      .fail((err: any) => console.error('Send message failed:', err));
  }

  markMessagesAsRead(applicantId: string, empId: number, companyId: string, readerType: number, JobCode: string) {
    this.proxy.invoke('markMessagesAsRead', applicantId, empId, companyId, readerType, JobCode)
      .catch((err: any) => console.error("Failed to mark messages as read:", err));
  }


}
