import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { AppConfigService } from '@app/Service/app-config.service';
import { Constants } from '../Helper/Constant';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(private _config: AppConfigService) {

  }

  private connection: HubConnection;
  private started: boolean = false;

  initializeConnection(onConnected: () => void, onDisconnected: () => void ): void {
    try {
      const applicantId = localStorage.getItem("AppId") || "";
      const senderType = "1";
      const base = this.hubBaseUrl();
      const hubUrl = base + Constants.SignalRHub
        + "?applicantId=" + encodeURIComponent(applicantId)
        + "&SenderType=" + encodeURIComponent(senderType);

      if (this.connection) {
        this.connection.stop();
      }

      this.connection = new HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      this.connection.on('broadcastMessage', (user: string, message: string, applicantId: number, EmpId: number, CompanyId: number, senderType: number, JobCode: string) => {
        if (this.onMessageCallback) {
          this.onMessageCallback(user, message, applicantId, EmpId, CompanyId, senderType, JobCode);
        }
      });

      this.connection.onclose(() => {
        this.started = false;
        console.warn('SignalR disconnected');
        try {
          if (onDisconnected) onDisconnected();
        } catch (e) { }
      });

      this.connection.onreconnecting(() => {
        this.started = false;
        try {
          if (onDisconnected) onDisconnected();
        } catch (e) { }
      });

      this.connection.onreconnected(() => {
        this.started = true;
        try {
          if (onConnected) onConnected();
        } catch (e) { }
      });

      this.connection.start()
        .then(() => {
          this.started = true;
          console.log('SignalR connected');
          if (onConnected) onConnected();
        })
        .catch((err: any) => {
          this.started = false;
          console.warn('SignalR is not available. Chat will stay offline.', err);
          try {
            if (onDisconnected) onDisconnected();
          } catch (e) { }
        });
    } catch (err) {
      this.started = false;
      console.warn('SignalR is not available.', err);
      try {
        if (onDisconnected) onDisconnected();
      } catch (e) { }
    }
  }

  private hubBaseUrl(): string {
    var base = this._config.environment.baseUrl || "";
    if (base.length > 0 && base.charAt(base.length - 1) !== "/") {
      base = base + "/";
    }
    return base;
  }

  private canInvoke(): boolean {
    return !!this.connection && this.started && this.connection.state === HubConnectionState.Connected;
  }

  private onMessageCallback: (user: string, message: string, applicantId: number, EmpId: number, CompanyId: number, senderType: number, JobCode: string) => void;

  onMessageReceived(callback: (user: string, message: string, applicantId: number, EmpId: number, CompanyId: number, senderType: number, JobCode: string) => void) {
    this.onMessageCallback = callback;
  }

  sendMessage(user: string, message: string, applicantId: string, EmpId: number, companyId: string, senderType: number, JobCode: string) {
    if (!this.canInvoke()) {
      console.warn('SignalR is not connected. Message was not sent.');
      return;
    }
    this.connection.invoke('SendMessage', user, message, applicantId, EmpId, companyId, senderType, JobCode)
      .catch((err: any) => console.error('Send message failed:', err));
  }

  markMessagesAsRead(applicantId: string, empId: number, companyId: string, readerType: number, JobCode: string) {
    if (!this.canInvoke()) {
      return;
    }
    this.connection.invoke('MarkMessagesAsRead', applicantId, empId, companyId, readerType, JobCode)
      .catch((err: any) => console.error("Failed to mark messages as read:", err));
  }


}
