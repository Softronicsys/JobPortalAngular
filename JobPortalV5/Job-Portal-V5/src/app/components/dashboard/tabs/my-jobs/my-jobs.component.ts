import { Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Constants } from '../../../../Helper/Constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GetCompanyParameter } from '../../../../Service/CompanyParameter.service'
import { ThemeColorService } from '../../../../Service/ThemeColor.service';
import { UpdateProfileService } from '../../../../Service/UpdateProfile.service';
import { isNullOrUndefined } from 'util';
import { AppConfigService } from '@app/Service/app-config.service';
declare var $: any;
import { Labels } from '@app/Service/DatabaseLbl.service';
import { AssessmentService } from '@app/Service/UpdateProfile.service';
import { DataService } from '@app/Shared/Services/data.services';
import { ChatService } from '@app/Service/chat.service';


@Component({
    selector: 'app-my-jobs',
    templateUrl: './my-jobs.component.html',
    styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {

    @Input() AppliedJobCode: string;
    departmentJobs: any;
    openVacancies: any;
    appliedJobs: any;

    isSpinnerPopup: boolean = false;
    isSpinnerPage: boolean = true;

    @Input() isFF: boolean;


    filteredJobs: any[];
    MPRDETAIL: any[];
    jobHistory: any[];
    arrHeadings: any[] = [];
    showMeetings: boolean = false;
    showReports: boolean = false;
    showAcademicQualifications: boolean = false;
    showTrainings: boolean = false;
    showCertification: boolean = false;
    showCompetencies: boolean = false;
    showAuthorities: boolean = false;
    isGrid:boolean = true;
    HRLooping: any[3] = [1,2,3];
    arrJobsDetail:any[] = [];
    arrJobsAppliedFor:any[] = [];
    arrSuitableDepart: any[] = [];
    textToFilter: string = "";
    searchFilter: string = "0";
    appStatusJobTitle: string = "";
    isJobAvailable: boolean = false;

    offerLetter: boolean = true;


    @Output() getCounter: EventEmitter<any>;

    constructor(private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private spinner: NgxSpinnerService,
        private toastr: ToastrService, public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService,
        public assessService: AssessmentService, private dataService: DataService, public updateProfService: UpdateProfileService, private chatService: ChatService) {

        this.getCounter = new EventEmitter<any>();
    }

    GiveLblToDshboard() {
        let RequestObject = {
            OPenVacanciesCount: this.OPenVacanciesCount,
            isbadge: this.isbadge

        }

        this.getCounter.emit(RequestObject);

    }

    ngOnInit() {
        this.getCompanyParameter();
        this.getAssociatedCompanies();
        this.SaveGridViewStyle(-1);
        //console.log(this.isFF);
        
    }

    SaveGridViewStyle(IsNormalView) {

      if (IsNormalView == 1)
        localStorage.setItem("IsGridView", "true");//this.ClrThemeChng.IsGridViewShow.emit(true);

      if (IsNormalView == 0)
        localStorage.setItem("IsGridView", "false");//this.ClrThemeChng.IsGridViewShow.emit(false);

      if (!isNullOrUndefined(localStorage.getItem("IsGridView"))) {
        this.isGrid = localStorage.getItem("IsGridView") == "true" ? true : false;
        this.updateProfService.IsGridStyle = this.isGrid;
      }
    }

    clickRow: boolean = true;

    //For Selected Row Color

    ForSelectedRowColor() {
      debugger;
      if (this.clickRow == false) {  
        $('#MPRCODE1').modal('hide');
        this.clickRow = true;
      }
      else {
        $('#MPRCODE1').modal('show');
        $("tbody tr").click(function () {
          //    console.log('clicked');
          $(this).addClass('selected').siblings().removeClass("selected");
        });
      }
           
        }


    ForSelectedRowColor1() {
        
        if (this.clickRow == false) {
            $('#MPRCODE').modal('hide');
            this.clickRow = true;
        }
        else {
            $('#MPRCODE').modal('show');
            $("tbody tr").click(function () {
            //    console.log('clicked');
                $(this).addClass('selected').siblings().removeClass("selected");
            });
        }
    }

    ForSelectedRowColor2() {
      debugger;
        $("tbody tr").click(function () {
        //    console.log('clicked');
            $(this).addClass('selected').siblings().removeClass("selected");
        });
    }


    // For Labels //

    ApplicantStatus: string = "Applicant Status";
    OfferLetter: string = "Offer Letter";
    OfferRescind: string = "Rescind Letter";
    lblChat : string = "Chat with Us";

    lblOfferLetterStatus: string = "Offer Letter Status";
    DepartmentMyJobs: string = "Department";
    lblTotalPositions: string = "Total Positions";
    lblApplicationDeadline: string = "Application Deadline";
    Description: string = "Description";
    LblAlert: string = "Alert";
    lblJobsIhaveAppliedFor: string = "Vacancies I have applied for";
    lblWelcomeHeading1: string = "Vacancies you can apply for";
    ApplyForAnySuiDept: string = "Set Email Alerts for Future Vacancies";
    lblJobCode: string = "Job Code";
    JobTitle: string = "Job Title";
    lblJobStatus: string = "Job Status";
    lblJobDetail: string = "Job Details";
    Nodata: string = "No data";
    Close: string = "Close";
    Apply: string = "Apply";
    btnApplyListView: string = "View / Apply";
    lblAll: string = "All";
    lblLocation: string = "Location";
    lblCompany: string = "Organization";

    getMyJobsLabels() {
        
        if (this.Labels.dashLabels == true) {
          if (this.Labels.ApplicantStatus != "" && !isNullOrUndefined(this.Labels.ApplicantStatus))
            this.ApplicantStatus = this.Labels.ApplicantStatus;

          if (this.Labels.OfferLetter != "" && !isNullOrUndefined(this.Labels.OfferLetter))
            this.OfferLetter = this.Labels.OfferLetter;

          if (this.Labels.OfferRescind != "" && !isNullOrUndefined(this.Labels.OfferRescind))
            this.OfferRescind = this.Labels.OfferRescind;

          if (this.Labels.lblOfferLetterStatus != "" && !isNullOrUndefined(this.Labels.lblOfferLetterStatus))
            this.lblOfferLetterStatus = this.Labels.lblOfferLetterStatus;

          if (this.Labels.DepartmentMyJobs != "" && !isNullOrUndefined(this.Labels.DepartmentMyJobs))
            this.DepartmentMyJobs = this.Labels.DepartmentMyJobs;

          if (this.Labels.lblTotalPositions != "" && !isNullOrUndefined(this.Labels.lblTotalPositions))
            this.lblTotalPositions = this.Labels.lblTotalPositions;

          if (this.Labels.lblApplicationDeadline != "" && !isNullOrUndefined(this.Labels.lblApplicationDeadline))
            this.lblApplicationDeadline = this.Labels.lblApplicationDeadline;

          if (this.Labels.Description != "" && !isNullOrUndefined(this.Labels.Description))
            this.Description = this.Labels.Description;

          if (this.Labels.lblJobsIhaveAppliedFor != "" && !isNullOrUndefined(this.Labels.lblJobsIhaveAppliedFor))
            this.lblJobsIhaveAppliedFor = this.Labels.lblJobsIhaveAppliedFor;

          if (this.Labels.lblWelcomeHeading1 != "" && !isNullOrUndefined(this.Labels.lblWelcomeHeading1))
            this.lblWelcomeHeading1 = this.Labels.lblWelcomeHeading1;

          if (this.Labels.ApplyForAnySuiDept != "" && !isNullOrUndefined(this.Labels.ApplyForAnySuiDept))
            this.ApplyForAnySuiDept = this.Labels.ApplyForAnySuiDept;

          if (this.Labels.lblJobCode != "" && !isNullOrUndefined(this.Labels.lblJobCode))
            this.lblJobCode = this.Labels.lblJobCode;

          if (this.Labels.JobTitle != "" && !isNullOrUndefined(this.Labels.JobTitle))
            this.JobTitle = this.Labels.JobTitle;

          if (this.Labels.lblJobStatus != "" && !isNullOrUndefined(this.Labels.lblJobStatus))
            this.lblJobStatus = this.Labels.lblJobStatus;

          if (this.Labels.lblJobDetail != "" && !isNullOrUndefined(this.Labels.lblJobDetail))
            this.lblJobDetail = this.Labels.lblJobDetail;

          if (this.Labels.Nodata != "" && !isNullOrUndefined(this.Labels.Nodata))
            this.Nodata = this.Labels.Nodata;

          if (this.Labels.Close != "" && !isNullOrUndefined(this.Labels.Close))
            this.Close = this.Labels.Close;

          if (this.Labels.Apply != "" && !isNullOrUndefined(this.Labels.Apply))
            this.Apply = this.Labels.Apply;

          if (this.Labels.lblAll != "" && !isNullOrUndefined(this.Labels.lblAll))
            this.lblAll = this.Labels.lblAll;

          if (this.Labels.lblLocation != "" && !isNullOrUndefined(this.Labels.lblLocation))
            this.lblLocation = this.Labels.lblLocation;

          if (this.Labels.Company != "" && !isNullOrUndefined(this.Labels.Company))
            this.lblCompany = this.Labels.Company;
      }

    }

    // MyJobs Counter //

    isbadge: boolean = false;
    MyJobCounter: any;
    OPenVacanciesCount: any;
    myJobCounter() {

        let RequestObject = {

            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: this.CompanyIdService.CompanyId,
            CompanyGroupID: localStorage.getItem('GroupId'),
        }

        let getMyJobsGridsCount = this._config.environment.baseUrl + Constants.GetMyJobsGridsCount;
        this.http.post(getMyJobsGridsCount, RequestObject, { headers: this.dataService.headers })
            .subscribe((response: any) => {
                this.MyJobCounter = response;
                this.OPenVacanciesCount = response.OPenVacanciesCount;
                if (this.OPenVacanciesCount > 0) {
                    this.isbadge = true;
                }
                this.GiveLblToDshboard();
            }, (error: any) => {

                console.log(error);
            });
    }



    Btn_offerLetter() {
        this.offerLetter = true;
    }

    // For GetAssociatedCompanies dropdown //

    AssociatedCompanies: string = "";
    AssociatedCompaniesDropdown: any;
    AssociatedCompaniesDropdown1: any;
    ShowCompany: boolean = false;
    ShowCompanyInfo: boolean = false;


    getAssociatedCompanies() {
        

        let RequestObject = {

            CompanyGroupID: this._config.environment.CompanyGroupID,

        }
        //this.openSpinner()
        let getAssociatedCompanies = this._config.environment.baseUrl + Constants.GetAssociatedCompanies + "?Culture=" + Constants.Culture;
        this.http.post(getAssociatedCompanies, RequestObject, { headers: this.dataService.headers })
            //  this.http.get(" https://jobportalapi.azurewebsites.net/GetAssociatedCompanies?Culture=en-GB")
            .subscribe((response: any) => {
                
                this.AssociatedCompaniesDropdown = response.DataList;
                this.AssociatedCompaniesDropdown1 = response.CompanyCount;
                //this.getOpenVacancies();
                //this.getDepartmentJobs();
                //this.HideSpinner();

                //if (!isNullOrUndefined(this.AssociatedCompaniesDropdown1) && this.AssociatedCompaniesDropdown1 > 1)
                //    this.ShowCompany = true;

                if (!isNullOrUndefined(this.AssociatedCompaniesDropdown1) && this.AssociatedCompaniesDropdown1 > 1)
                {
                  this.ShowCompanyInfo = true;
                }

                this.ShowCompanyInfo = true; //always show organization

                

            }, (error: any) => {
                console.log(error);
            });
    }

    // for theme color //
    ChangeTheme: any;

    getJobPortalConfiguration() {

        
        let RequestObject = {

            CompanyId: this.CompanyIdService.CompanyId,
        };
        this.openSpinner();
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
            .subscribe((response: any) => {

              if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
                this.ClrThemeChng.ChangeTheme = response.ThemeColor;
                this.ClrThemeChng.themeChanged.emit(response.ThemeColor);
              } 
           
                this.Color(); 
            })
    }

    //getJobPortalConfigurationFF() {
    //  debugger;
    //  let RequestObject = {

    //    CompanyId: this.CompanyIdService.CompanyId,
    //  };
    //  let GetJobPortalConfiguration_FF = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration_FF;
    //  this.http.post(GetJobPortalConfiguration_FF, RequestObject, { headers: this.dataService.headers })
    //    // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration_FF")
    //    .subscribe((response: any) => {

    //      if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
    //        this.ClrThemeChng.ChangeTheme = response.ThemeColor;
    //        this.ClrThemeChng.themeChanged.emit(response.ThemeColor);
    //      } 

    //      this.Color();

    //    })
    //}

    ShowAppStatusAtjobportal: boolean;
    GetFF_Value: boolean;

    // for CompanyID //

    getCompanyParameter() {
      debugger;
        

        this.openSpinner();
        let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
        this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
            this.CompanyIdService.CompanyId = response.CompanyId;
            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
            this.CompanyIdService.PicSize = response.PicSize;
            this.CompanyIdService.BaseCurrencyId = response.BaseCurrencyId; 
            this.CompanyIdService.ShowAppStatusAtjobportal = response.ShowAppStatusAtjobportal == 1 ? true : false;
            this.ShowAppStatusAtjobportal = this.CompanyIdService.ShowAppStatusAtjobportal;
            //console.log('log' + this.ShowAppStatusAtjobportal)
            this.getMyJobsLabels();
            this.getDepartmentJobs();
            this.getOpenVacancies();
            this.getAppliedJobs();

            //this.GetFF_Value = response.isFFEnable;

            //console.log(this.GetFF_Value)



            // Check if GetFF_Value is true
            //if (this.isFF) {

            //  //this.getJobPortalConfigurationFF();

            //} else {
              this.getJobPortalConfiguration();
            //}
            //this.getJobPortalConfiguration();
            this.myJobCounter();
            //this.HideSpinner();

            //this.CompanyId = response.CompanyId;
            //Constants.CompanyId = this.CompanyId;
            //this.CompanyName = response.CompanyName;
            //Constants.CompanyName = this.CompanyName;
            //this.RedirectPath = response.RedirectPath;
            //Constants.RedirectPath = this.RedirectPath;
            //this.CompanyLogoBase64 = response.CompanyLogoBase64;
            //Constants.CompanyLogoBase64 = this.CompanyLogoBase64;

        });
    }





    openSpinner() {
        

        /** spinner starts on init */
        this.spinner.show();
    }


    HideSpinner() {
        

        /** spinner starts on init */
        this.spinner.hide();
    }



    getDepartmentJobs() {
        
        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            CompanyId: "-1",
            //CompanyId: this.CompanyIdService.CompanyId,

            CompanyGroupID: this._config.environment.CompanyGroupID,
        };
        //this.openSpinner();
        //this.Color();
        
        let getDepartmentJobs = this._config.environment.baseUrl + Constants.GetDepartmentJobs;
        this.http.post(getDepartmentJobs, RequestObject, { headers: this.dataService.headers })
     // this.http.post("https://jobportalapi.azurewebsites.net/GetDepartmentJobs", RequestObject)
            .subscribe((response: any) => {
                
                this.departmentJobs = response.Data;
                //this.HideSpinner();

            }, (error: any) => {
                console.log(error);
            });
    }


    HideOrganization: boolean = false;
    HideJobCode: boolean = false;
    HideTotalPositions: boolean = false;
    HideJobAttributeName: boolean = false;

    lblJobAttributeName: string = "JobAttributeName";


    SelectedCompany: number = -1
    onChange() {
        debugger
        this.getOpenVacancies();
    }

    getOpenVacancies() {
        let RequestObject = {
            Culture: Constants.Culture,
            CompanyId: this.SelectedCompany,
            ApplicantId: localStorage.getItem("AppId"),
            CompanyGroupID: this._config.environment.CompanyGroupID,

        };
        this.isJobAvailable = false;
        this.HideOrganization = false;
        this.HideJobCode = false;
        this.HideTotalPositions = false;
        this.HideJobAttributeName = false;

        this.openSpinner();
     //   this.Color()
        let getOpenVacancies = this._config.environment.baseUrl + Constants.GetOpenVacancies;
        this.http.post(getOpenVacancies, RequestObject, { headers: this.dataService.headers })
     // this.http.post("https://jobportalapi.azurewebsites.net/GetOpenVacancies", RequestObject)
            .subscribe((response: any) => {
                
              this.openVacancies = response.Data;
              this.filteredJobs = this.openVacancies;
              //console.log(this.filteredJobs);
              if (!isNullOrUndefined(this.openVacancies) && this.openVacancies.length > 0) {
                this.isJobAvailable = true;
              }

              let len = this.filteredJobs.length;
              //console.log(len);
              //console.log(this.HideOrganization);
             // console.log(this.ShowCompanyInfo);


              if (!isNullOrUndefined(this.filteredJobs) && len > 0) {
                //this.isOpenVacancy = true;

                for (let i = 0; i < len; i++) {
                  if (this.filteredJobs[i].VisOrganization != "" && !this.HideOrganization)
                    this.HideOrganization = true;
                  //console.log(this.HideOrganization);

                  if (this.filteredJobs[i].VisJobCode != "" && !this.HideJobCode)
                    this.HideJobCode = true;

                  if (this.filteredJobs[i].VisTotalPositions != "" && !this.HideTotalPositions)
                    this.HideTotalPositions = true;

                  //if (this.filteredJobs[i].JobAttributeName != "" && this.filteredJobs[i].JobAttributeName.trim().toUpperCase() !== "N/A" && !this.HideJobAttributeName)
                  //  this.HideJobAttributeName = true;

                 

                  if (this.filteredJobs[i].AdditionalFilter != ""  && !this.HideJobAttributeName)
                    this.HideJobAttributeName = true;

                  for (let i = 0; i < this.filteredJobs.length; i++) {
                    const attr = this.filteredJobs[i].showJobattribute_jobportal;

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

              //console.log(this.HideOrganization);

              this.HideSpinner();
              
              const foundItem = this.openVacancies.find(item => item.JobCode === this.AppliedJobCode);
              if (foundItem) {                
                this.GetMPRDetail(foundItem);
                this.ForSelectedRowColor1();
              }

            }, (error: any) => {
                console.log(error);
            });
    }

    isOpenVacancy: boolean = false;
    HasJobStatusData: boolean = false;
    HasApplicantStatusData: boolean = false;

    HasApplicantOfferletterData: boolean = false;
    HasApplicantOfferRescind: boolean = false;
    IsOfferRescinded: boolean = false;
    IsOfferLetter: boolean = false;
    ModalHeading: string = "";
    OfferResponded: boolean = false;
    unreadMessageCounts: { [jobCode: string]: number } = {};


    onChatClick(event: MouseEvent, jobCode: string, JobTitle: string): void {
      debugger;
      event.stopPropagation();
      this.unreadMessageCounts[jobCode] = 0;

      this.chatService.showChat(jobCode, JobTitle);


    }

    getAppliedJobs() {
        

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

           
              if (!isNullOrUndefined(this.appliedJobs) && len > 0){
                this.isOpenVacancy = true;                 

                for (let i = 0; i < len; i++)
                { 
                    if (this.appliedJobs[i].JobStatus != "" && !this.HasJobStatusData)
                      this.HasJobStatusData = true;

                    if (this.appliedJobs[i].ApplicantStatus != "" && !this.HasApplicantStatusData)
                      this.HasApplicantStatusData = true;

                    if (this.appliedJobs[i].Offerletterissued == true && this.appliedJobs[i].IsOfferRescinded == false) {
                      this.HasApplicantOfferletterData = true;
                      this.IsOfferLetter = true;
                      this.getChatMessages(this.appliedJobs[i].JobCode);
                      this.remarks = this.appliedJobs[i].Remarks; // pre-fill remarks
                      this.ModalHeading = "Offer Letter";

                    }
                    else if (this.appliedJobs[i].IsOfferRescinded == true) {
                        this.HasApplicantOfferRescind = true;
                        this.IsOfferRescinded = true;
                        this.ModalHeading = "Rescind Letter";
                      }

                    //if (this.appliedJobs[i].OfferLetterStatus == "3") {
                    //  this.OfferResponded = true;
                    //}

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
    //viewOfferLetter(DocText: string) {
    //  // Inject the dynamic offer letter content into the modal body
    //  $('#myModaloffer .modal-body').html(DocText);

    //  // Show the modal
    //  $('#myModaloffer').modal('show');
    //}


    responseMessage: string = '';

    public remarks: string = '';

    isRejectOrRespond: boolean = false;


    submitOfferResponse(action: number, expectedDate: string) {
      debugger;

      if ((action === 2 || action === 3) && !this.remarks) {
        debugger;
        this.isRejectOrRespond = true;

        return; 
      }

      const RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),//"27866" , // localStorage.getItem("AppId"),                      // change once completed    "27866" ,
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId,
        CompanyGroupID: this._config.environment.CompanyGroupID,
        OfferLetterAcceptanceStatus: action,                            // 1 = Accept, 2 = Reject, 3 = Respond with comments
        OfferLetterRemarks: this.remarks,
        JobCode: this.selectedRow.JobCode,                              // change once completed    "1-102019-01"
        ExpectedJoiningDate: expectedDate ,
        ApplicantEmail: localStorage.getItem("Email"),//"muhammad.usama@softronicsys.com", //localStorage.getItem("Email"),                  //"muhammad.usama@softronicsys.com",
        RecommendedByEmpId: this.selectedRow.RecommendedByEmpId,                       
      };

      this.openSpinner();

      if (action === 2 || action === 3) {
        debugger;
        this.remarks = '';
        this.isRejectOrRespond = false;
      }

      const apiUrl = this._config.environment.baseUrl + Constants.SubmitOfferResponse;

      this.http.post(apiUrl, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {
          //console.log('Offer response submitted:', response);

          $('#MPRCODE1').modal('hide');
          $('#myModaloffer').modal('hide');

          if (response.IsValid) {
            if (action === 1 || action === 2 || action === 3) {
              this.responseMessage = "Your response has been submitted. You will be contacted soon by the HR department.";
            } else {
              this.responseMessage = "An unknown error occurred.";
            }
          } else {
            this.responseMessage = "An error occurred. Please try again later.";
          }

          $('#responseModal').modal('show');
          this.getAppliedJobs();
          this.HideSpinner();
        },
        (error: any) => {
          console.error('Error submitting offer response:', error);
          this.responseMessage = "An error occurred. Please try again later.";
          $('#responseModal').modal('show');
          this.HideSpinner();
        });
    }


    getChatMessages(jobCode?: string) {
      debugger;

      const RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        CompanyId: this.CompanyIdService.CompanyId,
        JobCode: jobCode,

      };

      const url = this._config.environment.baseUrl + Constants.GetChatMessagesForCounter;

      this.http.post(url, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any[]) => {
          const unreadFromSenderType2 = response.filter(msg => msg.SenderType === 2 && !msg.IsRead);

          // store count for this JobCode
          this.unreadMessageCounts[jobCode] = unreadFromSenderType2.length;
        },
        (error) => {
          console.error("Failed to fetch messages for jobCode:", jobCode, error);
          this.unreadMessageCounts[jobCode] = 0; // set to 0 if error
        }
        );
    }

    expectedJoiningDate: string; 
    selectedAction: number;
    ExpectedDateMandatory: boolean = false;
    PreviousDateMandatory: boolean = false; 



    // When the user submits the date
    submitExpectedDate() {
      debugger;
      if (!this.expectedJoiningDate) {
        this.ExpectedDateMandatory = true;
        return;
      }


      const selectedDate = new Date(this.expectedJoiningDate);
      const currentDate = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        this.PreviousDateMandatory = true; 
        return;
      }

      this.PreviousDateMandatory = false

      this.ExpectedDateMandatory = false;

      this.submitOfferResponse(this.selectedAction, this.expectedJoiningDate);

      $('#expectedDateModal').modal('hide');
    }

    openDateModal(row: any, action: number) {
      debugger;
      this.selectedRow = row; 
      this.selectedAction = action;
      this.expectedJoiningDate = '';
      this.remarks = '';
      this.isRejectOrRespond = false;
      this.ExpectedDateMandatory = false;
      $('#expectedDateModal').modal('show');
    }

    closeOfferModals() {
      $('#expectedDateModal').modal('hide');
    }

    selectedJob: number;

    viewOfferLetter(DocText: string, job: any) {
      debugger;


      $('#myModaloffer .modal-body').html(DocText);

      

      $('#myModaloffer .modal-body').css('color', 'inherit');
      $('#myModaloffer .modal-body b').css('color', 'inherit');
      $('#myModaloffer .modal-body a').css('color', 'inherit').css('text-decoration', 'none');

      $('#myModaloffer .modal-body th').css({
        'color': 'black',
        'font-weight': '600'
      });

      this.selectedRow = job;  

      this.selectedJob = job.OfferLetterStatus;


      $('#myModaloffer').modal('show');  //
    }

    closeModals() {

      this.isRejectOrRespond = false;

      $('#MPRCODE1').modal('hide');
      $('#myModaloffer').modal('hide');
    }



    //showChat: boolean = false; 

    //chatColor = 'blue'; 

    //openChat(item: any): void {
    //  debugger;
    //  alert("Opening chat")
    //  this.showChat = true;
    //  alert("closing chat")

    //  // Optionally use item to load data in chat
    //}

    //closeChat(): void {
    //  debugger;
    //  this.showChat = false;
    //}
    


    // MPRDetail //


    forGridData = {

        showMeetings: false,
        showReports: false,
        showAcademicQualifications: false,
        showTrainings: false,
        showCertification: false,
        showCompetencies: false,
        showAuthorities: false,
    }

    Object = {
      listofMPR: undefined,
        reports: undefined,
        authorities: undefined,
        meetings: undefined,
        academicQualifications: undefined,
        trainings: undefined,
        certification: undefined,
        competencies: undefined

    }

    selectedRow: any;

    selectedJobCode: string = "";
    selectedCompanyId: number;
    GetMPRDetail(selectedRow: any) {      
      debugger;
        this.selectedRow = selectedRow;

        this.arrHeadings = [];
         

        const arrPanelHeadings: string[] = ["Work Experience", "Additional Requirement", "Incentive Package",
            "Other Benefit", "Salary Remarks", "Job Summary", "Accountabilities", "Responsibilities",
            "Extra Ordinary Work Condition"];
        this.selectedJobCode = selectedRow.JobCode;
        this.selectedCompanyId = selectedRow.CompanyId;

        let RequestObject = {
            MPRCode: selectedRow.JobCode,
            CompanyId: selectedRow.CompanyId,
            Culture: Constants.Culture,
        }
       // this.Color()
        this.openSpinner();
        let getMPRDetail = this._config.environment.baseUrl + Constants.GetMPRDetail;
        this.http.post(getMPRDetail, RequestObject, { headers: this.dataService.headers })
          .subscribe((response: any) => {
            debugger;
              this.arrHeadings = [];
              this.forGridData = {
                showMeetings: false,
                showReports: false,
                showAcademicQualifications: false,
                showTrainings: false,
                showCertification: false,
                showCompetencies: false,
                showAuthorities: false,
              }

              this.Object = {
                listofMPR: undefined,
                reports: undefined,
                authorities: undefined,
                meetings: undefined,
                academicQualifications: undefined,
                trainings: undefined,
                certification: undefined,
                competencies: undefined
              }

              this.MPRDETAIL = response;
              //console.log(this.MPRDETAIL);
                this.HideSpinner();

                
              

                arrPanelHeadings.forEach((item: string) => {
                    for (let value of this.MPRDETAIL) {

                        for (let value1 of value) {
                            if (String(value1.Heading).toLowerCase().trim() == item.toLowerCase().trim()) {
                                this.arrHeadings.push(value1);
                                break;
                            }
                        }
                    }
                });
              
            
                for (let i = 0; i < this.MPRDETAIL.length; i++) {
                  for (var j = 0; j < 1; j++) {               
                    if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "ListOfMPR".toLowerCase()) {                       
                      this.Object.listofMPR = this.MPRDETAIL[i];
                    }

                    if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Authorities".toLowerCase()) { 
                            this.forGridData.showAuthorities = true;
                            this.Object.authorities = this.MPRDETAIL[i];                           
                    }

                    if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Meetings".toLowerCase()) {
                      this.forGridData.showMeetings = true;
                      this.Object.meetings = this.MPRDETAIL[i];                   
                    }

                    if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Reports".toLowerCase()) {
                      this.forGridData.showReports = true;
                      this.Object.reports = this.MPRDETAIL[i];
                    }

                    else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "AcademicQualification".toLowerCase()) {
                            this.forGridData.showAcademicQualifications = true;
                            this.Object.academicQualifications = this.MPRDETAIL[i]; 
                    }

                    else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Trainings".toLowerCase()) {
                      this.forGridData.showTrainings = true;
                      this.Object.trainings = this.MPRDETAIL[i]; 
                    }

                    else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Certifications".toLowerCase()) {
                      this.forGridData.showCertification = true;
                      this.Object.certification = this.MPRDETAIL[i]; 
                       
                    }

                    else if (String(this.MPRDETAIL[i][j].TemplateName).toLowerCase().trim() == "Competencies".toLowerCase()) {
                      this.forGridData.showCompetencies = true;
                      this.Object.competencies = this.MPRDETAIL[i];
                       
                    }
                  }
                   
                }               
            });
    }

    getJobDHistory(selectedRow: any) {
      this.clickRow = false;
      this.appStatusJobTitle = selectedRow.JobTitle;
      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        MPRCode: selectedRow.JobCode,
        CompanyId: selectedRow.CompanyId
      }
      //console.log('getJobHistory Model values are', RequestObject);
      // this.Color()
      this.openSpinner();
      let jobHistoryURL = this._config.environment.baseUrl + 'GetApplicantStatusHistory';
      this.http.post(jobHistoryURL, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {

          this.jobHistory = response;
          //console.log('jobHistory Details : ', this.jobHistory);
          this.HideSpinner();
        });
    }
    JobCode: string = "";
    CompanyId: string = "";
    applyForDepartmentJob: any;
    errormsgRegistration: string = "";

    ApplyForDepartmentJob(JobCode, CompanyId) {

        
        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            Culture: "en-GB",
            MPRCode: JobCode,
            CompanyId: CompanyId,
            ApplicantEmail: localStorage.getItem("Email"),
            IsRequestFromMobile: false

        }
        this.myJobCounter();
        this.openSpinner();
        let applyForDepartmentJob = this._config.environment.baseUrl + Constants.ApplyForDepartmentJob;
        this.http.post(applyForDepartmentJob, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {

            
            if (response.IsValid == true) {
                //this.toastr.success(response.Msg, '', {
                //    positionClass: "toast-bottom-right",
                //});
                this.isTick = true;
                this.message = response.Msg;
                //$("#JobApplicantMsg").modal("show");
            }

            if (response.IsValid == false) {
               // this.errormsgRegistration = response.Msg;
                this.isTick = false;
                this.message = response.Msg;
                //$("#JobApplicantMsg").modal("show");
            }

            this.applyForDepartmentJob = response;
            this.getDepartmentJobs();
            this.myJobCounter();
            this.HideSpinner();
            this.popuphide();
           
        }, (error: any) => {
            console.log(error);
        });

    }

    fnFilterJob(textToFilter) {
      let rawData = this.openVacancies;
      // console.log('Filtered data : ',rawData);
      let that = this;
      textToFilter = textToFilter.toLowerCase();
      that.filteredJobs = [];
      rawData.forEach(function (item, index, object) {
        if (that.searchFilter == "0" && (item.JobTitle.toLowerCase().indexOf(textToFilter) !== -1 || item.Location.toLowerCase().indexOf(textToFilter) !== -1 || item.CompanyName.toLowerCase().indexOf(textToFilter) !== -1)) {
          that.filteredJobs.push(item);
        }
        else if (that.searchFilter != "0" && item[that.searchFilter] && (item[that.searchFilter]).toLowerCase().indexOf(textToFilter) !== -1)
          that.filteredJobs.push(item);
      });
    }

    popuphide() {
      debugger;
        
        setTimeout(() => {

            $("#JobApplicantMsg").modal('hide');

        }, 4400)
    }


    removeMsg() {
      debugger;
        $("#JobApplicantMsg").modal("hide");
        this.message = "";
    }

    applyJobs: any;
    message: string = "";
    isTick: boolean = false;
    SocialLink: any;
    CurrentURL: any;

   // selectedRow: any   -- > use in ApplyJob Bracket

    ApplyJob(JobCode, CompanyId) {
      debugger;
        this.clickRow = false;
        //this.selectedRow;  
        let RequestObject = {

            ApplicantId: localStorage.getItem("AppId"),
            Culture: Constants.Culture,
            MPRCode: JobCode,//Vac.JobCode,//this.selectedRow.JobCode,
            CompanyId: CompanyId,//Vac.CompanyId,//this.selectedRow.CompanyId,
            ApplicantEmail: localStorage.getItem("Email"),
            LoginCompanyId: this.CompanyIdService.CompanyId// Vac.CompanyId //this.CompanyIdService.CompanyId
        }
        this.myJobCounter();
        this.openSpinner();
        let applyJob = this._config.environment.baseUrl + Constants.ApplyJob;
        this.http.post(applyJob, RequestObject, { headers: this.dataService.headers })
            .subscribe((response: any) => {

                this.applyJobs = response;
             //   console.log("ioooiiooioi ---", this.applyJobs)
                this.getAppliedJobs();
                this.getOpenVacancies();
                this.HideSpinner();
                this.myJobCounter();

                if (response.IsValid == true) {
                    this.isTick = true;
                    this.message = response.msg;
                    $("#JobApplicantMsg").modal("show");
                }
                if (response.IsValid == false) {
                    
                    this.isTick = false;
                    this.message = response.msg;
                    $("#JobApplicantMsg1").modal("show");
                    
                }
                this.popuphide();
                this.assessService.getAllAssessments();
                this.assessService.getAssessmentTabCount();

            }, (error: any) => {
                console.log(error);
            });

    }

    formatValidationMsg(msg: string): string {
      // Split the message by <br> tags and filter out empty items
      const listItems = msg.split('<br>').filter(item => item.trim() !== '').map(item => item.trim()).join(', ');

    
      // Format the final message
      return `Missing mandatory Input(s) to apply against any Position:<br><br>${listItems}`;
    }


    ShareOnSocialMedia(link, JobCode, JobTitle, CompanyId, CompanyName) {
     // alert(this.CompanyIdService.RedirectPath);
      this.clickRow = false;
      this.CurrentURL = window.location.origin + "/" + window.location.pathname.split('/')[0];//.split('/')[0];
      var repLink = /<%link%>/gi;
      var repText = /<%text%>/gi;
      //localStorage.setItem("GID", this._config.environment.CompanyGroupID + "," + CompanyId);
      //this.SocialLink = link.replace(repLink, this.CurrentURL + "/JobDetail?JID=" + JobCode + "&CId=" + CompanyId + "&GId=" + this._config.environment.CompanyGroupID);
      this.SocialLink = link.replace(repLink, this.CompanyIdService.RedirectPath + "/JobDetail/" + JobCode + "-" + this._config.environment.CompanyGroupID + "-" + CompanyId);
      //console.log(this.SocialLink)
      this.SocialLink = this.SocialLink.replace(repText, "Job Opening " + JobTitle + " at " + CompanyName);
    
      window.open(
        this.SocialLink,'_blank'  
      );
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
    // this.tickImage = "../../../assets/images/" + this.code + "/tick.PNG";

    Color() {
        
        this.forChanges = this.ClrThemeChng.ChangeTheme;

        if (isNullOrUndefined(this.forChanges)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.DefaultBorderColor = "1px solid #" + Constants.default;
            this.tickImage = "assets/images/" + Constants.default + "/tick.png";
            this.IsDefaultTheme = true;
        }
        else if (!isNullOrUndefined(this.forChanges)) {

          this.breakcode = this.forChanges.split('#');
          this.code = this.breakcode[1];
            this.ThemeFontColor = this.forChanges;
            this.BorderColor = "1px solid" + this.forChanges;
            this.tickImage = "assets/images/" + this.code + "/tick.png";
            this.iscolor = true;
            this.IsDefaultTheme = false;
        }
    }

    IsCollapse: boolean = false;
    IsCollapseDepart: boolean = true;

    CollapseExpand(Identifier, Id) {
      debugger;
      if (Identifier == "Expand" && Id == 1)
      {
        this.IsCollapse = false;
      }

      if (Identifier == "Collapse" && Id == 1) {
        this.IsCollapse = true;
      }

      if (Identifier == "Expand" && Id == 2) {
        this.IsCollapseDepart = false;
      }

      if (Identifier == "Collapse" && Id == 2) {
        this.IsCollapseDepart = true;
      }
    }



}

