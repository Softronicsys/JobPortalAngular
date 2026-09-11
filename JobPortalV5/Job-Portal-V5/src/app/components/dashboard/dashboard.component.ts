import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Action } from '../../Helper/Enums';
import { Constants } from '../../Helper/Constant';
declare var $: any;
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UpdateProfileService } from '../../Service/UpdateProfile.service';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { DataService } from '../../Shared/Services/data.services';
import { AppConfigService } from '@app/Service/app-config.service';
import { Subject, Observable } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AssessmentService } from '@app/Service/UpdateProfile.service';
import { ImageCompressService } from '@app/Service/image-compress.service';
import { SharedDataService } from '@app/Shared/Services/shared-data.service';




//import * as MediaElementPlayer from 'mediaelement';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //onFileSelected(event) {
  //    console.log(event);
  //}

  @ViewChild('myname') input;
  Multilingual = Constants.Multilingual;

  @ViewChild('myInput')
  myInputVariableFile: any;

  RegType: string = "1";
  JobCode: "";
  showPopup: boolean = false;

  activeAssessment: boolean = false;
  activePersonalInfo: boolean = false;
  activeProfessionalInfo: boolean = false;

  isMyJobActive: boolean = true;
  isPersonalInfoActive: boolean = false;
  isProfessionalInfoActive: boolean = false;
  isActiveAssessment: boolean = false;
  VisIntroductoryVideo: boolean = false;

  isPersonalInfoNonCorporateActive: boolean = false;
  isProfessionalInfoNonCorporateActive: boolean = false;

  activeApplicantPackage: boolean = false;
  isApplicantPackageActive: boolean = false;
  showApplicantPackageTab: boolean = false;


  CurrentPassword: string = "";
  NewPassword: string = "";
  ConfirmPassword: string = "";

  isMandatoryfields: boolean = false;

  userName: string = "";
  email: string = "";
  Address: string = "";
  TelMobile: string = "";
  DateOB: string = "";
  Age: string = "";
  Email: string = "";

  isPackageEnable: boolean = false;

  OldPassword: string = "";


  // for backgrouud color // 

  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  BackgroundImage: string = "";
  BorderColor: string = "";
  DefaultBorderColor: string = "";
  applicantId: string = "";

  url: string = '';
  blob;
  uniqueImgName;
  ApplyJobMsg: string = "";
  hide: boolean = false;
  WrongUrl: boolean = true;
  IsValid: string = "";
  message: string = ""
  res: any;
  check: string = "False"

  constructor(private renderer: Renderer, public sanitizer: DomSanitizer, private Labels: Labels, private _config: AppConfigService,
    public assessService: AssessmentService, private http: HttpClient, public activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService, private toastr: ToastrService, public updateProfService: UpdateProfileService,
    public CompanyIdService: GetCompanyParameter, private imageCompress: ImageCompressService,
    public ClrThemeChng: ThemeColorService, public _dataService: DataService, private sharedDataService: SharedDataService,
    public dataService: DataService
  ) {


    const routePopupParam = activatedRoute.snapshot.paramMap.get('showPopup');
    const queryPopupParam = activatedRoute.snapshot.queryParamMap.get('showPopup');
    const storedPopupFlag = sessionStorage.getItem('AutoOpenOfferLetterPopup');
    this.showPopup = routePopupParam === 'true' || routePopupParam === '1'
      || queryPopupParam === 'true' || queryPopupParam === '1'
      || storedPopupFlag === '1';

    if (!isNullOrUndefined(localStorage.getItem("IsValid")))
      this.IsValid = localStorage.getItem('IsValid');

    // if (localStorage.length > 0) {

    //   let groupid = localStorage.getItem("LastLoginId").split(",")[1];
    //   var ArrayLoginId = localStorage.getItem(groupid).split(',')[1];
    //   var LastLoginId = localStorage.getItem("LastLoginId").split(",")[0];
    //   var lenghtOfCheck = localStorage.getItem(groupid).split(',')[2].length;

    //   if (LastLoginId == ArrayLoginId) {
    //     var lenghtOfGroupId = localStorage.getItem(groupid).split(',')[0].length;
    //     this.check = localStorage.getItem(groupid).split(',')[2].slice(0, lenghtOfCheck);
    //     this._config.environment.CompanyGroupID = localStorage.getItem(groupid).split(',')[0].slice(1, lenghtOfGroupId);
    //     if (this.check == "true") {
    //       this.WrongUrl = false;
    //     }
    //     return;
    //   }


    // }
    //else if (localStorage.length < 0) {
    //     $("#myModalWrongURL").modal("toggle");
    //     this.WrongUrl = false;
    // }

    if (this.showPopup == true) {
      if (this.IsValid == "true") {

        this.isValidTrue();

      }
      if (this.IsValid == "false") {

        this.isValidfalse();
      }
    }
  }

  ApplicantApplyJob: string = "";
  pannelTabs: boolean = false;


  subscription: any;


  // New added

  isFF: boolean = false;


  ngOnInit() {
      debugger;

      const routeParams = this.activatedRoute.snapshot.params;
      const queryParams = this.activatedRoute.snapshot.queryParams;

      const isCTC = this.hasCtcQueryParam(queryParams);

      sessionStorage.removeItem('OpenApplicantPackageTab');
      this.setApplicantPackageVisibility(isCTC);

      this.isFF = queryParams['isFF'] == '1' || queryParams['isff'] == '1';

      console.log('Dashboard routeParams:', routeParams);
      console.log('Dashboard queryParams:', queryParams);
      console.log('Dashboard isCTC:', isCTC);
      console.log('Dashboard isFF:', this.isFF);

      this.updateTabWidth();

      if (isCTC) {
          this.openApplicantPackageTab();
      }
      else if (this.isFF) {
          this.selectPersonalInfoTab();
          this.activePersonalInfo = true;
      }
      else {
          this.activeAssessment = false;
          this.selectisMyJobActive();
      }
  
  //ngOnInit() {
  //  debugger;

  //  const routeParams = this.activatedRoute.snapshot.params;
  //  const queryParams = this.activatedRoute.snapshot.queryParams;

  //  const isCTC =
  //      routeParams['isctc'] == '1' ||
  //      routeParams['isctc'] == 1 ||
  //      queryParams['isctc'] == '1' ||
  //      queryParams['isctc'] == 1;

  //  // FF only when actual isFF exists
  //  this.isFF = queryParams['isFF'] == '1' || queryParams['isff'] == '1';

  //  console.log('Dashboard routeParams:', routeParams);
  //  console.log('Dashboard queryParams:', queryParams);
  //  console.log('Dashboard isCTC:', isCTC);
  //  console.log('Dashboard isFF:', this.isFF);

  //  this.updateTabWidth();

  //  if (isCTC) {
  //      this.openApplicantPackageTab();
  //  }
  //  else if (this.isFF) {
  //      this.selectPersonalInfoTab();
  //      this.activePersonalInfo = true;
  //  }
  //  else {
  //      this.activeAssessment = false;
  //      this.selectisMyJobActive();
  //  }

    //let hasQueryString: boolean = false;

    //// Check if there are query parameters
    //this.activatedRoute.queryParams.subscribe(params => {

    // if (params['isctc'] == '1' || params['isctc'] == 1) {
    //        setTimeout(() => {
    //            this.onTab_Click('isApplicantPackageActive');
    //            $('#ApplicantPackage a').tab('show');
    //        }, 500);
    //  }

    //  const currentUrl = this.activatedRoute.url;
    //  //console.log(currentUrl);
    //  hasQueryString = Object.keys(params).length > 0;
    //  //console.log('Has query string:', hasQueryString);
    //});

    //this.isFF = hasQueryString;

    ////console.log(this.isFF);
    //this.updateTabWidth();

    //// Your existing conditional logic based on isFF
    //if (this.isFF) {
    //  // If there are query parameters, do this
    //  this.selectPersonalInfoTab();
    //  this.activePersonalInfo = true;
    //} else {
    //  // If there are no query parameters, do this
    //  this.activeAssessment = false;
    //  this.selectisMyJobActive();
    //}


    //if (someCondition) {
    //  this.isPackageEnable = true; // Show pakage tab
    //}

    // New added End

    this.ApplicantApplyJob = localStorage.getItem('ApplicantApplyJob');

    //     this.isCheckMPRCode();


    this.subscription = this.sharedDataService.hideButton$.subscribe(() => {

      $('#SaveButton').hide();
      $('#UploadButton').hide();
      $('#DeleteButton').hide();

    });

    this.applicantId = localStorage.getItem('AppId');

    var lastLoginId = localStorage.getItem('LastLoginId') || "";
    this.CompanyIdService.CompanyId = lastLoginId.split(",")[0];


    this.getCompanyParameter();
    this.CompanyIdService.IsLinkedInLogin = localStorage.getItem('IsLinkedInLogin');

    //AutoRegWork
    let regtype = this.activatedRoute.snapshot.params.RegType;
    let jobcode = this.activatedRoute.snapshot.params.JobCode;
    if (!isNullOrUndefined(regtype) && !isNullOrUndefined(jobcode)) {
      this.RegType = regtype;
      this.JobCode = jobcode;
    }

    let showPersonalInfoTab: string = this.activatedRoute.snapshot.params.showPersonalInfo;

    if (this.RegType && this.RegType == "2") {
      //No need to do anyting as default tab is already MyJobs
      //alert(this.JobCode + ' would be auto applied');
    }
    else {
      if (!isNullOrUndefined(showPersonalInfoTab) && showPersonalInfoTab.toLowerCase() == "true") {

        this.activePersonalInfo = true;
        this.isMyJobActive = false;
        this.isPersonalInfoActive = true;
      }
    }

    let showAssessmentTab: string = this.activatedRoute.snapshot.params.showAssessment;
    if (!isNullOrUndefined(showAssessmentTab) && showAssessmentTab.toLowerCase() == "true") {

      this.activeAssessment = true;
    }
    this.userName = localStorage.getItem('UserName');
    this.email = localStorage.getItem('Email');

      this.getApplicantData();
  }

  private hasCtcQueryParam(queryParams: any): boolean {
      const routeValue = queryParams['isCTC'] || queryParams['isctc'];
      let urlValue: string = null;

      if (typeof window !== 'undefined' && window.location && window.location.search) {
          const urlParams = new URLSearchParams(window.location.search);
          urlValue = urlParams.get('isCTC') || urlParams.get('isctc');
      }

      return routeValue == '1' || routeValue == 1 || urlValue == '1';
  }

  private setApplicantPackageVisibility(isVisible: boolean) {
      this.showApplicantPackageTab = isVisible === true;

      if (!this.showApplicantPackageTab) {
          this.activeApplicantPackage = false;
          this.isApplicantPackageActive = false;
          this.isPackageEnable = false;

          setTimeout(() => {
              $('#ApplicantPackage').hide().removeClass('active');
              $('#applicantPackage').hide().removeClass('active');
              $('a[href="#applicantPackage"]').closest('li').hide().removeClass('active');
          }, 0);
      }
  }

  selectPersonalInfoTab() {
    this.isPersonalInfoActive = true;



  }

  selectisMyJobActive() {
    this.isMyJobActive = true;


  }

  openApplicantPackageTab() {
      debugger;

      this.isPackageEnable = true;

      this.activeAssessment = false;
      this.activePersonalInfo = false;
      this.activeProfessionalInfo = false;
      this.activeApplicantPackage = true;

      this.isMyJobActive = false;
      this.isPersonalInfoActive = false;
      this.isProfessionalInfoActive = false;
      this.isActiveAssessment = false;
      this.isPersonalInfoNonCorporateActive = false;
      this.isProfessionalInfoNonCorporateActive = false;
      this.isApplicantPackageActive = true;

      setTimeout(() => {
          $('#ApplicantPackage a').tab('show');
      }, 500);
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  isValidTrue() {

    this.message = localStorage.getItem('ApplyJobMsg');
    //console.log("this.message", this.message)
    $("#JobApplicantMsgTrue").modal('show');

  }

  isValidfalse() {

    this.message = localStorage.getItem('ApplyJobMsg');
    //console.log("this.message1", this.message)
    $("#JobApplicantMsg1False").modal('show');

  }

  myFunction() {

    var element = document.getElementById("myDIV");
    element.classList.add("mystyle");
  }

  myFunction1() {

    var element = document.getElementById("myDIV");
    element.classList.remove("mystyle");
  }



  // for Labels //
  lblIntroductoryVideoAttachment: string = "Introductory Video/Elevator Pitch";
  lblApplicantPicture: string = "Applicant Picture";
  Upload: string = "Upload";
  Assessments: string = "Assessments";
  lblPersonalInfo: string = "Personal Info";
  lblProfessionalInfo: string = "Professional Info";
  lblMyJobs: string = "My Jobs";
  Save: string = "Save";
  lblMobileNumber: string = "Mobile Number";
  EmailAddress: string = "Email Address";
  lblAddress: string = "Address";
  DateofBirthdashboard: string = "Date of Birth";
  lblAge: string = "Age";
  lblProfileCompletion: string = "Profile Completion";
  lblChangePassword: string = "Change Password"
  lblCurrentpassword: string = "Current Password"
  lblNewPassword: string = "New Password";
  lblConfirmPassword: string = "Confirm Password";
  lblChange: string = "Change";
  lblClose: string = "Close";
  lblNewEmail: string = "New Email";
  lblPassword: string = "Password";
  lblSettings: string = "Settings";
  lblMiximumSize: string = "Miximum Size";
  IntroductoryVideo: string = "Introductory Video / Elevator Pitch"
  lblLogout: string = "Sign Out";
  A: any;
  B: any;
  C: any;
  D: any;
  E: any;
  F: any;
  G: any;

  getHomeLabels() {

    if (this.Labels.dashLabels == true) {

      if (this.Labels.lblApplicantPicture != "" && !isNullOrUndefined(this.Labels.lblApplicantPicture))
        this.lblApplicantPicture = this.Labels.lblApplicantPicture;

      if (this.Labels.Upload != "" && !isNullOrUndefined(this.Labels.Upload))
        this.Upload = this.Labels.Upload;

      if (this.Labels.Assessments != "" && !isNullOrUndefined(this.Labels.Assessments))
        this.Assessments = this.Labels.Assessments;

      if (this.Labels.lblPersonalInfo != "" && !isNullOrUndefined(this.Labels.lblPersonalInfo))
        this.lblPersonalInfo = this.Labels.lblPersonalInfo;

      if (this.Labels.lblMyJobs != "" && !isNullOrUndefined(this.Labels.lblMyJobs))
        this.lblMyJobs = this.Labels.lblMyJobs;

      if (this.Labels.lblProfessionalInfo != "" && !isNullOrUndefined(this.Labels.lblProfessionalInfo))
        this.lblProfessionalInfo = this.Labels.lblProfessionalInfo;

      if (this.Labels.Save != "" && !isNullOrUndefined(this.Labels.Save))
        this.Save = this.Labels.Save;

      if (this.Labels.lblLogout != "" && !isNullOrUndefined(this.Labels.lblLogout))
        this.lblLogout = this.Labels.lblLogout;


      if (this.Labels.lblMobileNumber != "" && !isNullOrUndefined(this.Labels.lblMobileNumber))
        this.lblMobileNumber = this.Labels.lblMobileNumber;

      if (this.Labels.EmailAddress != "" && !isNullOrUndefined(this.Labels.EmailAddress))
        this.EmailAddress = this.Labels.EmailAddress;

      if (this.Labels.Address != "" && !isNullOrUndefined(this.Labels.Address))
        this.lblAddress = this.Labels.Address;

      if (this.Labels.DateofBirthdashboard != "" && !isNullOrUndefined(this.Labels.DateofBirthdashboard))
        this.DateofBirthdashboard = this.Labels.DateofBirthdashboard;

      if (this.Labels.Age != "" && !isNullOrUndefined(this.Labels.Age))
        this.lblAge = this.Labels.Age;

      if (this.Labels.lblProfileCompletion != "" && !isNullOrUndefined(this.Labels.lblProfileCompletion))
        this.lblProfileCompletion = this.Labels.lblProfileCompletion;

      if (this.Labels.lblChangePassword != "" && !isNullOrUndefined(this.Labels.lblChangePassword))
        this.lblChangePassword = this.Labels.lblChangePassword;

      if (this.Labels.lblCurrentPassword != "" && !isNullOrUndefined(this.Labels.lblCurrentPassword))
        this.lblCurrentpassword = this.Labels.lblCurrentPassword;

      if (this.Labels.lblNewPassword != "" && !isNullOrUndefined(this.Labels.lblNewPassword))
        this.lblNewPassword = this.Labels.lblNewPassword;

      if (this.Labels.lblConfirmPassword != "" && !isNullOrUndefined(this.Labels.lblConfirmPassword))
        this.lblConfirmPassword = this.Labels.lblConfirmPassword;

      if (this.Labels.lblChange != "" && !isNullOrUndefined(this.Labels.lblChange))
        this.lblChange = this.Labels.lblChange;

      if (this.Labels.Close != "" && !isNullOrUndefined(this.Labels.Close))
        this.lblClose = this.Labels.Close;

      if (this.Labels.lblNewEmail != "" && !isNullOrUndefined(this.Labels.lblNewEmail))
        this.lblNewEmail = this.Labels.lblNewEmail;

      if (this.Labels.LblPassword != "" && !isNullOrUndefined(this.Labels.LblPassword))
        this.lblPassword = this.Labels.LblPassword;

      if (this.Labels.lblSettings != "" && !isNullOrUndefined(this.Labels.lblSettings))
        this.lblSettings = this.Labels.lblSettings;

      if (this.Labels.lblMiximumSize != "" && !isNullOrUndefined(this.Labels.lblMiximumSize))
        this.lblMiximumSize = this.Labels.lblMiximumSize;

      if (this.Labels.lblIntroductoryVideoAttachment != "" && !isNullOrUndefined(this.Labels.lblIntroductoryVideoAttachment))
        this.lblIntroductoryVideoAttachment = this.Labels.lblIntroductoryVideoAttachment;

      if (this.Labels.IntroductoryVideo != "" && !isNullOrUndefined(this.Labels.IntroductoryVideo))
        this.IntroductoryVideo = this.Labels.IntroductoryVideo;

      if (this.IntroductoryVideo != "" && !isNullOrUndefined(this.IntroductoryVideo))
        this.A = this.IntroductoryVideo.split(' ');

      if (this.A['0'] != "" && !isNullOrUndefined(this.A['0']))
        this.B = this.A['0'];

      if (this.A['1'] != "" && !isNullOrUndefined(this.A['1']))
        this.C = this.A['1'];

      if (this.A['2'] != "" && !isNullOrUndefined(this.A['2']))
        this.D = this.A['2'];

      if (this.A['3'] != "" && !isNullOrUndefined(this.A['3']))
        this.E = this.A['3'];

      if (this.A['4'] != "" && !isNullOrUndefined(this.A['4']))
        this.F = this.A['4'];
    }
  }

  openSpinner() {


    /** spinner starts on init */
    this.spinner.show();
  }






  HideSpinner() {


    /** spinner starts on init */
    this.spinner.hide();
  }


  emptyIDandCode() {
    let logoutUrl = this._config.environment.baseUrl + 'Auth/Logout';
    this.dataService.post(logoutUrl, {}).subscribe(() => { }, () => { });

    localStorage.removeItem("AppId");
    localStorage.removeItem("Email");
    localStorage.removeItem("UserName");
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("AccessTokenExpiresUtc");
    localStorage.removeItem('StaySignedIn');
    localStorage.removeItem("DateOfBirthForProf");
    this.dataService.PassHeader();

    var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + "false" + ",,,,";
    localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
  }

  refreshImg() {
    this.url = '';
    this.updateImg = false;
    this.isCroppingImg = false;
    this.imageValidationForExtension = false;
  }

  refreshJobCode() {
    localStorage.removeItem("ApplyJobMsg");
    this.hide == false;
    this.ApplyJobMsg = "";
    $("#JobApplicant").modal('hide');
    localStorage.removeItem("ApplicantApplyJob");
  }

  ApplicantApplyJob1: boolean = false;

  isCheckMPRCode() {

    if (this.ApplicantApplyJob == "true") {
      this.ApplicantApplyJob1 = true;
      this.ApplyJobMsg = localStorage.getItem('ApplyJobMsg');
      $("#myModal").modal('toggle');
    }
    if (this.ApplicantApplyJob == "false") {
      this.ApplicantApplyJob1 = false;
      this.ApplyJobMsg = localStorage.getItem('ApplyJobMsg');
      $("#myModal").modal('toggle');
    }
    this.popuphide();
  }

  popuphide() {

    setTimeout(() => {

      $("#myModal").modal('hide');
      $("#videoPopup4").modal('hide');

    }, 4400)
  }

  isSideBar: boolean = true;
  FirstName: string = "";
  MiddleName: string = "";
  LastName: string = "";
  tooltipName: string = "";
  isname: boolean = false;
  Username;

  onApplicantInfo(eventData: any) {

    this.isSideBar = false;
    this.isname = true;
    this.Username = eventData.Username;
    //    console.log("Username --------------", this.Username)
    this.Address = eventData.address;
    this.TelMobile = eventData.telMobile;
    this.DateOB = eventData.dateOB;
    this.Age = eventData.age;
    this.Email = eventData.Email;
    this.FirstName = eventData.firstName,
      this.MiddleName = eventData.middleName,
      this.LastName = eventData.lastName
    this.tooltipName = this.FirstName + "&nbsp;" + this.MiddleName + "&nbsp;" + this.LastName;
    this.updateProfService.ProfilePercentage = eventData.strengthBar;
    //this.strength();
    //if (this.updateProfService.ProfilePercentage !== '0%') {
    //    this.isProfileImage = false;
    //    //this.isProfileCompletion = true;
    //} else {
    //    this.isProfileImage = true;
    //    //this.isProfileCompletion = false;
    //}
    //this.readFromBlob1();
  }

  getCounter(eventData: any) {

    this.OPenVacanciesCount = eventData.OPenVacanciesCount;
    this.isbadge = eventData.isbadge;
  }

  getCounter1(eventData: any) {

    this.updateProfService.ProfilePercentage = eventData.strengthBar;
    //this.strength();
    //if (this.updateProfService.ProfilePercentage !== '0%') {
    //    this.isProfileImage = false;
    //    //.isProfileCompletion = true;
    //} else {
    //    this.isProfileImage = true;
    //    //this.isProfileCompletion = false;
    //}
  }



  onTab_Click(tab: string) {

    debugger;
    this.isMyJobActive = false;
    this.isPersonalInfoActive = false;
    this.isProfessionalInfoActive = false;
    this.isActiveAssessment = false;
    this.isPersonalInfoNonCorporateActive = false;
    this.isProfessionalInfoNonCorporateActive = false;
    this.isApplicantPackageActive = false;

    this.activeAssessment = false;
    this.activePersonalInfo = false;
    this.activeProfessionalInfo = false;
    this.activeApplicantPackage = false;


    this[tab] = true;

    if (tab == "isPersonalInfoActive") {
        this.activePersonalInfo = true;
    }

    if (tab == "isProfessionalInfoActive") {
        this.activeProfessionalInfo = true;
    }

    if (tab == "isActiveAssessment") {
        this.activeAssessment = true;
    }

    if (tab == "isApplicantPackageActive") {
        this.activeApplicantPackage = true;
    }

    if (tab == "isMyJobActive") {
      $("#PersonalInfo").removeClass("active");
      $("#ProfessionalInfo").removeClass("active");
      $("#PersInfoNonCop").removeClass("active");
      $("#ProfInfoNonCop").removeClass("active");
      $("#ApplicantPackage").removeClass("active");  //new 


    }

    if (tab == "isPersonalInfoActive") {
      $("#MyJobs").removeClass("active");
      $("#ProfessionalInfo").removeClass("active");
      $("#PersInfoNonCop").removeClass("active");
      $("#ProfInfoNonCop").removeClass("active");

      $("#ApplicantPackage").removeClass("active"); //new


    }

    if (tab == "isProfessionalInfoActive") {
      $("#PersonalInfo").removeClass("active");
      $("#MyJobs").removeClass("active");
      $("#PersInfoNonCop").removeClass("active");
      $("#ProfInfoNonCop").removeClass("active");

      $("#ApplicantPackage").removeClass("active");  // NEW


    }

    if (tab == "isApplicantPackageActive") {  // NEW TAB HANDLER
      $("#PersonalInfo").removeClass("active");
      $("#MyJobs").removeClass("active");
      $("#professionalInfo").removeClass("active");
      $("#PersInfoNonCop").removeClass("active");
      $("#ProfInfoNonCop").removeClass("active");


    }

    if (tab == "isPersonalInfoNonCorporateActive") {
      $("#PersonalInfo").removeClass("active");
      $("#MyJobs").removeClass("active");
      $("#professionalInfo").removeClass("active");
      $("#ProfInfoNonCop").removeClass("active");

      $("#ApplicantPackage").removeClass("active");  // NEW


    }

    if (tab == "isProfessionalInfoNonCorporateActive") {
      $("#PersonalInfo").removeClass("active");
      $("#MyJobs").removeClass("active");
      $("#professionalInfo").removeClass("active");
      $("#PersInfoNonCop").removeClass("active");

      $("#ApplicantPackage").removeClass("active");  // NEW


    }



  }



  // Change Password //

  ChangepasswordErrorMsg: string = "";

  btnPostChangePassword_Click() {
    this.isMandatoryfields = false;
    this.ChangepasswordErrorMsg = "";

    if (this.CurrentPassword == "" || this.NewPassword == "" || this.ConfirmPassword == "") {
      this.isMandatoryfields = true;
    }
    else {
      let RequestObject = {

        Email: localStorage.getItem("Email"),
        CurrentPassword: this.CurrentPassword,
        NewPassword: this.NewPassword,
        ConfirmPassword: this.ConfirmPassword,
        CompanyId: this.CompanyIdService.CompanyId,

      }

      this.openSpinner();
      let changePasswordSave = this._config.environment.baseUrl + Constants.ChangePasswordSave;
      this.http.post(changePasswordSave, RequestObject, { headers: this.dataService.headers })
        // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/ChangePasswordSave")
        .subscribe((response: any) => {

          if (response.Valid == false) {
            this.ChangepasswordErrorMsg = response.Message;
            $("#myModalChangePassword").modal("show");

          }
          if (response.Valid == true) {
            $("#myModalChangePassword").modal("hide");
            //this.toastr.success(response.Message, '', {
            //    positionClass: "toast-bottom-right",
            //});
            this.ApplyJobMsg = response.Message;
            $("#myModal").modal('show');

          }
          this.HideSpinner();
          this.popuphide();
        }, (error: any) => {

          console.log(error);
        });
    }
  }

  validateEmail(ChangeEmail) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(ChangeEmail);
  }

  ChangeEmailErrorMsg: string = "";
  ChangeEmail;
  EmailValidation1: boolean = false;

  ChangeEmail_Click() {

    this.isMandatoryfields = false;
    this.EmailValidation1 = false;
    var $result = $("#result");
    var ChangeEmail = $("#ChangeEmail").val();
    $result.text("");

    if (this.ChangeEmail == "" || this.OldPassword == "") {
      this.isMandatoryfields = true;
      return;
    }
    if (this.ChangeEmail !== '') {
      if (this.validateEmail(ChangeEmail)) {
        this.EmailValidation1 = false;
        this.abc();
      }
      else {
        this.EmailValidation1 = true;
        return;
      }
    }
  }


  abc() {

    let RequestObject = {

      OldEmail: localStorage.getItem("Email"),
      Email: this.ChangeEmail,
      Password: this.OldPassword,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    this.openSpinner();
    let changeRegistrationEmail = this._config.environment.baseUrl + Constants.ChangeRegistrationEmail;
    this.http.post(changeRegistrationEmail, RequestObject, { headers: this.dataService.headers })
      .subscribe((response: any) => {

        if (response.IsValid == false) {
          this.ChangeEmailErrorMsg = response.Msg;
          $("#myModalChangeEmail").modal("show");

        }
        if (response.IsValid == true) {
          $("#myModalChangeEmail").modal("hide");
          //this.toastr.success(response.Msg, '', {
          //    positionClass: "toast-bottom-right",
          //});
          this.ApplyJobMsg = response.Msg;
          $("#myModal").modal('show');


        }
        this.HideSpinner();
        this.popuphide();

      }, (error: any) => {

        console.log(error);
      });

  }

  GetFF_Value: boolean;
  isbadge: boolean = false;
  MyJobCounter: any;
  OPenVacanciesCount: any;
  myJobCounter() {

    let RequestObject = {

      ApplicantId: localStorage.getItem("AppId"),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,
      CompanyGroupID: Constants.CompanyId,
    }

    let getMyJobsGridsCount = this._config.environment.baseUrl + Constants.GetMyJobsGridsCount;
    this.http.post(getMyJobsGridsCount, RequestObject, { headers: this.dataService.headers })
      //this.http.post("https://jobportalapi.azurewebsites.net/GetMyJobsGridsCount", RequestObject)
      .subscribe((response: any) => {

        this.MyJobCounter = response;
        this.OPenVacanciesCount = response.OPenVacanciesCount;
        if (this.OPenVacanciesCount > 0) {
          this.isbadge = true;
        }

      }, (error: any) => {

        console.log(error);
      });
  }

  // for CompanyID //
  IsAssessmentActive: boolean = false;
  PannelWidth: string = "";

  updateTabWidth() {
    const showAssessment = this.IsAssessmentActive == true || this.IsAssessmentActive == null;
    const showMyJobs = !this.isFF;
    const showApplicantPackage = this.showApplicantPackageTab;
    let tabCount = 0;

    if (showMyJobs) {
      tabCount += 1;
    }

    tabCount += showApplicantPackage ? 3 : 2; // Personal, Professional, Applicant Package (non-FF only)

    if (showAssessment) {
      tabCount += 1;
    }

    if (tabCount <= 0) {
      this.PannelWidth = "100%";
      return;
    }

    this.PannelWidth = (100 / tabCount).toFixed(2) + "%";
  }

  getCompanyParameter() {

    //this.openSpinner();
    let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
    this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
      if (response != null) {
        if (response.CompanyId == 0) {
          $("#myModalWrongURL").modal("toggle");
          this.WrongUrl = false;
        }

        //this.GetFF_Value = response.isFFEnable;

        if (response.CompanyId != null || !isNullOrUndefined(response.CompanyId))
          this.CompanyIdService.CompanyId = response.CompanyId;
        if (response.CompanyName != null || !isNullOrUndefined(response.CompanyName))
          this.CompanyIdService.CompanyName = response.CompanyName;
        if (response.RedirectPath != null || !isNullOrUndefined(response.RedirectPath))
          this.CompanyIdService.RedirectPath = response.RedirectPath;
        if (response.CompanyLogoBase64 != null || !isNullOrUndefined(response.CompanyLogoBase64))
          this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
        if (response.PicSize != null || !isNullOrUndefined(response.PicSize))
          this.CompanyIdService.PicSize = response.PicSize;

        if (response.IsAssessmentActive != null || !isNullOrUndefined(response.IsAssessmentActive)) {
          this.IsAssessmentActive = response.IsAssessmentActive;
          this.updateTabWidth();
        }
      }

      this.getHomeLabels();


      if (this.isFF) {

        this.getJobPortalConfigurationFF();

      } else {
        this.getJobPortalConfiguration();
      }

      //this.getJobPortalConfiguration()
      this.getLastProfileUpdateValue();
      this.myJobCounter();
      this.getAssessmentTabCount();
      this.readFromBlob();
      //this.readFromBlob1();

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


  // For Last updated Profile //
  LastProfileUpdateValue: any;
  IsLastProfileVisible: boolean = false;
  isProfileImage: boolean = true;

  Marital: string = "";
  Religion: string = "";
  Video: string = "";
  SocialMedia: string = "";
  Qualification: string = "";
  Certification: string = "";
  Training: string = "";
  Experience: string = "";
  Skills: string = "";
  ProfRef: string = "";
  percentage: string = "";
  percentageToolTip: any;


  getJobPortalConfigurationFF() {
    let RequestObject = {
      CompanyId: this.CompanyIdService.CompanyId,
    };
    let GetJobPortalConfiguration_FF = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration_FF;

    this.http.post(GetJobPortalConfiguration_FF, RequestObject, { headers: this.dataService.headers })
      .subscribe(
      (response: any) => {
        console.log(response.ThemeColor);

        if (response && response.ThemeColor != null) {
          this.ClrThemeChng.ChangeTheme = response.ThemeColor;
        }

        if (response && response.VisIntroductoryVideo != null) {
          this.VisIntroductoryVideo = response.VisIntroductoryVideo;
        }

        this.Color();
      },
       (error) => {
      console.error("Error occurred while fetching job portal configuration:", error);
    });
    
  }



    getLastProfileUpdateValue() {
        
        let RequestObject = {
            ApplicantId: localStorage.getItem("AppId"),
            CompanyId: this.CompanyIdService.CompanyId,
        }

        //this.openSpinner();
        let getLastProfileUpdateValue = this._config.environment.baseUrl + Constants.GetLastProfileUpdateValue;
        this.http.post(getLastProfileUpdateValue, RequestObject, { headers: this.dataService.headers })
            //this.http.post("https://jobportalapi.azurewebsites.net/GetLastProfileUpdateValue", RequestObject)
            .subscribe((response: any) => {

              if (response.ProfileLastUpdate != "" && response.ProfileLastUpdate != null && !isNullOrUndefined(response.ProfileLastUpdate)) {
                this.updateProfService.LastProfileUpdateValue = response.ProfileLastUpdate;
                this.IsLastProfileVisible = true;
              }
              

              //Commented by Maaz [12/02/2020]
                //this.updateProfService.ProfilePercentage = response.ProfilePercentage;              
                //this.Marital = response.Marital;
                //this.Religion = response.Religion;
                //this.Video = response.Video;
                //this.SocialMedia = response.SocialMedia;
                //this.Qualification = response.Qualification;
                //this.Certification = response.Certification;
                //this.Training = response.Training;
                //this.Experience = response.Experience;
                //this.Skills = response.Skills;
                //this.ProfRef = response.ProfRef;
                
                //this.percentageToolTip = "&nbsp;&nbsp; Marital Status: " + this.Marital + "%" + "<br />" + "&nbsp;&nbsp; Religion: " + this.Religion + "%" + "<br />" + "&nbsp;&nbsp; Introductory Video: " + this.Video + "%" + "<br />" + "&nbsp;&nbsp; Social Media Connection: " + this.SocialMedia + "%" + "<br />" + "&nbsp;&nbsp; Academic Qualification: " + this.Qualification + "%" + "<br />" + "&nbsp;&nbsp; Certification: " + this.Certification + "%" + "<br />" + "&nbsp;&nbsp; Training: " + this.Training + "%" + "<br />" + "&nbsp;&nbsp; Experience: " + this.Experience + "%" + "<br />" + "&nbsp;&nbsp; Competencies/Skills: " + this.Skills + "%" + "<br />" +  "&nbsp;&nbsp; Professional References: " + this.ProfRef + "%";
              //end [maaz]


                //if (this.updateProfService.ProfilePercentage == "0%") {

                //    this.isProfileImage = true;
                //}

                //this.strength();
               // this.Color();
                //if (response.Isvalid == true) {
                //    this.strength();
                //}


                //this.LastProfileUpdateValue = response;
            }, (error: any) => {
                console.log(error);
            });
    }


    getJobPortalConfiguration() {


        let RequestObject = {

            CompanyId: this.CompanyIdService.CompanyId,
        };
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
          .subscribe((response: any) => {
            //console.log(response.ThemeColor);
            if (response.ThemeColor != null || !isNullOrUndefined(response.ThemeColor))
            { this.ClrThemeChng.ChangeTheme = response.ThemeColor; }

            if (response.VisIntroductoryVideo != null || !isNullOrUndefined(response.VisIntroductoryVideo))
            { this.VisIntroductoryVideo = response.VisIntroductoryVideo; }
                
                this.Color();

            })
    }



    forChanges: any;
    breakcode: any;
    code: any;
    DefaultBorderColorMenu: string = "";
    BorderColorMenu: string = "";
    fontWeight: string = "";
    defaultFontWeight: string = "";
    assessment: string = "";
    myJobs: string = "";
    personlaInfo: string = "";
    professionalInfo: string = "";
    packageActive: string = "";

    personalInfoNonCorporate: string = "";
    ProfessionalInfoNonCorporate: string = "";

    tickImage: string = "";
    margin40: string = "40px !important";
    margin120: string = "120px !important";
    HomeBackgroundImage: string = "";
    // this.tickImage = "../../../assets/images/" + Constants.default + "/tick.PNG";

    Color() {
      debugger;
        this.forChanges = this.ClrThemeChng.ChangeTheme;

        if (isNullOrUndefined(this.forChanges)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.BackgroundImage = "assets/images/" + Constants.default + "/upload.png";
            this.DefaultBorderColor = "1px solid #" + Constants.default;
            this.DefaultBorderColorMenu = "6px solid #" + Constants.default;
            this.defaultFontWeight = "300";
            this.assessment = "assets/images/007FFF/AssessmentsActive.png";
            this.myJobs = "assets/images/007FFF/MyJobsActive.png";
            this.personlaInfo = "assets/images/007FFF/PersonalInfoActive.png";
            this.professionalInfo = "assets/images/007FFF/ProfessionalInfoActive.png";
            this.packageActive = "assets/images/007FFF/packageActive.png";

            this.tickImage = "assets/images/" + Constants.default + "/tick.png";
            this.HomeBackgroundImage = "assets/images/" + Constants.default + "/home.png";
        }
        else if (!isNullOrUndefined(this.forChanges)) {
          debugger
          this.breakcode = this.forChanges.split('#');
          //console.log(this.breakcode);
          this.code = this.breakcode[1];

            this.ThemeFontColor = this.forChanges;
            this.BackgroundImage = "assets/images/" + this.code + "/upload.png";
            this.BorderColor = "1px solid" + this.forChanges;
            this.BorderColorMenu = "6px solid" + this.forChanges;
            this.fontWeight = "900";
            this.assessment = "assets/images/" + this.code + "/AssessmentsActive.png";
            this.myJobs = "assets/images/" + this.code + "/MyJobsActive.png";
            this.personlaInfo = "assets/images/" + this.code + "/PersonalInfoActive.png";
            this.professionalInfo = "assets/images/" + this.code + "/ProfessionalInfoActive.png";
            this.packageActive = "assets/images/" + this.code + "/packageActive.png";
            this.tickImage = "assets/images/" + this.code + "/tick.png";
            this.HomeBackgroundImage = "assets/images/" + this.code + "/home.png";
        }
        this.HideSpinner();
        //
        //if (Constants.Color == "") {
        //    this.DefaultFontColor = "#" + Constants.default;
        //    this.BackgroundImage = "../../../assets/images/" + Constants.default + "/upload.png";
        //    this.DefaultBorderColor = "1px solid #" + Constants.default;
        //}
        //else {
        //    if (Constants.Color == "EFC203") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/upload.PNG";
        //        this.BorderColor = "1px solid #" + Constants.Color;
        //    }
        //    else {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/upload.png";
        //        this.BorderColor = "1px solid #" + Constants.Color;
        //    }
        //}
    }


    CropFalse() {
        this.isCroppingImg = false
    }


    /*  For upload image 1*/
    isCroppingImg: boolean = false;
    ValidExtension: any;
    ValidExtension1: any;
    ValidExtension2: any;
    imageValidationForExtension: boolean = false;
    imageValidationForSize: boolean = false;
    isDisabled: boolean = true;
    PicSizeMB: number;
    SuccessfullyUploaded: boolean = false;
    jpImgObj: any;
    uniqueImgName1;
    updateImg: boolean = false;
    callSave: Subject<string> = new Subject<string>();

    Uploadedimage: boolean = false;
    isDeleteHide: boolean = true;
    ProfileImg: string = "assets/images/defaultProfileImg.png";

    imgResultAfterCompress: string;
    CompressBlob;

    AssignKBTOMB() {
      if (this.CompanyIdService.PicSize != 0 && !isNullOrUndefined(this.CompanyIdService.PicSize)) {
        this.PicSizeMB = this.CompanyIdService.PicSize / 1000; //convert KB to MB;
      }
      else {
        this.PicSizeMB = 1;
      }
    }

    bytesToMegaBytes(bytes) {
    return bytes / (1024 * 1024);
    }
 
    onSelectFile(event) {

      //Validation for Image size
      if (this.CompanyIdService.PicSize != 0 && !isNullOrUndefined(this.CompanyIdService.PicSize)) {
       
        var FileSize = event.target.files[0].size;
        var FileSizeMB = this.bytesToMegaBytes(FileSize);

        if (FileSizeMB > this.PicSizeMB)
        {
          this.imageValidationForSize = true;
          return;
        }
        else
        {
          this.imageValidationForSize = false;
        }
      }
      this.isDeleteHide = false;
      this.isDisabled = false; 
        // called each time file input changes
        this.imageValidationForExtension = false;
        if (event.target.files && event.target.files[0]) {
            this.ValidExtension = event.target.files[0].type;
            this.ValidExtension1 = this.ValidExtension.split('/');
            this.ValidExtension2 = this.ValidExtension1[0];
            if (this.ValidExtension2 != 'image') {
                this.imageValidationForExtension = true;
                this.url = "assets/images/defaultProfileImg.png"
                this.isDisabled = true;
                return;
            }
            
            var reader: FileReader = new FileReader();
            var self = this;
            reader.readAsDataURL(event.target.files[0]); // read file as data url
            this.updateImg = true;
            reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
                self.url = loadEvent.target.result;
            }
        }
    }
   
    b64toBlob(b64Data, contentType) {
        
        contentType = contentType || '';
        var sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        var files = new File(byteArrays, "Files")

  //      console.log('Before Compress', blob)
        return blob;
    }
   
    compress(e) {
        
        this.isDisabled = false;
        const width = 25;
        const height = 25;
        const fileName = '' + new Date().getTime();

        const img = new Image();
        img.src = this.url;
        if (this.url == '') {
            this.isDisabled = true;
            return;
        }
      
        var orientation = -1;
       //new image compression logic written by Maaz [25 Mar 2020]
        this.imageCompress.compressFile(this.url, orientation, 50, 50).then(
          result => {
            this.imgResultAfterCompress = result;
            //this.localCompressedURl = result;
            //this.sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024)
            //console.warn('Size in bytes after compression:', this.sizeOFCompressedImage);
            // create file from byte
            const imageName = fileName;
            // call method that creates a blob from dataUri
            const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
            //imageFile created below is the new compressed file which can be send to API in form data
            //const imageFile = new File([result], imageName, { type: 'image/jpeg' });

            this.blob = imageBlob;

            this.SaveJPImgProfile(e);
          });

        //img.onload = () => {
        //    const elem = document.createElement('canvas');
        //    const scaleFactor = width / img.width;
        //    elem.width = width;
        //    elem.height = img.height * scaleFactor;;
        //    const ctx = elem.getContext('2d');

        //    ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);

        //    ctx.canvas.toBlob((blob) => {
        //        this.CompressBlob = new File([blob], fileName, {
        //            type: 'image/jpeg',
        //            lastModified: Date.now()
        //        });
        //    //    console.log('After CompressBlob', this.CompressBlob)
        //        this.SaveJPImgProfile(e);

        //    }, 'image/jpeg', 1);

        //}
    }

    dataURItoBlob(dataURI) {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      return blob;
    }


    //Save  profile Image to Blob 
   
    SaveJPImgProfile($event) {
      this.isDisabled = false;

      if (this.url == '') {
        this.isDisabled = true;
      }
      this.openSpinner();
      //this.jpImgObj = ({ name: this.uniqueImgName, blob: this.blob })
      var block = this.url.split(";");
      // Get the content type of the image
      var contentType = block[0].split(":")[1];
      var extension = contentType.split("/")[1];
      // get the real base64 content of the file
      var realData = block[1].split(",")[1];
      //this.blob = this.b64toBlob(realData, contentType);
  
      this.uniqueImgName1 = 'img1-' + new Date().getTime() + "." + extension;
      this.uniqueImgName = 'img-' + new Date().getTime() + "." + extension;
      //alert(this.uniqueImgName ) 
      const fd = new FormData;
      fd.append("jpProfileImage1", this.blob, this.uniqueImgName1);
      //fd.append("jpProfileImage", this.CompressBlob, this.uniqueImgName);

      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
          //console.log(request.response)
          var obj = JSON.parse(request.response)
          if (obj['Msg'] == 'Image uploaded successfully!') {
            this.HideSpinner();
            this.SuccessfullyUploaded = true;
            this.isDeleteHide = true;
            this.getLastProfileUpdateValue();

            this.isCroppingImg = false;
            this.ApplyJobMsg = obj['Msg'];
            $("#myModal").modal('show');
            this.getLastProfileUpdateValue();
            this.isDisabled = true;

          }
          if (obj['isValid'] == true) {
            this.ProfileImg = obj['StrAppPic'];// obj['AppPic'];
            //this.readFromBlob();
            this.isCroppingImg = false;
          }
          this.readFromBlob();
          this.popuphide();
          this.HideSpinner();
        }
      }
      // request.open("POST", this._config.environment.baseUrl + Constants.UploadImage + "?CompanyId=" + this.CompanyIdService.CompanyId + "&AppId=" + this.applicantId);
      request.open("POST", this._config.environment.baseUrl + Constants.UploadImage + "?CompanyId=" + this.CompanyIdService.CompanyId + "&AppId=" + this.applicantId + "&Identifier=0");
      var accessToken = localStorage.getItem("AccessToken");
      if (accessToken) {
        request.setRequestHeader("Authorization", "Bearer " + accessToken);
      }
      request.send(fd);
      this.getLastProfileUpdateValue()
      $("#myModalChangePicture").modal("toggle");
    }
  
    isDeleteButton() {
      
      if (this.ProfileImg == "assets/images/defaultProfileImg.png") {
        this.isDeleteHide = false;
      }
      else {
        this.isDeleteHide = true;
      }

        this.imageValidationForSize = false;

        this.AssignKBTOMB();
    }

    ResetVal() {
      this.updateImg = false;
      this.url = null;
      this.isCroppingImg = false;

      if (this.myInputVariableFile && this.myInputVariableFile.nativeElement) {
        this.myInputVariableFile.nativeElement.value = '';
      }
    }

    //ResetVal() {
    //  this.updateImg = false;
    //  this.url = null;
    //  this.isCroppingImg = false;
    //  this.myInputVariableFile.nativeElement.value = "";
    //}

    readFromBlob() {
      debugger;
      //alert(localStorage.getItem("AppId"))
        let RequestObject = {
          ApplicantId: localStorage.getItem("AppId"),
          //CompanyId: this.CompanyIdService.CompanyId,
          //  Identifier: 1,
      }
         
        let readFromBlob = this._config.environment.baseUrl + Constants.GetApplicantImage;
        this.http.post(readFromBlob, RequestObject, { headers: this.dataService.headers })
          .subscribe((response: any) => {
            
            this.isDisabled = true;
            if (response.AppPic == "") {
                this.ProfileImg = "assets/images/defaultProfileImg.png"
                this.isDeleteHide = false; 
            }
            else {
              this.ProfileImg = "data:image/JPEG;base64," + response.AppPic;
            }         

        });
    }



   


    ApprovalStatus: string = "";
    ApplicantData: any;


    getApplicantData() {
      debugger;
      let RequestObject = {
        ApplicantId: localStorage.getItem("AppId"),
        Culture: Constants.Culture,
        CompanyId: this.CompanyIdService.CompanyId

      }
      this.openSpinner();
      let getApplicantData = this._config.environment.baseUrl + Constants.GetApplicantData;
      this.http.post(getApplicantData, RequestObject, { headers: this.dataService.headers })
        // this.http.post("https://jobportalapi.azurewebsites.net/GetApplicantData", RequestObject)
        .subscribe((response: any) => {
          //console.log('data : ', response.Data);
          this.ApplicantData = response.Data;

          this.ApprovalStatus = response && response.Data && response.Data.length > 0
            ? (response.Data[0].ApprovalStatus || null)
            : null;

          //console.log(this.ApprovalStatus);

          this.HideSpinner();



        }, (error: any) => {

          console.log(error);
        });
    }
  

    setId3() {
        //$("#myModalChangePicture").modal('hide');
    }



    IsdeleteImg: string = "";
    isImgDeleteSuccessfull: boolean = false;
    DeleteImage() {

      let RequestObject = {
        AppId: this.applicantId,
        CompanyId: this.CompanyIdService.CompanyId,
        Type: 3 
      }

        this.openSpinner();
        let getDeleteFromBlob = this._config.environment.baseUrl + Constants.DeleteApplicantUploadedDoc;// + "?AppId=" + this.applicantId + "&CompanyId=" + this.CompanyIdService.CompanyId + "&Identifier=3";
        this.http.post(getDeleteFromBlob, RequestObject, { headers: this.dataService.headers }).subscribe((response: any) => {
            
            this.HideSpinner();
            if (response.IsValid == true) {
                this.isImgDeleteSuccessfull = true;
                this.ApplyJobMsg = response.Msg;
                $("#myModalChangePicture").modal('hide');
                $("#myModal").modal('show');
                this.updateImg = false;
                this.ProfileImg = "assets/images/defaultProfileImg.png";
            }
            this.popuphide();
        });
    }


    // postData //

    public PostData(model, url: string,headers: any) {
        

        const retVal = this.http.post(url, model, headers)
            .subscribe((response: any) => {

                this.HideSpinner();
                this.toastr.success(response.Message, '', {
                    positionClass: "toast-bottom-right",
                });

                if (!isNullOrUndefined(response) && response.isValid == true) {
                    this.isMandatoryfields = false;
                    $("#myModalChangePassword").modal("toggle");

                }
                else {
                    //       this.isMandatoryfields = true;
                }

                //this.readFromBlob();
            }

            , (error: any) => {
                alert("Invalid Data.");
            });
    }

    btnPostChangePassword1_Click() {
        
        this.isMandatoryfields = false;
        this.ChangeEmail = "";
        this.OldPassword = "";
        this.CurrentPassword = "";
        this.NewPassword = "";
        this.ConfirmPassword = "";
        this.ChangeEmailErrorMsg = "";
        this.EmailValidation1 = false;
        this.ChangepasswordErrorMsg = "";
      

    }

    isProfileCompletion: boolean = false;

    a: string = this.updateProfService.ProfilePercentage;
    //a: string = "160%"

    // for profile strength //
    percent: string = this.a;
    strength() {
        
        if (this.updateProfService.ProfilePercentage == "0%") {
            this.isProfileImage = true;
            return;
        }
        else{
            this.percent = this.updateProfService.ProfilePercentage;
            //this.isProfileCompletion = true;
        $(document).ready(function () {
            $('.skillbar').each(function () {
                $(this).find('.skillbar-bar').animate({
                    width: $(this).attr('data-percent')
                }, 2000);
            });
        });
    }
    }


    //--------- Assessment Tab Count
    assessCount: any;
    getAssessmentTabCount() {
        
        //this.openSpinner();
        let obj = {
            AppId: localStorage.getItem('AppId'),
            Culture: 'en-GB',
            Search: '',
            CompanyId: this.CompanyIdService.CompanyId
        };

        this._dataService.post(this._config.environment.baseUrl + 'GetAssessmentCount', obj).subscribe(res => {

            this.assessService.assessCount = (res !== null || res !== undefined) ? res : 0;

            this.HideSpinner();
        }, err => {
            this.assessService.assessCount = 0;
            this.HideSpinner();
        })
    }




    // Upload Video om Blob //


    //Save  profile Image to Blob
   // url1: string = '';
  
   // isTick: boolean = false;
   // isvideoSize1: number = 0;
   // isvideoSizeForValidation: number = 0;
   //// applicantId: string = "";
   // ApplyJobMsgForSize: any;
   // mrgLfl: boolean = false;

   // callSave1: Subject<string> = new Subject<string>();
   // SaveJPImgProfile1() {
        
   //     this.openSpinner();
   //     this.isvideoSize1 = this.isvideoSize / 1048576;
   //     this.isvideoSize1 = Math.round(this.isvideoSize1);
   //     this.isvideoSizeForValidation = this.CompanyIdService.VideoSize;
   //     if (this.CompanyIdService.VideoSize < this.isvideoSize1) {
   //        // $("#videoPopup").modal('show');
   //         this.isSaveBtnShow = true;
   //         this.ApplyJobMsgForSize = "Video size cannot exceed maximum length of " + this.isvideoSizeForValidation + " MBs.";
   //         this.HideSpinner();
   //         return;
   //     }
   //     //this.jpImgObj = ({ name: this.uniqueImgName, blob: this.blob })
   //     this.ApplyJobMsg = '';
   //     var block = this.url1.split(";");
   //     // Get the content type of the image
   //     var contentType = block[0].split(":")[1];
   //     var extension = contentType.split("/")[1];
   //     // get the real base64 content of the file
   //     var realData = block[1].split(",")[1];
   //     this.blob = this.b64toBlob(realData, contentType);
   //     this.uniqueImgName = 'vid-' + new Date().getTime() + "." + extension;
   //     //alert(this.uniqueImgName )
   //     const fd = new FormData;
   //     fd.append("jpProfileImage", this.blob, this.uniqueImgName);
   //     const request = new XMLHttpRequest();

   //     request.onreadystatechange = () => {
   //         var obj = JSON.parse(request.response)
            
   //         if (request.readyState == 4 && request.status == 200) {
   //             if (obj['isValid'] == true) {
   //                 this.HideSpinner();
   //                 $("#videoPopup4").modal('show');
   //                 this.isTick = true;
   //                 this.SuccessfullyUploaded = true;
   //                 this.isDeleteHide = true;
   //                 this.isView = true;
   //                 this.isDeleteIcon = true;
   //                 this.isSaveBtnShow = false;            /*abi k lea for video 07/10/2019*/
   //                 this.isShowVideo = true;
   //                 this.isVideoPlayBtn = true;
   //                 this.mrgLfl = true;
   //                 this.getLastProfileUpdateValue();
   //                 //  this.HideSpinner();
   //                 //this.toastr.success(obj['Msg'], '', {
   //                 //    positionClass: "toast-bottom-right",
   //                 //});
   //                 //this.readFromBlob();
   //                 this.getLastProfileUpdateValue();
   //                 this.ApplyJobMsg = obj['Msg'];
   //                 this.url1 = obj['AppPic'];
   //                 this.popuphide();
   //                 // this.isShowVideo = false;
   //                 //this.readFromBlob();
   //             }
   //             //else {
   //             //    this.HideSpinner();
   //             //    $("#videoPopup").modal('show');
   //             //    this.ApplyJobMsg = obj['Msg'];
   //             //    this.popuphide();
   //             //}
   //         }
   //         this.HideSpinner();
   //         //this.ApplyJobMsg = obj['Message'];
   //         //$("#videoPopup").modal('show');
   //         //this.isTick = false;
   //         //this.popuphide();
   //     }
   //     // request.open("POST", this._config.environment.baseUrl + Constants.UploadImage + "?CompanyId=" + this.CompanyIdService.CompanyId + "&AppId=" + this.applicantId);
   //     request.open("POST", this._config.environment.baseUrl + Constants.UploadImage + "?CompanyId=" + this.CompanyIdService.CompanyId + "&AppId=" + this.applicantId + "&Identifier=2");
   //     request.send(fd);
   // }

    /*  For upload image 1*/
  //  isCroppingImg: boolean = false;
    //isvideoSize: number = 0;
    //isShowVideo: boolean = false;
    //isPlayVideo: boolean = false;
    //videoVlaidMsg: boolean;
    //onSelectFile1(event) {
        
    //    // called each time file input changes
    //    this.isSaveBtnShow = true;
    //    this.isShowVideo = true;
    //    this.isCroppingImg = true;
    //    this.videoVlaidMsg = false;
    //    this.ApplyJobMsg = '';
    //    this.mrgLfl = false;
    //    this.url1 = '';
    //    this.isVideoPlayBtn = true;
    //    if (event.target.files && event.target.files[0]) {
    //        this.isvideoSize = event.target.files[0].size;
    //        var ValidExtension = event.target.files[0].type;
    //        var ValidExtension1 =  ValidExtension.split('/');
    //        var ValidExtension2 =  ValidExtension1[0];
    //        if (ValidExtension2 != "video") {
    //         //   this.imageValidationForExtension = true;
    //           // this.url = "assets/images/defaultProfileImg.png"
    //            this.isSaveBtnShow = false;
    //            this.isShowVideo = false;
    //            this.isCroppingImg = false;
    //            this.mrgLfl = true;
    //            this.isVideoPlayBtn = false;
    //            this.videoVlaidMsg = true;
    //            this.url1 = '';
    //            return;
    //        }
    //        //if (ValidExtension != "video/mp4" || ValidExtension != "video/webm" || ValidExtension != "video/ogg" || ValidExtension != "video/avi"){
    //        //    this.isSaveBtnShow = false;
    //        //    this.isShowVideo = false;
    //        //    this.isCroppingImg = false;
    //        //    this.mrgLfl = true;
    //        //    this.isVideoPlayBtn = false;
    //        //    this.videoVlaidMsg = true;
    //        //    this.url1 = '';
    //        //    return;
    //        //}
    //        var reader: FileReader = new FileReader();
    //        var self = this;

    //        reader.readAsDataURL(event.target.files[0]); // read file as data url
    //      //  this.updateImg = true;
    //        reader.onload = function (loadEvent: any) { // called once readAsDataURL is completed
    //            self.url1 = loadEvent.target.result;               
    //        }
    // //   this.function();
    //    }
    //}

    //b64toBlob(b64Data, contentType) {
    //    contentType = contentType || '';
    //    var sliceSize = sliceSize || 512;

    //    var byteCharacters = atob(b64Data);
    //    var byteArrays = [];

    //    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //        var slice = byteCharacters.slice(offset, offset + sliceSize);

    //        var byteNumbers = new Array(slice.length);
    //        for (var i = 0; i < slice.length; i++) {
    //            byteNumbers[i] = slice.charCodeAt(i);
    //        }

    //        var byteArray = new Uint8Array(byteNumbers);

    //        byteArrays.push(byteArray);
    //    }

    //    var blob = new Blob(byteArrays, { type: contentType });
    //    var files = new File(byteArrays, "Files")

    //    //console.log(files)
    //    return blob;

    //}

    isSaveBtnShow;

    //function() {
    //    //this.isShowVideo = true;
        
    //    $(document).on("change", ".file_multi_video", function (evt) {
    //        var $source = $('#video_here');
    //        $source[0].src = URL.createObjectURL(this.files[0]);
    //        $source.parent()[0].load();
          
    //    });
    //}
    isVideoPlayBtn: boolean = false;

    playFunc() {
        

        if (this.input.nativeElement.paused == true) {
            this.isVideoPlayBtn = false;
         this.input.nativeElement.setAttribute('controls', 'controls');
        }
        if (this.input.nativeElement.paused == false) {
            this.isVideoPlayBtn = true;
           this.input.nativeElement.removeAttribute("controls")  
        }
        this.input.nativeElement.paused ? this.input.nativeElement.play() : this.input.nativeElement.pause();
        return;


        //if (this.input.nativeElement.paused == true) {
        //    this.isVideoPlayBtn = false;
        //    this.input.nativeElement.setAttribute('controls', 'controls');
        //    this.input.nativeElement.play()
        //    console.log("a", this.input.nativeElement.paused)
        //} else {

        //    this.isVideoPlayBtn = true;
        //    this.input.nativeElement.removeAttribute("controls");
        //    this.input.nativeElement.pause();
        //    console.log("b", this.input.nativeElement.paused)
        //}
    }



    function() {
        console.log("insert Video funtion1")
        //var vid = document.getElementById('myVideo');
        //var vid = $('#myVideo');
        this.input.nativeElement.paused ? this.input.nativeElement.play() : this.input.nativeElement.pause();
        //this.input.nativeElement.play();
        //vid.play()
            //$('video').mediaelementplayer({
            //    alwaysShowControls: true,
            //    videoVolume: 'horizontal',
            //    features: ['playpause', 'progress', 'volume', 'fullscreen']
            //});
    }



    //function1() {

    //    $(document).ready(function () {
    //        $('#video').hover(function () {
    //            $('.play-btn').addClass('hover');
    //            $('#play').addClass('hover');
    //        }, function () {
    //            $('.play-btn').removeClass('hover');
    //            $('#play').removeClass('hover');
    //        });
    //    });

    //}

    //isPlayVideoFalse() {
        
    //    this.isPlayVideo = false;
  
    //}
    //isPlayVideoTrue() {
        
    //    this.isPlayVideo = true;
    //}
    
    isView: boolean = false;
   
    //readFromBlob1() {

    //    let RequestObject = {
    //        AppId: localStorage.getItem("AppId"),
    //        CompanyId: this.CompanyIdService.CompanyId,
    //        Identifier: 2,
    //    }
    //    let readFromBlob = this._config.environment.baseUrl + Constants.ReadFromBlob;
    //    this.http.post(readFromBlob, RequestObject, { headers: this.dataService.headers }).subscribe((response: any) => {

    //        this.isShowVideo = true;
    //        this.isVideoPlayBtn = true;
    //        this.url1 = response;
    //      //  this.function();
    //     //   console.log("url", this.url1)
    //        this.mrgLfl = true;
    //        this.isView = true;
    //        this.isDeleteIcon = true;
    //        if (this.url1 == "null") {
    //            //this.ProfileImg = "assets/images/defaultProfileImg.png"
    //            //this.isDeleteHide = false;
    //            this.isShowVideo = false;
    //            this.isView = false;
    //            this.isDeleteIcon = false;
    //            this.isVideoPlayBtn = false;
    //            this.mrgLfl = false;
    //        }
    //        //this.Uploadedimage = true;

    //    });
    //}
   
    isDeleteIcon: boolean = false;
   

    //getDeleteFromBlob1() {

    //    this.openSpinner();
    //    let getDeleteFromBlob = this._config.environment.baseUrl + Constants.DeleteFromBlob + "?AppId=" + this.applicantId + "&CompanyId=" + this.CompanyIdService.CompanyId + "&Identifier=2";
    //    this.http.get(getDeleteFromBlob, { headers: this.dataService.headers }).subscribe((response: any) => {

    //        this.HideSpinner();
    //        if (response.IsValid == true) {
    //            $("#videoPopup4").modal('show');
    //            this.isTick = true;
    //            this.isView = false;
    //            this.isShowVideo = false;
    //            this.isDeleteIcon = false;
    //            this.isImgDeleteSuccessfull = true;
    //            this.ApplyJobMsg = response.Message;
    //            this.url1 = '';
    //            this.isVideoPlayBtn = false;
    //            this.getLastProfileUpdateValue();
    //            this.mrgLfl = false;
    //            //this.ProfileImg = "assets/images/defaultProfileImg.png";
    //        }
    //        if (response.IsValid == false) {
    //            this.isShowVideo = true;
    //            this.isView = true;
    //            this.isVideoPlayBtn = true;
    //            this.mrgLfl = true;
    //        }
    //        this.popuphide();
    //    });
    //}

    //isRemoveVideo() {
    //    this.isShowVideo = false;
    //    this.isSaveBtnShow = false;
    //    this.mrgLfl = false;
    //    this.isVideoPlayBtn = false
    //}

    PopupCloseForVideo() {
        $("#videoPopup4").modal('hide');
        this.tickImage = "";
        this.ApplyJobMsg = "";
    }


    //ViewVideo() {
    //    this.isShowVideo = true;
    //}
   


  //Picture work
    imageChangedEvent: any = '';
    croppedImage: any = '';

    fileChangeEvent(event: any): void {
      this.isCroppingImg = true;
      this.updateImg = true;
      this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
      this.url = event.base64;
    }
    imageLoaded() {
      // show cropper
    }
    cropperReady() {
      // cropper ready
    }
    loadImageFailed() {
      // show message
    }
} 
