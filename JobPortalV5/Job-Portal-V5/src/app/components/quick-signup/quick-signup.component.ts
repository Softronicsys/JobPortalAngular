import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/Shared/Services/data.services';
import { Constants } from '../../Helper/Constant';
import { AppConfigService } from '@app/Service/app-config.service'; // Import AppConfigService
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { TabStateService } from '@app/Service/tab-state.service'; // Assuming TabStateService is imported correctly
import { FormsModule } from '@angular/forms';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { isNullOrUndefined } from 'util';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';








declare var $: any;

@Component({
  selector: 'app-quick-signup',
  templateUrl: './quick-signup.component.html',
  styleUrls: ['./quick-signup.component.css']
})

export class QuickSignupComponent implements OnInit {

  // Property declarations

  isdisabled: boolean = true;
  myId = 'testId';
  haserror = "true";
  hello3 = "true";
  button = true;


  lblcolor: boolean = true;
  lblcolor2: boolean = false;
  lblcolor3: boolean = false;


  isBtnHide1: boolean = false;
  isMandatoryfields: boolean = false;
  DisconnectInternet: boolean = false;

  isMandatoryfieldsbasic1: boolean = false;
  genderval;
  forDateVlaidationcity: boolean = false;
  forDateVlaidationcity1: boolean = false;


  registerCompanyName: string = "";


  classcolor = {
    "new1": this.lblcolor,
    "new2": this.lblcolor2,
    "new3": this.lblcolor3

  }

  pearl = {
    color: "Red",
    fontStyle: "italic"
  };

  colorclass = {
    "new4": this.hello3
  };

  new1 = {
    "button": this.hello3
  };


  NewApplicant: string = "New Applicant";
  Firstname: string = "First Name";
  MiddleName: string = "Middle Name";
  LastName: string = "Last Name";
  EmailAddress: string = "Email Address";
  IDCardNo: string = "ID Card No";


  ApplyJobMsg: string = "";

  
  constructor(private http: HttpClient, private objRouter: Router, private dataService: DataService, public ClrThemeChng: ThemeColorService, private Labels: Labels, private _config: AppConfigService, private spinner: NgxSpinnerService, private tabStateService: TabStateService, public CompanyIdService: GetCompanyParameter, public sanitizer: DomSanitizer,) { }
    
  
  FormData: FormDetails = new FormDetails();

  ngOnInit() {
    debugger;
    this.getCompanyParameter();

    this.proposedDesignation = this.proposedDesignations.find(designation => designation.id === '-1') || null;
    this.mainTeam = this.mainTeams.find(team => team.id === '-1') || null;
    this.team = this.teams.find(team => team.id === '-1') || null;
    this.region = this.regions.find(region => region.id === '-1') || null;
    this.district = this.districts.find(district => district.id === '-1') || null;
    this.territory = this.territories.find(territory => territory.id === '-1') || null;
    this.directReportingTo = this.directReportings.find(reportingTo => reportingTo.id === '-1') || null;
    this.currentlyEmployed = this.CurrentlyEmployed.find(empl => empl.id == null ) || null;
    this.BaseCity = this.Basecities.find(city => city.id === '-1') || null;
    this.whenCanYouJoin = this.DateofJoining.find(date => date.id === '-1') || null;

  }


  getCompanyParameter() {
    this.openSpinner();
    debugger;
    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
    this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {

      if (response.CompanyId == 0) {
        $("#myModalWrongURL").modal("toggle");
        this.WrongUrl = false;
        localStorage.removeItem(this._config.environment.CompanyGroupID);
        return;
      }
      this.CompanyIdService.CompanyId = response.CompanyId;
      if (response.CompanyId != 0) {
        var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + "false" + ",,,,";
        localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
        localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID)
      }
      this.CompanyIdService.CompanyName = response.CompanyName;
      this.CompanyIdService.RedirectPath = response.RedirectPath;
      this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
      //this.Color();
      debugger;
      this.getHomeLabels();
      this.registerCompanyName = this.CompanyIdService.CompanyName;
      localStorage.setItem('CompanyName', this.registerCompanyName);
      //  this.HideSpinner();
      this.getJobPortalConfiguration()
      this.ActivateAccount();
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
    debugger;

    /** spinner starts on init */
    this.spinner.show();
  }

