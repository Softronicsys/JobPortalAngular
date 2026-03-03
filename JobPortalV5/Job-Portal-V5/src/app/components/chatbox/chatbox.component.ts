import { Component, OnInit, NgZone, ViewChild, Input} from '@angular/core';
import { SignalRService } from '@app/Service/signalr.service';
import { Constants } from '../../Helper/Constant';
import { isNullOrUndefined } from 'util';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service'
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { DataService } from '@app/Shared/Services/data.services';
import { AppConfigService } from '@app/Service/app-config.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from '@app/Service/chat.service';
import { combineLatest } from 'rxjs';




@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  @Input() isFF: boolean;


  chatboxVisible: boolean = false;

  messages: {
  user: string, message: string, isRead: boolean, SenderType: number | string;  }[] = [];
  isRead: boolean = false;
  messageText: string = '';
  userName: string = "";
  connectionStatus: 'connected' | 'disconnected' = 'disconnected';
  unreadMessageCount: number = 0;  // To track unread messages
  jobCode: any;
  ChatJobTitle: any;

  constructor(private signalRService: SignalRService, private ngZone: NgZone, private _config: AppConfigService,
    public ClrThemeChng: ThemeColorService, public CompanyIdService: GetCompanyParameter, private http: HttpClient,
    private spinner: NgxSpinnerService, private dataService: DataService, public sanitizer: DomSanitizer, private chatService: ChatService) { }

  ngOnInit(): void {

    this.getCompanyParameter();

    this.signalRService.initializeConnection(
      () => this.connectionStatus = 'connected',
      () => this.connectionStatus = 'disconnected',
    );

    this.signalRService.onMessageReceived((user, message, applicantId, EmpId, CompanyId, senderType , JobCode) => {
      debugger;
      if (user !== this.userName) {
        this.ngZone.run(() => {

          this.EmpIdforMsg = EmpId;  //store the Empid for next messages

          this.messages.push({ user, message, isRead: false, SenderType: senderType });

          if (!this.chatboxVisible) {

            this.unreadMessageCount++;  
            //this.getChatMessages(this.jobCode);

          } else {
            //this.getChatMessages(this.jobCode);

            this.markMessagesAsRead();
          }
          setTimeout(() => this.scrollToBottom(), 0);

        });
      }
    });

    combineLatest([this.chatService.chatVisible$, this.chatService.currentJobCode$, this.chatService.jobTitle$]).subscribe(([visible, jobCode, JobTitle]) => {
      if (visible && !this.chatboxVisible) {
        this.chatboxVisible = true;

        if (jobCode) {
          this.jobCode = jobCode;
          this.ChatJobTitle = JobTitle;
          this.messages = [];                // Clear previous messages
         
          this.unreadMessageCount = 0;
          this.markMessagesAsRead();
          this.allMessagesLoaded = false;
          this.skipCount = 0;
          this.pageSize = 30;
          this.getChatMessages(this.jobCode);
          setTimeout(() => this.scrollToBottom(), 0);
        }
        
      }

      // Optional: if you want to hide it when visible = false
      if (!visible && this.chatboxVisible) {
        this.chatboxVisible = false;

      }
    });




  }

  EmpIdforMsg: number = 0;



  closeChatbox(): void {
    this.chatService.hideChat(); 
  }
  

  scrollToBottom() {
    const container = document.getElementById('scrollContainer');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }


  markMessagesAsRead() {

    const applicantId = localStorage.getItem("AppId");
    const empId = 0;                                       // By Default    
    const companyId = this.CompanyIdService.CompanyId;
    const readerType = 1;                                  // 1 = applicant is reading
    const JobCode = this.jobCode;

    this.signalRService.markMessagesAsRead(applicantId, empId, companyId, readerType, JobCode);
  }

  sendMessage(): void {
    debugger;
    if (this.messageText.trim()) {

      const applicantId = localStorage.getItem("AppId");
      const companyId = this.CompanyIdService.CompanyId;
      const senderType = 1;                                 // 1 = Applicant, 2 = HR
      //const EmpId = 0;                                      // By Default
      const JobCode = this.jobCode;

      const EmpId = this.EmpIdforMsg || 0;

      this.userName = localStorage.getItem('UserName');


      // Push the message instantly to UI
      this.messages.push({ user: 'You', message: this.messageText, isRead: false, SenderType: 1 });


      console.log('Sending message with EmpId:', EmpId);

      this.signalRService.sendMessage(this.userName, this.messageText, applicantId, EmpId, companyId, senderType, JobCode);
      this.messageText = '';


      setTimeout(() => this.scrollToBottom(), 0);

      

    }
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      this.sendMessage();    
    }
  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  

  getCompanyParameter() {
    debugger;

    this.openSpinner();
    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
    this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
      this.CompanyIdService.CompanyId = response.CompanyId;
      //console.log(this.CompanyIdService.CompanyId);
      this.CompanyIdService.CompanyName = response.CompanyName;
      this.CompanyIdService.RedirectPath = response.RedirectPath;
      this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
      this.CompanyIdService.PicSize = response.PicSize;
      this.CompanyIdService.BaseCurrencyId = response.BaseCurrencyId;
      this.CompanyIdService.ShowAppStatusAtjobportal = response.ShowAppStatusAtjobportal == 1 ? true : false;
      this.getAppliedJobs();

      // Check if GetFF_Value is true
      if (this.isFF) {

        this.getJobPortalConfigurationFF();

      } else {
        this.getJobPortalConfiguration();
      }

    });
  }

  HideOrganization: boolean = false;


  appliedJobs: any;
  HasJobStatusData: boolean = false;
  HasApplicantStatusData: boolean = false;
  isOpenVacancy: boolean = false;
  ModalHeading: string = "";
  HideJobCode: boolean = false;
  HasApplicantOfferletterData: boolean = false;
  HasApplicantOfferRescind: boolean = false;
  IsOfferRescinded: boolean = false;
  IsOfferLetter: boolean = false;
  HideJobAttributeName: boolean = false;
  lblJobAttributeName: string = "JobAttributeName";
  HideTotalPositions: boolean = false;
  public remarks: string = '';


  EmpId: string = "";

  getAppliedJobs() {
    debugger;

    let RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),//"27866",
      Culture: Constants.Culture,
      CompanyId: "-1",
      CompanyGroupID: this._config.environment.CompanyGroupID,

    };

    //  this.Color()
    this.openSpinner()
    let getAppliedJobs = this._config.environment.baseUrl + Constants.GetAppliedJobs;
    this.http.post(getAppliedJobs, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {

        this.appliedJobs = response.Data;

        //console.log(response.Data);
        //console.log(this.appliedJobs);

        let len = this.appliedJobs.length;


        if (!isNullOrUndefined(this.appliedJobs) && len > 0) {
          this.isOpenVacancy = true;

        
         
  
          //this.getChatMessages(this.jobCode);

          for (let i = 0; i < len; i++) {
            if (this.appliedJobs[i].JobStatus != "" && !this.HasJobStatusData)
              this.HasJobStatusData = true;

            if (this.appliedJobs[i].ApplicantStatus != "" && !this.HasApplicantStatusData)
              this.HasApplicantStatusData = true;

            if (this.appliedJobs[i].Offerletterissued == true && this.appliedJobs[i].IsOfferRescinded == false) {
              this.HasApplicantOfferletterData = true;
              this.IsOfferLetter = true;
              this.remarks = this.appliedJobs[i].Remarks; // pre-fill remarks
              this.ModalHeading = "Offer letter";
            }
            else if (this.appliedJobs[i].IsOfferRescinded == true) {
              this.HasApplicantOfferRescind = true;
              this.IsOfferRescinded = true;
              this.ModalHeading = "Rescind Letter";
            }

            if (this.appliedJobs[i].VisOrganization != "" && !this.HideOrganization)
              this.HideOrganization = true;
            //console.log(this.HideOrganization);

            if (this.appliedJobs[i].VisJobCode != "" && !this.HideJobCode)
              this.HideJobCode = true;

            if (this.appliedJobs[i].VisTotalPositions != "" && !this.HideTotalPositions)
              this.HideTotalPositions = true;

            //if (this.appliedJobs[i].JobAttributeName != "" && this.appliedJobs[i].JobAttributeName.trim().toUpperCase() !== "N/A" && !this.HideJobAttributeName)
            //  this.HideJobAttributeName = true;

            if (this.appliedJobs[i].AdditionalFilter != "" && !this.HideJobAttributeName)
              this.HideJobAttributeName = true;

            for (let i = 0; i < this.appliedJobs.length; i++) {
              const attr = this.appliedJobs[i].showJobattribute_jobportal;

              if (attr == 70) {
                this.lblJobAttributeName = "Division";
                break;
              }
              if (attr == 84) {
                this.lblJobAttributeName = "Department";
                break;
              }
              if (attr == 24) {
                this.lblJobAttributeName = "Sub-Department";
                break;
              }
              if (attr == 63) {
                this.lblJobAttributeName = "Location";
                break;
              }
              if (attr == 79) {
                this.lblJobAttributeName = "Region";
                break;
              }
            }

          }
        }

      }, (error: any) => {
        console.log(error);
      });
  }


  getJobPortalConfiguration() {
    debugger;


    let RequestObject = {

      CompanyId: this.CompanyIdService.CompanyId,
    };
    //console.log(this.CompanyIdService.CompanyId);
    this.openSpinner();
    let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
    this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {

        if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
          this.ClrThemeChng.themeChanged.emit(response.ThemeColor);
        }

        this.Color();
      })
  }

  getJobPortalConfigurationFF() {
    debugger;
    let RequestObject = {

      CompanyId: this.CompanyIdService.CompanyId,
    };
    let GetJobPortalConfiguration_FF = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration_FF;
    this.http.post(GetJobPortalConfiguration_FF, RequestObject, { headers: this.dataService.headers })
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration_FF")
      .subscribe((response: any) => {

        if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
          this.ClrThemeChng.themeChanged.emit(response.ThemeColor);
        }

        this.Color();

      })
  }

  openSpinner() {


    /** spinner starts on init */
    this.spinner.show();
  }

  chatLoading: boolean = false;

  pageSize: number = 30;
  skipCount: number = 0;
  allMessagesLoaded: boolean = false;
  isLoadingMore: boolean = false;
  isScrollTriggered: boolean = false;



  getChatMessages(jobCode?: string, appendToTop = false) {
    debugger;
    if (this.isLoadingMore || this.allMessagesLoaded) return;

    this.isLoadingMore = true;
    this.isScrollTriggered = appendToTop;

    if (!appendToTop && this.skipCount === 0) {
      this.chatLoading = true;
    }

    const RequestObject = {
      ApplicantId: localStorage.getItem("AppId"),
      CompanyId: this.CompanyIdService.CompanyId,
      JobCode: jobCode,
      Skip: this.skipCount,
      Take: this.pageSize
    };

    const url = this._config.environment.baseUrl + Constants.GetchatMessages;

    this.http.post(url, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any[]) => {
        const newMessages = response.map(msg => ({
          user: msg.SenderType == "2" ? "HR" : "You",
          message: msg.MessageText,
          sentDateTime: msg.MessageDate,
          name: msg.ApplicantName,
          photo: msg.ApplicantPhotoUrl,
          isRead: msg.IsRead,
          SenderType: msg.SenderType,
          EmpIdforMsg: msg.EmpId  // <--- add this line
        }));

        if (newMessages.length > 0) {
          const empMessages = newMessages.filter(m => m.SenderType == 2);

          if (empMessages.length > 0) {
            // Take the last employee message
            const lastEmpMsg = empMessages[empMessages.length - 1];

            if (lastEmpMsg && lastEmpMsg.EmpIdforMsg) {
              this.EmpIdforMsg = lastEmpMsg.EmpIdforMsg;
              console.log('Last EmpIdforMsg:', this.EmpIdforMsg);
            }
          }
        }

        if (newMessages.length < this.pageSize) {
          this.allMessagesLoaded = true;
        }

        if (appendToTop) {
          this.messages = [...newMessages, ...this.messages];
        } else {
          this.messages = newMessages;
          setTimeout(() => this.scrollToBottom(), 0);
        }

        this.skipCount += this.pageSize;
        this.isLoadingMore = false;
        this.isScrollTriggered = false;

        this.chatLoading = false;


      }, error => {
        console.error("Failed to fetch messages:", error);
        this.isLoadingMore = false;
        this.isScrollTriggered = false;

        this.chatLoading = false;

      });
  }


  @ViewChild('scrollContainer') scrollContainer;

  onScrollUp(event: any): void {
    const container = event.target;
    if (container.scrollTop <= 10 && !this.isLoadingMore && !this.allMessagesLoaded) {
      const previousHeight = container.scrollHeight;

      this.getChatMessages(this.jobCode, true);

      setTimeout(() => {
        // Maintain scroll position
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - previousHeight;
      }, 100);
    }
  }


  HideSpinner() {


    /** spinner starts on init */
    this.spinner.hide();
  }

  // for backgrouud color // 

  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  forChanges: any;
  breakcode: any;
  code: any;
  BorderColor: string = "";
  DefaultBorderColor: string = "";
  tickImage: string = "";
  iscolor: boolean = false;
  IsDefaultTheme: boolean = true;

  Color() {

    this.forChanges = this.ClrThemeChng.ChangeTheme;
    //console.log('Theme color from ChangeTheme:', this.forChanges); // Log raw color

    if (isNullOrUndefined(this.forChanges)) {
      this.DefaultFontColor = "#" + Constants.default;
      this.DefaultBorderColor = "1px solid #" + Constants.default;
      this.tickImage = "assets/images/" + Constants.default + "/tick.png";
      this.IsDefaultTheme = true;

      //console.log('Using default color:', this.DefaultFontColor);

    }
    else if (!isNullOrUndefined(this.forChanges)) {

      this.breakcode = this.forChanges.split('#');
      this.code = this.breakcode[1];
      this.ThemeFontColor = this.forChanges;
      this.BorderColor = "1px solid" + this.forChanges;
      this.tickImage = "assets/images/" + this.code + "/tick.png";
      this.iscolor = true;
      this.IsDefaultTheme = false;

      //console.log('Using theme color:', this.ThemeFontColor);

    }
  }

}
