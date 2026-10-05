import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { Constants } from '../../Helper/Constant';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
import { DataService } from '@app/Shared/Services/data.services';

@Component({
  selector: 'app-account-activation-ff',
  templateUrl: './account-activation-ff.component.html',
  styleUrls: ['./account-activation-ff.component.css']
})
export class AccountActivationFFComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer, private Labels: Labels, private _config: AppConfigService, private activatedRoute: ActivatedRoute, private http: HttpClient, private objRouter: Router, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService, private dataService: DataService) {

    this.activatedRoute.queryParams.subscribe(params => {
      debugger;
      //if (!isNullOrUndefined(params.id)) {
      //    this.CompGroupIdKey = params['id'];               
      //    this._config.environment.CompanyGroupID = this.CompGroupIdKey
      //}
    });


  }


  RegType: string = "1";
  JobCode: "";
  CompGroupIdKey: string = "";
  key: any;
  isFF : any;
  AppId: any;
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

  ActivateAccountFF() {
    let RequestObject = {

      Guid: this.key,
      ApplicantId: this.AppId,
      CompanyId: this.CompanyIdService.CompanyId,
      CompanyGroupID: this._config.environment.CompanyGroupID,
      LinkExpiryTime: Constants.LinkExpiryTime,
    }

    this.openSpinner();
    let ActivateAccount_FF = this._config.environment.baseUrl + Constants.ActivateAccount_FF;
    this.http.post(ActivateAccount_FF, RequestObject, { headers: this.dataService.headers })
      //  this.http.post("https://jobportalapi.azurewebsites.net/ActivateAccount", RequestObject)
      .subscribe((response: any) => {
        this.AccountData = response;
        debugger;
        this.HideSpinner();
        localStorage.setItem('UserName', response.UserName);

        if (response.Message == "Your account has been successfully activated. Please complete your profile by clicking on the button below.") {

          //let msgs = response.Message.split('.');
          //let LinkMsg1 = msgs[0];
          //let LinkMsg2 = msgs[1];
          //localStorage.setItem('LinkMsg1', LinkMsg1);
          //localStorage.setItem('LinkMsg2', LinkMsg2);
          //this.LinkMsg1 = localStorage.getItem("LinkMsg1");
          //this.LinkMsg2 = localStorage.getItem("LinkMsg2");
          this.ViewProfile = true;
          this.Color();
          this.registered = false;
          this.wrong = false;
          this.regenerateLink = false;
          //this.imageSize = "BackgroundImageAccountActivation";
          //this.IsAssessmentScheduled = response.IsAssessmentScheduled;
          //this.AssessmentNames = response.AssessmentNames.split(',');
          //this.AssessmentNames1 = this.AssessmentNames[0];
          //this.AssessmentNames2 = this.AssessmentNames[1];
          //this.AssessmentNames3 = this.AssessmentNames[2];
          debugger;

          this.PersonalInfoFF();
        }

        if (response.Message == "You already registered at" && response.IsAccountCreated == false) {

          this.registered = false;
          this.Color();
          this.ViewProfile = true;
          this.wrong = false;
          this.regenerateLink = false;
          this.NameCompany1 = localStorage.getItem("CompanyName");
          this.NameCompany = this.NameCompany1;

          this.PersonalInfoFF();

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


          //let msgs = response.Message.split('.');
          //let LinkMsg1 = msgs[0];
          //let LinkMsg2 = msgs[1];

          //console.log('LinkMsg1 : ', LinkMsg1);
          //console.log('LinkMsg2 : ', LinkMsg2);
          //localStorage.setItem('LinkMsg1', LinkMsg1);
          //localStorage.setItem('LinkMsg2', LinkMsg2);
          //this.LinkMsg1 = localStorage.getItem("LinkMsg1");
          //this.LinkMsg2 = localStorage.getItem("LinkMsg2");

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


  // get Labels //

  lblDear: string = "Dear";
  lblAccountActivation: string = "Account Activation Field Force";
  lblViewProfile: string = "VIEW PROFILE";
  lbllogin: string = "LOGIN";
  lblGenerateNewLink: string = "GENERATE NEW LINK";


  getHomeLabels() {
    debugger;
    if (this.Labels.dashLabels == true) {
      this.lblDear = this.Labels.lblDear;
      this.lblAccountActivation = this.Labels.lblAccountActivation;
      this.lblViewProfile = this.Labels.lblViewProfile;
    }
  }




  link: any;
  PopupMsg: string = "";
  ShowPopup: boolean = true;
  Linkbutton: boolean = true;

  GenerateLink() {
    debugger;
    let RequestObject = {

      Guid: this.key,
      CompanyId: this.CompanyIdService.CompanyId,
      FromEmail: Constants.FromEmail,
      RedirectURL: Constants.RedirectPath,
    }

    this.openSpinner();
    let generateNewLink = this._config.environment.baseUrl + Constants.GenerateNewLink;
    this.http.post(generateNewLink, RequestObject, { headers: this.dataService.headers })
      //  this.http.post("https://jobportalapi.azurewebsites.net/GenerateNewLink", RequestObject)
      .subscribe((response: any) => {
        //  console.log('response : ', response);
        this.link = response;
        this.HideSpinner();
        debugger;
        if (!isNullOrUndefined(response) && response.Valid == true) {
          //   localStorage.setItem('UserName', response.UserName);
          //   console.log('Username : ', localStorage.getItem('UserName'));



          this.ShowPopup = true;
          this.Linkbutton = false;

          let msgs = response.Message.split('<br/>');
          let LinkMsg1 = msgs[0];
          let LinkMsg2 = msgs[1];

          localStorage.setItem('LinkMsg1', LinkMsg1);
          localStorage.setItem('LinkMsg2', LinkMsg2);
          this.LinkMsg1 = localStorage.getItem("LinkMsg1");
          this.LinkMsg2 = localStorage.getItem("LinkMsg2");
          this.Color();
          this.imageSize = "afterclickGenerateLink"

        }
      }, (error: any) => {
        console.log(error);
      });
  }



  login() {

    this.objRouter.navigate(['/login']);
  }


  personalInformation: any;

  StoreAccessToken(response: any) {
    if (!isNullOrUndefined(response) && !isNullOrUndefined(response.AccessToken) && response.AccessToken != '') {
      localStorage.setItem('AccessToken', response.AccessToken);
      localStorage.setItem('AccessTokenExpiresUtc', response.AccessTokenExpiresUtc || '');
      this.dataService.PassHeader();
    }
  }

  PersonalInfo() {
    debugger;
    let RequestObject = {

      Guid: this.key,
      CompanyId: this.CompanyIdService.CompanyId,
    }

    this.openSpinner();
    debugger;
    let personalInfo = this._config.environment.baseUrl + Constants.PersonalInfo;
    this.http.post(personalInfo, RequestObject, { headers: this.dataService.headers })
      //     this.http.post("https://jobportalapi.azurewebsites.net/PersonalInfo", RequestObject)

      .subscribe((response: any) => {
        this.personalInformation = response;
        this.HideSpinner();
        debugger;
        if (!isNullOrUndefined(response) && response.IsValid == true) {
          this.StoreAccessToken(response);
          localStorage.setItem('Email', response.Email);
          //console.log('Email : ', localStorage.getItem('Email'));
          localStorage.setItem('AppId', response.AppId);
          //console.log('AppId : ', localStorage.getItem('AppId'));
          debugger;

          var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + "false" + "," + response.AppId +
            "," + response.Email + "," + this.UserName + ",";
          localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
          localStorage.setItem("LastLoginId", this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID)

          // Get the 'isFF' parameter from the query string
          this.activatedRoute.queryParams.subscribe(params => {
            const isFFValue = params['isFF'];
            console.log(isFFValue);
            // Validate the 'isFF' value
            if (Number(isFFValue) !== 1 || isNaN(Number(isFFValue))) {
              console.error("Invalid link: isFF must be 1 and not any other number or invalid value.");
              alert("Invalid link. Please try again.");

              // Navigate to an error page if the isFF value is invalid
              this.objRouter.navigate(['/errorPage']);
            } else {
              // Proceed with navigation if 'isFF' is valid (i.e., isFF === 1)
              if (this.RegType && this.RegType === "2") {
                this.objRouter.navigate(["MyProfile"], {
                  queryParams: { showPersonalInfo: false, RegType: this.RegType, JobCode: this.JobCode }
                });
              } else {
                this.objRouter.navigate(["MyProfile"], {
                  queryParams: { isFF: isFFValue || 1 } // Default to isFF = 1 if not provided
                });
              }
            }




          });
        }
      }, (error: any) => {
        console.error(error);
        this.HideSpinner(); // Make sure to hide spinner on error as well
      });
  }


  PersonalInfoFF() {
    debugger;
    let RequestObject = {

      Guid: this.key,
      CompanyId: this.CompanyIdService.CompanyId,
    }

    this.openSpinner();
    debugger;
    let PersonalInfo_FF = this._config.environment.baseUrl + Constants.PersonalInfo_FF;
    this.http.post(PersonalInfo_FF, RequestObject, { headers: this.dataService.headers })
      //     this.http.post("https://jobportalapi.azurewebsites.net/PersonalInfo_FF", RequestObject)

      .subscribe((response: any) => {
        this.personalInformation = response;
        this.HideSpinner();
        debugger;
        if (!isNullOrUndefined(response) && response.IsValid == true) {
          this.StoreAccessToken(response);
          localStorage.setItem('Email', response.Email);
          //console.log('Email : ', localStorage.getItem('Email'));
          localStorage.setItem('AppId', response.AppId);
          //console.log('AppId : ', localStorage.getItem('AppId'));
          debugger;

          var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + "false" + "," + response.AppId +
            "," + response.Email + "," + this.UserName + ",";
          localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
          localStorage.setItem("LastLoginId", this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID)

          // Get the 'isFF' parameter from the query string
          this.activatedRoute.queryParams.subscribe(params => {
            const isFFValue = params['isFF'];
            console.log(isFFValue);
            // Validate the 'isFF' value
            if (Number(isFFValue) !== 1 || isNaN(Number(isFFValue))) {
              console.error("Invalid link: isFF must be 1 and not any other number or invalid value.");
              alert("Invalid link. Please try again.");

              // Navigate to an error page if the isFF value is invalid
              this.objRouter.navigate(['/errorPage']);
            } else {
              // Proceed with navigation if 'isFF' is valid (i.e., isFF === 1)
              if (this.RegType && this.RegType === "2") {
                this.objRouter.navigate(["MyProfile"], {
                  queryParams: { showPersonalInfo: false, RegType: this.RegType, JobCode: this.JobCode }
                });
              } else {
                this.objRouter.navigate(["MyProfile"], {
                  queryParams: { isFF: isFFValue || 1 } // Default to isFF = 1 if not provided
                });
              }
            }




          });
        }
      }, (error: any) => {
        console.error(error);
        this.HideSpinner(); // Make sure to hide spinner on error as well
      });
  }
      
  registerCompanyName: string = "";

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

      this.getJobPortalConfigurationFF()
      this.ActivateAccountFF();
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

  ChangeTheme: any;

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

  VisFinancialLiabilities: any;
  VisExisitingInsuranceDetail: any;
  VisSocialMediaConnections: any;
  VisDocumentAttachment: any;
  VisAcademicQualifications: any;
  VisCertifications: any;
  VisTrainings: any;
  VisExperience: any;
  VisCompetenciesSkills: any;
  VisProfessionalReferences: any;
  VisMaritalStatus: any;
  VisReligion: any;




  // New Added.
  // Basic info-2 fields
  VisIDCardExpiry: any;
  VisBloodGroup: any;
  VisDrivingLicenseNo: any;
  VisDrivingLicenseExpiry: any;
  VisIsSpouseEmployed: any;
  VisAnyotherSourceofIncome: any;
  VisAnyPhysicalDisability: any;

  // Contact Info fields
  VisResidentialStatus: any;

  VisBnkInfo: any;
  VisFathersInfo: any;
  VisEmergencyContactInfo: any;
  VisConveyanceInfo: any;
  VisNextOfKin: any;
  VisDependentsInfo: any;
  VisEducationalDoc: any;
  VisOtherDoc: any;

  // End 


  VisLegalHistory: any;
  VisPersonalAttributes: any;
  MndIntroductoryVideo: any;
  VisIntroductoryVideo: any;


  MndCurrentLastSalary: boolean = false;
  MndDateofBirth: boolean = false;
  MndEmailAddress: boolean = false;
  MndExistingInsuranceDetails: boolean = false;
  MndExpectedSalary: boolean = false;
  MndFinancialLiabilities: boolean = false;
  MndFirstName: boolean = false;
  MndGender: boolean = false;
  MndIDCardNo: boolean = false;
  MndLastName: boolean = false;
  MndLegalHistory: boolean = false;
  MndMaritalStatus: boolean = false;
  MndNationality: boolean = false;
  MndNativeLanguage: boolean = false;
  MndPassportNo: boolean = false;
  MndPersonalAttributes: boolean = false;
  MndPhoneNoCell: boolean = false;
  MndReligion: boolean = false;

  // New Added.

  MndBnkInfo: boolean = false;
  MndFathersInfo: boolean = false;
  MndEmergencyContctInfo: boolean = false;
  MndConveyanceInfo: boolean = false;

  MndEducationalDoc: boolean = false;
  MndOtherDoc: boolean = false;
  MndNextOfKinInfo: boolean = false;
  MndDepndsInfo: boolean = false;

  MndDoc: boolean = false;
  DocType: boolean = false;
  //MndNextOfKinInfo: boolean = false;
  //MndDepndsInfo: boolean = false;



  MndSocialMediaConnections: boolean = false;
  MndWhenCanYouJoin: boolean = false;
  MndermanentAddress: boolean = false;
  MndCV: boolean = false;


  // New Added.
  VisRelativeInAtco: any;
  //  End.

  MndAcademicQualifications: boolean = false
  MndCertifications: boolean = false
  MndCompetenciesSkills: boolean = false
  MndExperience: boolean = false
  MndProfessionalReferences: boolean = false
  MndTrainings: boolean = false

  // New Added.

  MndRelativeInAtco: boolean = false

     // End


  getJobPortalConfigurationFF() {

    debugger;
    let RequestObject = {

      CompanyId: this.CompanyIdService.CompanyId,
    };
    let GetJobPortalConfiguration_FF = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration_FF;
    this.http.post(GetJobPortalConfiguration_FF, RequestObject, { headers: this.dataService.headers })
      // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
      .subscribe((response: any) => {
        console.log("getJobPortalConfiguration ---", response)

        this.ClrThemeChng.ChangeTheme = response.ThemeColor;
        this.VisFinancialLiabilities = response.VisFinancialLiabilitiesFF;
        this.VisExisitingInsuranceDetail = response.VisExistingInsuranceDetailFF;
        this.VisSocialMediaConnections = response.VisSocialMediaConnectionsFF;
        this.VisDocumentAttachment = response.VisDocumentAttachmentFF;
        this.VisPersonalAttributes = response.VisPersonalAttributesFF;
        this.MndIntroductoryVideo = response.MndIntroductoryVideoFF;
        this.VisMaritalStatus = response.VisMaritalStatusFF;
        this.VisReligion = response.VisReligionFF;

        // New Added

        // For Basic Info 2 Fields
        this.VisIDCardExpiry = response.VisIDCardExpiryFF;
        this.VisBloodGroup = response.VisBloodGroupFF;
        this.VisDrivingLicenseNo = response.VisDrivingLicenseNoFF;
        this.VisDrivingLicenseExpiry = response.VisDrivingLicenseExpiryFF;
        this.VisIsSpouseEmployed = response.VisIsSpouseEmployedFF;
        this.VisAnyotherSourceofIncome = response.VisAnyotherSourceofIncomeFF;
        this.VisAnyPhysicalDisability = response.VisIDCardExpiryFF;

        // Contact Info fields
        this.VisResidentialStatus = response.VisResidentialStatusFF;

        this.VisBnkInfo = response.VisBnkInfoFF;
        this.VisFathersInfo = response.VisFathersInfoFF;
        this.VisEmergencyContactInfo = response.VisEmergencyContactInfoFF;
        this.VisConveyanceInfo = response.VisConveyanceInfoFF;
        this.VisNextOfKin = response.VisNextOfKinFF;
        this.VisDependentsInfo = response.VisDependentsInfoFF;
        this.VisEducationalDoc = response.VisEducationalDocFF;
        this.VisOtherDoc = response.VisOtherDocFF;

        this.VisLegalHistory = response.VisLegalHistoryFF;
        this.VisIntroductoryVideo = response.VisIntroductoryVideoFF;

        this.MndCurrentLastSalary = response.MndCurrentLastSalaryFF;
        this.MndCV = response.MndCVFF;
        this.MndDateofBirth = response.MndDateofBirthFF;
        this.MndEmailAddress = response.MndEmailAddressFF;
        this.MndExistingInsuranceDetails = response.MndExistingInsuranceDetailsFF;
        this.MndExpectedSalary = response.MndExpectedSalaryFF;
        this.MndFinancialLiabilities = response.MndFinancialLiabilitiesFF;
        this.MndFirstName = response.MndFirstNameFF;
        this.MndGender = response.MndGenderFF;
        this.MndIDCardNo = response.MndIDCardNoFF;
        this.MndLastName = response.MndLastNameFF;
        this.MndLegalHistory = response.MndLegalHistoryFF;
        this.MndMaritalStatus = response.MndMaritalStatusFF;
        this.MndNationality = response.MndNationalityFF;
        this.MndNativeLanguage = response.MndNativeLanguageFF;
        this.MndPassportNo = response.MndPassportNoFF;
        this.MndPersonalAttributes = response.MndPersonalAttributesFF;
        this.MndPhoneNoCell = response.MndPhoneNoCellFF;
        this.MndReligion = response.MndReligionFF;

        // New Added

        this.MndBnkInfo = response.MndBnkInfoFF;
        this.MndFathersInfo = response.MndFathersInfoFF;
        this.MndEmergencyContctInfo = response.MndEmergencyContctInfoFF;
        this.MndConveyanceInfo = response.MndConveyanceInfoFF;

        this.MndEducationalDoc = response.MndEducationalDocFF;
        this.MndOtherDoc = response.MndOtherDocFF;
        this.MndNextOfKinInfo = response.MndNextOfKinInfoFF;
        this.MndDepndsInfo = response.MndDepndsInfoFF;

        // End

        this.MndSocialMediaConnections = response.MndSocialMediaConnectionsFF;
        this.MndWhenCanYouJoin = response.MndWhenCanYouJoinFF;
        this.MndermanentAddress = response.MndPermanentAddressFF;

        this.ClrThemeChng.ChangeTheme = response.ThemeColorFF;
        this.VisAcademicQualifications = response.VisAcademicQualificationsFF;

        // New Added.
        this.VisRelativeInAtco = response.VisRelativeInAtcoFF;
        // End FF

        this.VisCertifications = response.VisCertificationsFF;
        this.VisTrainings = response.VisTrainingsFF;
        this.VisExperience = response.VisExperienceFF;
        this.VisCompetenciesSkills = response.VisCompetenciesSkillsFF;
        this.VisProfessionalReferences = response.VisProfessionalReferencesFF;
        console.log(response.VisProfessionalReferencesFF);
        this.MndAcademicQualifications = response.MndAcademicQualificationsFF;
        this.MndCertifications = response.MndCertificationsFF;
        this.MndCompetenciesSkills = response.MndCompetenciesSkillsFF;
        this.MndExperience = response.MndExperienceFF;
        this.MndProfessionalReferences = response.MndProfessionalReferencesFF;
        this.MndTrainings = response.MndTrainingsFF;

        // New Added.
        this.MndRelativeInAtco = response.MndRelativeInAtcoFF;
        // End

        // New Added.

        // For Basic Info 2 Fields  
        this.VisIDCardExpiry = response.VisIDCardExpiryFF;
        this.VisBloodGroup = response.VisBloodGroupFF;
        this.VisDrivingLicenseNo = response.VisDrivingLicenseNoFF;
        this.VisDrivingLicenseExpiry = response.VisDrivingLicenseExpiryFF;
        this.VisIsSpouseEmployed = response.VisIsSpouseEmployedFF;
        this.VisAnyotherSourceofIncome = response.VisAnyotherSourceofIncomeFF;
        this.VisAnyPhysicalDisability = response.VisIDCardExpiryFF; // Typo: Should it be VisAnyPhysicalDisability?

        // Contact Info fields
        this.VisResidentialStatus = response.VisResidentialStatusFF;
        this.VisBnkInfo = response.VisBnkInfoFF;
        this.VisFathersInfo = response.VisFathersInfoFF;
        this.VisEmergencyContactInfo = response.VisEmergencyContactInfoFF;
        this.VisConveyanceInfo = response.VisConveyanceInfoFF;
        this.VisNextOfKin = response.VisNextOfKinFF;
        this.VisDependentsInfo = response.VisDependentsInfoFF;
        this.VisEducationalDoc = response.VisEducationalDocFF;
        this.VisOtherDoc = response.VisOtherDocFF;

        // End 

        this.VisLegalHistory = response.VisLegalHistoryFF;
        this.VisIntroductoryVideo = response.VisIntroductoryVideoFF;

        this.MndCurrentLastSalary = response.MndCurrentLastSalaryFF;
        this.MndCV = response.MndCVFF;
        this.MndDateofBirth = response.MndDateofBirthFF;
        this.MndEmailAddress = response.MndEmailAddressFF;
        this.MndExistingInsuranceDetails = response.MndExistingInsuranceDetailsFF;
        this.MndExpectedSalary = response.MndExpectedSalaryFF;
        this.MndFinancialLiabilities = response.MndFinancialLiabilitiesFF;
        this.MndFirstName = response.MndFirstNameFF;
        this.MndGender = response.MndGenderFF;
        this.MndIDCardNo = response.MndIDCardNoFF;
        this.MndLastName = response.MndLastNameFF;
        this.MndLegalHistory = response.MndLegalHistoryFF;
        this.MndMaritalStatus = response.MndMaritalStatusFF;
        this.MndNationality = response.MndNationalityFF;
        this.MndNativeLanguage = response.MndNativeLanguageFF;
        this.MndPassportNo = response.MndPassportNoFF;
        this.MndPersonalAttributes = response.MndPersonalAttributesFF;
        this.MndPhoneNoCell = response.MndPhoneNoCellFF;
        this.MndReligion = response.MndReligionFF;

        // New Added.
        this.MndBnkInfo = response.MndBnkInfoFF;
        console.log(this.MndBnkInfo);
        this.MndFathersInfo = response.MndFathersInfoFF;
        this.MndEmergencyContctInfo = response.MndEmergencyContctInfoFF;
        this.MndConveyanceInfo = response.MndConveyanceInfoFF;
        this.MndEducationalDoc = response.MndEducationalDocFF;
        this.MndOtherDoc = response.MndOtherDocFF;
        this.MndNextOfKinInfo = response.MndNextOfKinInfoFF;
        this.MndDepndsInfo = response.MndDepndsInfoFF;

        //  End

        this.MndSocialMediaConnections = response.MndSocialMediaConnectionsFF;
        this.MndWhenCanYouJoin = response.MndWhenCanYouJoinFF;
        this.MndermanentAddress = response.MndermanentAddressFF;


        this.Color();
        this.HideSpinner();


        this.Color();
        // this.HideSpinner();

      })
  }



  openSpinner() {
    debugger;

    /** spinner starts on init */
    this.spinner.show();
  }


  HideSpinner() {
    debugger;

    /** spinner starts on init */
    this.spinner.hide();
  }

  forChanges: any;
  breakcode: any;
  code: any;
  // this.BackgroundImage = "../../../assets/images/" + this.code + "/Asset8.PNG";

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


  ngOnInit() {
    debugger;
    this.activatedRoute.queryParams.subscribe(params => {
      debugger;
      this.key = params['g'];
      this.isFF = params['isFf'];
      this.AppId = params['AppId'] || 0;  // If AppId is undefined, set it to empty string

      this.getCompanyParameter();
      //if (params['rt']) {
      //  this.RegType = params['rt'];
      //}

      //if (params['jc']) {
      //  this.JobCode = params['jc'];
      //}

      //console.log(this.RegType);
      //console.log(this.JobCode);

      //alert(this.Activationype);
      

    });


    //localStorage.getItem('UserName');

  }

}