  lblDear: string = "Dear";
  lblAccountActivation: string = "Account Activation";
  lblViewProfile: string = "VIEW PROFILE";

  RegType: string = "1";

  getHomeLabels() {
    debugger;
    if (this.Labels.dashLabels == true) {
      this.lblDear = this.Labels.lblDear;
      this.lblAccountActivation = this.Labels.lblAccountActivation;
      this.lblViewProfile = this.Labels.lblViewProfile;
    }
  }


  egType: string = "1";
  JobCode: "";
  CompGroupIdKey: string = "";
  key: any;
  isLogin: boolean = false;
  msg: string = "";
  showLink: boolean = false;
  LinkMsg1: string = "";
  LinkMsg2: string = "";

  WrongUrl: boolean = true;

  registered: boolean = false;
  wrong: boolean = false;
  regenerateLink: boolean = false;
  ViewProfile: boolean = false;

  // for backgrouud color // 

  BackgroundImage: string = "";
  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  NameCompany: string = "";
  NameCompany1: string = "";

  imageSize: string = "";
  AssessmentNames: string = "";
  AssessmentNames1: string = "";
  AssessmentNames2: string = "";
  AssessmentNames3: string = "";
  UserName: string = "";


  AccountData = {
    UserName: null,
    CompanyName: null,
    Email: null,
    IsValid: null,
    Message: null,
    IsAccountCreated: null,
    IsViewProfile: null
  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  IsAssessmentScheduled: boolean = false;

  ActivateAccount() {
    let RequestObject = {

      Guid: this.key,
      CompanyId: this.CompanyIdService.CompanyId,
      CompanyGroupID: this._config.environment.CompanyGroupID,
      LinkExpiryTime: Constants.LinkExpiryTime,
    }

    this.openSpinner();
    let activateAccount = this._config.environment.baseUrl + Constants.ActivateAccount;
    this.http.post(activateAccount, RequestObject, { headers: this.dataService.headers })
      //  this.http.post("https://jobportalapi.azurewebsites.net/ActivateAccount", RequestObject)
      .subscribe((response: any) => {
        this.AccountData = response;
        debugger;
        this.HideSpinner();
        localStorage.setItem('UserName', response.UserName);

        if (response.Message == "Your account has been successfully activated. Please complete your profile by clicking on the button below.") {

          let msgs = response.Message.split('.');
          let LinkMsg1 = msgs[0];
          let LinkMsg2 = msgs[1];
          localStorage.setItem('LinkMsg1', LinkMsg1);
          localStorage.setItem('LinkMsg2', LinkMsg2);
          this.LinkMsg1 = localStorage.getItem("LinkMsg1");
          this.LinkMsg2 = localStorage.getItem("LinkMsg2");
          this.ViewProfile = true;
          this.Color();
          this.registered = false;
          this.wrong = false;
          this.regenerateLink = false;
          this.imageSize = "BackgroundImageAccountActivation";
          this.IsAssessmentScheduled = response.IsAssessmentScheduled;
          this.AssessmentNames = response.AssessmentNames.split(',');
          this.AssessmentNames1 = this.AssessmentNames[0];
          this.AssessmentNames2 = this.AssessmentNames[1];
          this.AssessmentNames3 = this.AssessmentNames[2];
          debugger;
        }

        if (response.Message == "You already registered at" && response.IsAccountCreated == false) {

          this.registered = true;
          this.Color();
          this.ViewProfile = false;
          this.wrong = false;
          this.regenerateLink = false;
          this.NameCompany1 = localStorage.getItem("CompanyName");
          this.NameCompany = this.NameCompany1;

        }
        if (response.IsAccountCreated == false && response.IsValid == false && response.IsViewProfile == false) {

          this.wrong = true;
          this.Color();
          this.registered = false;
          this.ViewProfile = false;
          this.regenerateLink = false;
          this.imageSize = "WentWrongImage";
        }

        if (response.Valid == true) {

          this.regenerateLink = true;
          this.Color();
          this.wrong = false;
          this.registered = false;
          this.ViewProfile = false;


          let msgs = response.Message.split('.');
          let LinkMsg1 = msgs[0];
          let LinkMsg2 = msgs[1];

          console.log('LinkMsg1 : ', LinkMsg1);
          console.log('LinkMsg2 : ', LinkMsg2);
          localStorage.setItem('LinkMsg1', LinkMsg1);
          localStorage.setItem('LinkMsg2', LinkMsg2);
          this.LinkMsg1 = localStorage.getItem("LinkMsg1");
          this.LinkMsg2 = localStorage.getItem("LinkMsg2");

        }

        if (!isNullOrUndefined(response) && response.IsValid == true && response.IsViewProfile == true) {
          //  localStorage.setItem('UserName', response.UserName);
          // console.log('Username : ', localStorage.getItem('UserName'));
          this.UserName = response.UserName;
          //var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + "false" + "," + response.AppId +
          //    "," + response.Email + "," + response.UserName + ",";
          //localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
          localStorage.setItem("LastLoginId", this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID)

        }



        //redirect as was signup viaApplyJob
        if (this.RegType == "2") {
          if (response.Message == "Your account has been successfully activated. Please complete your profile by clicking on the button below.") {
            //this.PersonalInfo();
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
    let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
    this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
      .subscribe((response: any) => {
        if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor)) {
          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
        }

        this.Color();
      })
  }


  activeMyJobs: boolean = false;
  activePersonalInfo: boolean = false;
  activeProfessionalInfo: boolean = false;
  activeAssessment: boolean = false;

  hideMyJobsTab: boolean = false ;


  forChanges: any;
  code: any;
  breakcode: any;

  Color() {
    debugger;
    this.forChanges = this.ClrThemeChng.ChangeTheme;

    if (isNullOrUndefined(this.forChanges)) {
      this.DefaultFontColor = "#" + Constants.default;
      this.BackgroundImage = "assets/images/" + Constants.default + "/Asset8.png";
    }
    else if (!isNullOrUndefined(this.forChanges)) {

      this.breakcode = this.forChanges.split('#');
      this.code = this.breakcode[1];

      this.ThemeFontColor = this.forChanges;
      this.BackgroundImage = "assets/images/" + this.code + "/Asset8.png";
    }

  }

  HideSpinner() {
    debugger;

    /** spinner starts on init */
    this.spinner.hide();
  }

  openMyProfileWithTwoTabs() {
    debugger
    this.tabStateService.setShowLimitedTabs(true);
    window.open('http://localhost:4200/MyProfile', '_blank');
  }
  

  firstName: string = "";
  middleName: string = "";
  lastName: string = "";
  email: string = "testdevelopment135@gmail.com";
  idCardNumber: string = "";

  proposedDesignation: { id: string, Name: string } | null = null;
  mainTeam: { id: string, Name: string } | null = null;
  team: { id: string, Name: string } | null = null;
  region:  { id: string, Name: string } | null = null;
  district: { id: string, Name: string } | null = null;
  territory:  { id: string, Name: string } | null = null;
  directReportingTo: { id: string, Name: string } | null = null;

  //expectedDateOfJoining: { date: null | null };
  whenCanYouJoin: { id: string, Name: string } | null = null;
  grossSalary: number | null = null;
  currentlyEmployed: { id: boolean; Name: string } | null = null;

  BaseCity: { id: string, Name: string } | null = null;



  proposedDesignations = [
    { id: '-1', Name: 'N/A' },
    { id: '7891', Name: 'Senior Project Manager' },
    { id: '2', Name: 'Senior Analyst' },
    { id: '3', Name: 'Marketing Lead' },

  ];

  mainTeams = [
    { id: '-1', Name: 'N/A' },
    { id: '1', Name: 'Customer Support' },
    { id: '2', Name: 'Product Development' },
    { id: '3', Name: 'Sales and Marketing' },
  ];

  teams = [
    { id: '-1', Name: 'N/A' },
    { id: '1,2,3', Name: 'Human Resources' },
    { id: '2', Name: 'Finance' },
    { id: '3', Name: 'Information Technology' },
  ];

  regions = [
    { id: '-1', Name: 'N/A' },
    { id: '1', Name: 'Karachi' },
    { id: '2', Name: 'HYD' },
    { id: '3', Name: 'test' },
  ];

  districts = [
    { id: '-1', Name: 'N/A' },
    { id: '1', Name: 'South District' },
    { id: '2', Name: 'Northside District' },
    { id: '3', Name: 'East End District' },
  ];

  territories = [
    { id: '-1', Name: 'N/A' },
    { id: '1', Name: 'Central Territory' },
    { id: '2', Name: 'Territory B' },
    { id: '3', Name: 'Territory C' },
  ];

  directReportings = [
    { id: '-1', Name: 'N/A' },
    { id: '1', Name: 'Sales Manager' },
    { id: '2', Name: 'HR Specialist' },
    { id: '3', Name: 'Marketing Coordinator' },
  ];

  CurrentlyEmployed = [
    { id: null, Name: 'N/A' },
    { id: true, Name: 'Yes' },
    { id: false, Name: 'No' },
    
  ];

  Basecities = [
    { id: '-1', Name: 'N/A' },
    { id: '00000001', Name: 'ABBOTTABAD' },
    { id: '00000002', Name: 'AZAD KASHMIR' },
    { id: '00000003', Name: 'BANNU' },
    { id: '00000004', Name: 'BHAKKAR' },

  ];

 DateofJoining = [
    { id: '-1', Name: 'N/A' },
    { id: '0', Name: 'Within 15 days' },
    { id: '1', Name: 'Within 30 days' },
    { id: '2', Name: 'Within 90 days' },
  ];



  LoginEmpId: number = 47;

  SaveQuickform() {
    debugger;

    if (navigator.onLine) {
      debugger;

      
        const RequestObject = {
        //Appid: localStorage.getItem('AppId'),
        Email: localStorage.getItem('Email'),
        FirstName: this.firstName,
        MiddleName: this.middleName,
        LastName: this.lastName,
        IdcardNo: this.idCardNumber,
        email: this.email,
        CompanyId: this.CompanyIdService.CompanyId,

        ProposedDesignationID: this.proposedDesignation.id,
        //ProposedDesignationName: this.proposedDesignation.Name,
        MainTeamID: this.mainTeam.id,
        //MainTeamName: this.mainTeam.Name,
        TeamID: this.team.id,
        //TeamName: this.team.Name,
        RegionID: this.region.id,
        //RegionName: this.region.Name,
        DistrictID: this.district.id,
        //DistrictName: this.district.Name,
        TerritoryID: this.territory.id,
        //TerritoryName: this.territory.Name,
        DirectReportingToID: this.directReportingTo.id,
        //DirectReportingToName: this.directReportingTo.Name,
        //ExpectedDateOfJoining: this.expectedDateOfJoining,

        ExpectedDateOfJoining: this.whenCanYouJoin.Name,
       
        GrossSalary: this.grossSalary,
        CurrentlyEmployed: this.currentlyEmployed.id,
        BaseCity: this.BaseCity.id,

        RecommendedByEmpId : this.LoginEmpId,
        //CurrentDate: new Date().toISOString().split('T')[0]  // Formats date as YYYY-MM-DD
      };

 
        const Registered_SendEmail_to_Applicant = this._config.environment.baseUrl + Constants.Registered_SendEmail_to_Applicant;
        // Use PostData with the appropriate headers and set isGenerateLink to false
        this.PostData(RequestObject, Registered_SendEmail_to_Applicant, { headers: this.dataService.headers }, false);

    } else {
      this.DisconnectInternet = true;
    }
  }


     GenerateLink() {
        debugger;
        this.LinkMsgGenerate = "";
        this.LinkMsgGenerate1 = "";

        //$("#myModalSingupErr").modal("hide");
        let RequestObject = {

          Guid: localStorage.getItem('GuidID'),
          CompanyId: this.CompanyIdService.CompanyId,
          RecommendedByEmpId: this.LoginEmpId,
           //FromEmail: Constants.FromEmail,
        }

        this.openSpinner();
        let GenerateNewLinkFF = this._config.environment.baseUrl + Constants.GenerateNewLinkFF;
        this.http.post(GenerateNewLinkFF, RequestObject, { headers: this.dataService.headers })
          //  this.http.post("https://jobportalapi.azurewebsites.net/GenerateNewLinkFF", RequestObject)
          .subscribe((response: any) => {
            console.log('response : ', response);
            this.link = response;
            this.HideSpinner();
            debugger;
            if (!isNullOrUndefined(response) && response.Valid == true) {
              $("#myModalSingupErr").modal("hide");
              let msgs = response.message.split('<br/>');
              let successMsg = msgs[0];
              let msg1 = msgs[1].split('.');
              let msg2 = msg1[0];
              let msg3 = msg1[1];
              console.log('Msg : ', msgs);
              console.log('Success : ', successMsg);
              console.log('Msg1 : ', msg1);

              localStorage.setItem('msg', successMsg);
              localStorage.setItem('msg1', msg2);
              localStorage.setItem('msg2', msg3);

              this.objRouter.navigate(['/account-success']);
              this.openSpinner();
              localStorage.setItem('ForShowAccountSuccess', "For Show Account-Success");

              localStorage.removeItem("bankName");
              localStorage.removeItem("CheckForAllBtn");

            }

            if (!isNullOrUndefined(response) && response.Valid == false) {
              this.MsgValidate = response.message;
              this.generateLink = false;
            }

          }, (error: any) => {
            console.log(error);
          });
      }

  LinkMsgGenerate: string = "";
  LinkMsgGenerate1: string = "";
  RestrictMsg1: any;
  genLink1: any;
  genLink12: any;
  genLink13: any;
  genLink14: any;
  genLink15: any;
  generateLink: boolean = false;
  RestrictMsg: string = "";
  ErrMsg: boolean = false;
  MsgValidate: string = "";
  link: any;
  linkProcessValid: boolean = false;


  public PostData(model: any, url: string, headers: any, isValidationForGenerateLink: boolean) {
    debugger;
    this.http.post(url, model, headers)
      .subscribe((response: any) => {
        // Clear messages
        this.LinkMsgGenerate = "";
        this.LinkMsgGenerate1 = "";

        if (response.isValidationForGenerateLink) {
          debugger;
          // Handle generate link logic
          if (!response.Valid && !response.isValid) {
            if (!isNullOrUndefined(response) && !response.isValidationForGenerateLink) {
              this.RestrictMsg = response.message;
              $("#myModalSingupErr").modal("show");
            }

            if (response.isValidationForGenerateLink) {
              this.generateLink = true;
              this.RestrictMsg1 = response.message;

              this.genLink1 = this.RestrictMsg1.split('.');
              this.genLink12 = this.genLink1[0];
              this.genLink13 = this.genLink1[1].split('to');
              this.genLink14 = this.genLink13[0];
              this.genLink15 = " to " + this.genLink13[1];

              localStorage.setItem('GuidID', response.guidId);
              $("#myModalSingupErr").modal("show");
            }
          }
        } else {
          // Handle normal post logic
          if (response.Valid || response.isValid) {
            if (!response.ActiveWithoutEmail) {
              let msgs = response.message.split('<br/>');
              let successMsg = msgs[0];
              let msg1 = msgs[1].split('.');
              let msg2 = msg1[0];
              let msg3 = msg1[1];

              localStorage.setItem('msg', successMsg);
              localStorage.setItem('msg1', msg2);
              localStorage.setItem('msg2', msg3);
              localStorage.setItem('emailForRegLink', model.Email);
              localStorage.setItem('compIDForRegLink', model.CompanyId);

              this.objRouter.navigate(['/account-success', { RegType: this.RegType, JobCode: this.JobCode }]);
              this.openSpinner();
              localStorage.setItem('ForShowAccountSuccess', "For Show Account-Success");
              localStorage.removeItem("bankName");
              localStorage.removeItem("CheckForAllBtn");
            } else {
              const queryParams = { g: response.guidId, id: this._config.environment.CompanyGroupID };
              this.objRouter.navigate(['/AccountActivation'], { queryParams });
            }
          }
        }

        this.HideSpinner();
      }, (error: any) => {
        alert(error.error.message);
      });
  }



  //PostData(model: any, url: string, options: any) {
  //  this.http.post(url, model, options)
  //    .subscribe(
  //    (response: any) => {
       
  //      console.log('POST success:', response);
       
  //    },
  //    (error: any) => {
       
  //      console.error('POST error:', error);
      
  //    }
  //    );
  //}
}



class FormDetails  {

  
}


