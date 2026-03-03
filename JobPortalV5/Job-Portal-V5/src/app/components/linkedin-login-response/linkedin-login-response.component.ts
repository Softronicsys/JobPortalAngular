import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConfigService } from '@app/Service/app-config.service';
import { DataService } from '../../Shared/Services/data.services'
import { Constants } from '../../Helper/Constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { isNullOrUndefined } from 'util';
declare var $: any;
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { Labels } from '@app/Service/DatabaseLbl.service';


@Component({
  selector: 'app-linkedin-login-response',
  templateUrl: './linkedin-login-response.component.html',
  styleUrls: ['./linkedin-login-response.component.css']
})
export class LinkedinLoginResponseComponent implements OnInit {

  //login data var
  IsValidLinkedInResponse?: boolean = null;
  authCode = "";
  LinkedInReponseObject: any;
  LinkedInRandomPassword: any;

  // popup vars
  public responseData;
  filteredJobs: any[];
  DisconnectInternet: boolean = false;   
  MPRDETAIL: any[];
  arrHeadings: any[] = [];
  arrJobsDetail: any[] = [];
  showMeetings: boolean = false;
  showReports: boolean = false;
  showAcademicQualifications: boolean = false;
  showTrainings: boolean = false;
  showCertification: boolean = false;
  showCompetencies: boolean = false;
  showAuthorities: boolean = false;
  slideIndex = 1;
  isGrid: boolean = false;
  HRLooping: any[3] = [1, 2, 3];
  BannerList: string[] = [];
  isBannerExists: boolean = false;
  id: any;
  ischkTraining: boolean = false;
  isSpinnerPopup: boolean = false;
  isSpinnerPage: boolean = true; 
  BackgroundImage: string = "";
  ThemeFontColor: string = "";
  DefaultFontColor: string = "";
  BorderColor: string = "";
  DefaultBorderColor: string = "";
  textToFilter: string = "";
  searchFilter: string = "0";
  WrongUrl: boolean = true;
  IsDefaultTheme: boolean = true;
  isJobAvailable: boolean = false;   
  key1;
  g;
  CompanyForLocalStorage: any;
  res: any;
  obj: any;
  paramsvalue: any
  check: string = "false";
  BackgroundImage1: any;
  forChanges: any;
  breakcode: any;
  code: any;
  public RelativeBackground = {
    height: "auto !important",
    background: ""
  }
  public DefaultViewbackground = {
    height: "",
    background: ""
  }

  // signup vars
  Email: string = "";
  Password: string = "";
  ConfirmPassword: string = "";
  FirstName: string = "";
  MiddleName: string = "";
  LastName: string = "";
  PassportNumber: string = "";
  IdCardNumber: string = "";  
  isMandatoryfields: boolean = false;
  isMandatoryfields1: boolean = false;
  generateLink: boolean = false;
  YearsDropdown: any;
  Years: string = '0';
  ddlGenders: string = "";
  bankName: any;
  ImageLinkedIn: any;
  isImageView: boolean = false;
  LinkedInProfilePicUri: string = "";

  constructor(private Labels: Labels, private dataService: DataService, private route: ActivatedRoute
    , private http: HttpClient
    , private _config: AppConfigService, public CompanyIdService: GetCompanyParameter
    , private objRouter: Router, public ClrThemeChng: ThemeColorService
    ,private spinner: NgxSpinnerService) { }

  ngOnInit() {    
    //signup screen methods
    this.getCompanyParameter();    
    //localStorage.removeItem("CheckForAllBtn");
    //this.bankName = localStorage.getItem("bankName");
    //if (!isNullOrUndefined(this.bankName) && this.bankName != "")
    //{
    //  this.bankName = this.bankName.split(',');
    //  this.Email = this.bankName[2];
    //  this.ImageLinkedIn = this.bankName[3];
    //  this.ImageLinkedIn = this.ImageLinkedIn.replace('amp;', '');
    //  this.ImageLinkedIn = this.ImageLinkedIn.replace('amp;', '');
    //  this.ImageLinkedIn = this.ImageLinkedIn.replace('#', '?');
    //  this.ImageLinkedIn = decodeURIComponent(this.ImageLinkedIn);
    //  this.FirstName = this.bankName[0];
    //  this.LastName = this.bankName[1];
    //  this.isImageView = true;      
    //  localStorage.setItem("CheckForAllBtn", 'true');
    //}
    

    // login methods
    //this.getAssociatedCompanies();
    //this.getCompanyParameter();
    //this.Color();
   
      this.authCode = this.route.snapshot.queryParams["code"];
      var apiLink = this._config.environment.baseUrl + "LinkedInRedirection"
      let linkedInGetToken = this._config.environment.baseUrl + "LinkedInRedirection" + "?code=" + this.authCode +
        "&state=123" + "&error=''" + "&error_description=''" + "&groupcompid=" + this._config.environment.CompanyGroupID;

      this.openSpinner();
      this.http.get(linkedInGetToken, { headers: this.dataService.headers }).subscribe((response: any) => {
        this.LinkedInRandomPassword = Math.floor(10000000 + Math.random() * 90000000);
         
        if (response.IsValid) {
          this.FirstName = response.FirstName;
          this.LastName = response.LastName;
          this.Email = response.Email;
          this.LinkedInProfilePicUri = response.ProfilePicUri

          if (response.IsUserAlreadyFound) {
            this.LinkedInReponseObject = {
              Email: this.dataService.ReplaceApostropheWthTelda(this.Email),
              Password: this.LinkedInRandomPassword,
              ConfirmPassword: this.LinkedInRandomPassword,
              FirstName: this.dataService.ReplaceApostropheWthTelda(this.FirstName),
              MiddleName: this.dataService.ReplaceApostropheWthTelda(this.MiddleName),
              LastName: this.dataService.ReplaceApostropheWthTelda(this.LastName),
              DOB: "",
              GenderId: this.ddlGenders,
              PassportNumber: this.dataService.ReplaceApostropheWthTelda(this.PassportNumber),
              IdCardNumber: this.dataService.ReplaceApostropheWthTelda(this.IdCardNumber),
              Culture: Constants.Culture,
              CompanyId: this.CompanyIdService.CompanyId,
              GroupCompanyId: this._config.environment.CompanyGroupID,
              CompanyName: this.CompanyIdService.CompanyName,
              IsImageFromLinkedin: true,
              LinkedInImagePath: this.LinkedInProfilePicUri
            }

            let saveUser = this._config.environment.baseUrl + Constants.LinkedInLogin;
            this.PostLoginData(this.LinkedInReponseObject, saveUser, { headers: this.dataService.headers });
            return;
          }

          this.IsValidLinkedInResponse = response.IsValid;

          this.HideSpinner();
        }
        else {
          this.HideSpinner();
          this.IsValidLinkedInResponse = false;

          this.route
          setTimeout(() => {
            this.objRouter.navigate(['/login']);
          }, 5000);  //5s

        }
      });   
    
     
  }


  public PostLoginData(model, url: string, headers: any) {
    this.openSpinner();
    const retVal = this.http.post(url, model, headers)
      .subscribe((response: any) => {
        debugger;
        if (response)
        {
          console.log(response);
          if (response.Valid == false || response.isValid == false) {
            
              this.RestrictMsg = response.Message;

              $("#myModalSingupErr").modal("show");
             
          }

           


          if (response.Valid == true || response.isValid == true) {
            console.log('linkedInLoginResponse');
            console.log(response);
            //debugger;
            localStorage.setItem('UserName', response.UserName);
            localStorage.setItem('Email', response.Email);
            localStorage.setItem('AppId', response.AppId);
            //this.msg = response.Message;
            localStorage.setItem("IsLinkedInLogin", "1");
            this.CompanyIdService.IsLinkedInLogin = "1";
            //await this.ApplyJob();          
            this.objRouter.navigate(['/MyProfile']);
            //    for Create Array in localStorage
            var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + false + "," + response.AppId +
              "," + response.Email + "," + response.UserName + ",";
            localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
            localStorage.setItem("LastLoginId", this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID);            
          }
          this.HideSpinner();
        }
      }          
      , (error: any) => {
        this.HideSpinner();
        alert(error.error.Message);
      });
  }


  /* calling linkedin API from clientside
  getLinkedInAccessToken(userAuthCode)
  {
    console.log(userAuthCode);
    let body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', userAuthCode);
    body.set('redirect_uri', 'http://localhost:8732/linkedInLogin');
    body.set('client_id', '7734mhkanwwnnu');
    body.set('code', 'pxNIKPnGiRWz5Re5');
     
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.http
      .post('https://www.linkedin.com/oauth/v2/accessToken', body.toString(), options)
      .subscribe(response => {
        console.log(response);
      });
  }
  */

  onClickSignup()
  {
    $('#MPRCODE').modal('show');
  }
    

  getAssociatedCompanies() {


    let RequestObject = {

      CompanyGroupID: this._config.environment.CompanyGroupID,

    }
    let getAssociatedCompanies = this._config.environment.baseUrl + Constants.GetAssociatedCompanies + "?Culture=" + Constants.Culture;
    this.http.post(getAssociatedCompanies, RequestObject, { headers: this.dataService.headers })
      //  this.http.get(" https://jobportalapi.azurewebsites.net/GetAssociatedCompanies?Culture=en-GB")
      .subscribe((response: any) => {
         

      }, (error: any) => {
        console.log(error);
      });
  }
   
  plusSlides(n) {
    //this.showSlides(this.slideIndex += n);
  }
  
  //Signup functions
  getYears() {
    debugger;
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getYears = this._config.environment.baseUrl + Constants.GetYears;
    this.http.post(getYears, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetYears")
      .subscribe((response: any) => {
        this.YearsDropdown = response;
        debugger;

      }, (error: any) => {
        console.log(error);
      });

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


  // get Labels //

  lblFirstName: string = "First Name";
  lblMiddleName: string = "Middle Name";
  lblLastName: string = "Last Name";
  DateofBirth: string = "Date of Birth";
  Gender: string = "Gender";
  IDCardNo: string = "ID Card No.";
  PassportNo: string = "Passport No.";
  lblAccountId: string = "Account ID (Email Address)";
  lblConfirmPassword: string = "Confirm Password";
  lblTellUsAboutYourSelf: string = "Tell us about yourself!";
  btnSignUp: string = "SIGN UP";
  LblPassword: string = "Password";
  isShow: boolean = false;



  getHomeLabels() {
    debugger;
    this.isShow = true;
    if (this.Labels.dashLabels == true) {
      if (this.Labels.FirstName != "" && !isNullOrUndefined(this.Labels.FirstName))
        this.lblFirstName = this.Labels.FirstName;

      if (this.Labels.MiddleName != "" && !isNullOrUndefined(this.Labels.MiddleName))
        this.lblMiddleName = this.Labels.MiddleName;

      if (this.Labels.LastName != "" && !isNullOrUndefined(this.Labels.LastName))
        this.lblLastName = this.Labels.LastName;

      if (this.Labels.DateofBirth != "" && !isNullOrUndefined(this.Labels.DateofBirth))
        this.DateofBirth = this.Labels.DateofBirth;

      if (this.Labels.Gender != "" && !isNullOrUndefined(this.Labels.Gender))
        this.Gender = this.Labels.Gender;

      if (this.Labels.IDCardNo != "" && !isNullOrUndefined(this.Labels.IDCardNo))
        this.IDCardNo = this.Labels.IDCardNo;

      if (this.Labels.PassportNo != "" && !isNullOrUndefined(this.Labels.PassportNo))
        this.PassportNo = this.Labels.PassportNo;

      if (this.Labels.lblAccountId != "" && !isNullOrUndefined(this.Labels.lblAccountId))
        this.lblAccountId = this.Labels.lblAccountId;

      if (this.Labels.lblConfirmPassword != "" && !isNullOrUndefined(this.Labels.lblConfirmPassword))
        this.lblConfirmPassword = this.Labels.lblConfirmPassword;

      if (this.Labels.lblTellUsAboutYourSelf != "" && !isNullOrUndefined(this.Labels.lblTellUsAboutYourSelf))
        this.lblTellUsAboutYourSelf = this.Labels.lblTellUsAboutYourSelf;

      if (this.Labels.btnSignUp != "" && !isNullOrUndefined(this.Labels.btnSignUp))
        this.btnSignUp = this.Labels.btnSignUp;

      if (this.Labels.LblPassword != "" && !isNullOrUndefined(this.Labels.LblPassword))
        this.LblPassword = this.Labels.LblPassword;

    }
  }


  Color() {
    //console.log("test" + this.ClrThemeChng.ChangeTheme)
    //debugger;
    //this.openSpinner();
    this.forChanges = this.ClrThemeChng.ChangeTheme;


    if (isNullOrUndefined(this.forChanges)) {
      this.DefaultFontColor = "#" + Constants.default;
      this.BackgroundImage = "assets/images/" + Constants.default + "/general.png";
      this.DefaultBorderColor = "1px solid #" + Constants.default;
    }
    else if (!isNullOrUndefined(this.forChanges)) {

      this.breakcode = this.forChanges.split('#');
      this.code = this.breakcode[1];

      this.ThemeFontColor = this.forChanges;
      this.BackgroundImage = "assets/images/" + this.code + "/general.png";
      this.BorderColor = "1px solid" + this.forChanges;
    }

  }

  //GenerateNewLink(Gid,CompId) {

  //  let RequestObject = {
  //    Guid: Gid,
  //    CompanyId: CompId,
  //  };
  //  let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GenerateNewLink;
  //  this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers }) 
  //    .subscribe((response: any) => {

  //      this.ClrThemeChng.ChangeTheme = response.ThemeColor;
  //      this.Color();
  //      this.HideSpinner();

  //    })
  //}

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
        //this.HideSpinner();

      })
  }


  getCompanyParameter() {
    this.openSpinner();
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
        var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + this.check + ",,,,";
        localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
        localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID)
      }

      this.CompanyIdService.CompanyName = response.CompanyName;
      this.CompanyIdService.RedirectPath = response.RedirectPath;
      this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
      this.getHomeLabels();
      this.getJobPortalConfiguration();
      this.getYears();
      this.getGenderDropdown();
      this.Color();

    });


  }


  // Gender Dropdown //
  GenderDropdown: any;
  Genders: string = "";

  getGenderDropdown() {
    debugger;
    let RequestObject = {

      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,

    }

    let getGender = this._config.environment.baseUrl + Constants.GetGender + "?Culture=" + Constants.Culture;
    this.http.post(getGender, RequestObject, { headers: this.dataService.headers })
      //  this.http.get("https://jobportalapi.azurewebsites.net/GetMaritalStatus?Culture=en-GB")
      .subscribe((response: any) => {

        this.GenderDropdown = response;
        debugger;
        if (!isNullOrUndefined(this.GenderDropdown) && this.GenderDropdown.length > 0)
          this.ddlGenders = this.GenderDropdown[0].Id;
      }, (error: any) => {
        console.log(error);
      });
  }


  link: any;
  PopupMsg: string = "";
  ShowPopup: boolean = true;
  Linkbutton: boolean = true;
  linkProcessValid: boolean = false;
  LinkMsgGenerate: string = "";
  LinkMsgGenerate1: string = "";
  MsgValidate: string = "";

  GenerateLink() {
    debugger;
    this.LinkMsgGenerate = "";
    this.LinkMsgGenerate1 = "";

    //$("#myModalSingupErr").modal("hide");
    let RequestObject = {

      Guid: localStorage.getItem('GuidID'),
      CompanyId: this.CompanyIdService.CompanyId,
      FromEmail: Constants.FromEmail,
    }

    this.openSpinner();
    let generateNewLink = this._config.environment.baseUrl + Constants.GenerateNewLink;
    this.http.post(generateNewLink, RequestObject, { headers: this.dataService.headers })
      //  this.http.post("https://jobportalapi.azurewebsites.net/GenerateNewLink", RequestObject)
      .subscribe((response: any) => {
        console.log('response : ', response);
        this.link = response;
        this.HideSpinner();
        debugger;
        if (!isNullOrUndefined(response) && response.Valid == true) {
          $("#myModalSingupErr").modal("hide");
          let msgs = response.Message.split('<br/>');
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
          this.MsgValidate = response.Message;
          this.generateLink = false;
        }

      }, (error: any) => {
        console.log(error);
      });
  }



  DOB: string = "";
  RestrictMsg: string = "";
  ErrMsg: boolean = false;
  RestrictMsg1: any;
  genLink1: any;
  genLink12: any;
  genLink13: any;
  genLink14: any;
  genLink15: any;
  txtMonth: string = '00';
  txtDay: string = '00';
  RestrictMsg2: string = "";
  genderval;

  btnPost1_Click()
  {    
    debugger;    
    this.isMandatoryfields = false;
    this.isMandatoryfields1 = false;

    let DOB = this.txtDay.toString() + "-" + this.txtMonth.toString() + "-" + this.Years.toString();
    
    if (this.Email == "" || DOB == "" || this.LastName == "" || this.FirstName == "" || this.txtDay == '00' || this.Years == '0' || this.txtMonth == '00') {
      this.isMandatoryfields = true;
      this.isMandatoryfields1 = false;

      $('html, body').animate({
        scrollTop: $("#elementID").offset().top
      }, 500);

      return;
    }
    if (this.PassportNumber == "" && this.IdCardNumber == "") {
      this.isMandatoryfields1 = true;
      this.isMandatoryfields = false;

      $('html, body').animate({
        scrollTop: $("#elementID").offset().top
      }, 500);

      return;
    }

    //save
    this.LinkedInReponseObject = {
      Email: this.dataService.ReplaceApostropheWthTelda(this.Email),
      Password: this.LinkedInRandomPassword,
      ConfirmPassword: this.LinkedInRandomPassword,
      FirstName: this.dataService.ReplaceApostropheWthTelda(this.FirstName),
      MiddleName: this.dataService.ReplaceApostropheWthTelda(this.MiddleName),
      LastName: this.dataService.ReplaceApostropheWthTelda(this.LastName),
      DOB: DOB,
      GenderId: this.ddlGenders,
      PassportNumber: this.dataService.ReplaceApostropheWthTelda(this.PassportNumber),
      IdCardNumber: this.dataService.ReplaceApostropheWthTelda(this.IdCardNumber),
      Culture: Constants.Culture,
      CompanyId: this.CompanyIdService.CompanyId,
      GroupCompanyId: this._config.environment.CompanyGroupID,
      CompanyName: this.CompanyIdService.CompanyName,
      IsImageFromLinkedin: true,
      LinkedInImagePath: this.LinkedInProfilePicUri
    }

    debugger;
    let saveUser = this._config.environment.baseUrl + Constants.LinkedInLogin;
    this.PostLoginData(this.LinkedInReponseObject, saveUser, { headers: this.dataService.headers });
    

    //do create account of linkedIn and redirect to login - myCode will be used

    //let RequestObject = {
    //  Email: this.dataService.ReplaceApostropheWthTelda(this.Email),
    //  Password: this.Password,
    //  ConfirmPassword: this.ConfirmPassword,
    //  FirstName: this.dataService.ReplaceApostropheWthTelda(this.FirstName),
    //  MiddleName: this.dataService.ReplaceApostropheWthTelda(this.MiddleName),
    //  LastName: this.dataService.ReplaceApostropheWthTelda(this.LastName),
    //  DOB: DOB,
    //  GenderId: this.ddlGenders,
    //  PassportNumber: this.dataService.ReplaceApostropheWthTelda(this.PassportNumber),
    //  IdCardNumber: this.dataService.ReplaceApostropheWthTelda(this.IdCardNumber),
    //  Culture: Constants.Culture,
    //  CompanyId: this.CompanyIdService.CompanyId,
    //  GroupCompanyId: this._config.environment.CompanyGroupID,
    //  CompanyName: this.CompanyIdService.CompanyName        
    //}
    

    //this.openSpinner();
    //let saveUser = this._config.environment.baseUrl + Constants.SaveUser;
    //this.PostData(RequestObject, saveUser, { headers: this.dataService.headers });
   
     
  }



  public PostData(model, url: string, headers: any) {
    const retVal = this.http.post(url, model, headers)
      .subscribe((response: any) => {
        debugger;
        this.LinkMsgGenerate = "";
        this.LinkMsgGenerate1 = "";
        if (response.Valid == false || response.isValid == false) {
          if (!isNullOrUndefined(response) && response.isValidationForGenerateLink == false) {
            this.RestrictMsg = response.Message;

            $("#myModalSingupErr").modal("show");
          }
        }
        if (response.Valid == false || response.isValid == false) {
          if (!isNullOrUndefined(response) && response.isValidationForGenerateLink == true) {
            this.generateLink = true;
            this.RestrictMsg1 = response.Message;
            //  console.log("RestrictMsg111", this.RestrictMsg1);
            debugger;
            this.genLink1 = this.RestrictMsg1.split('.');
            this.genLink12 = this.genLink1[0];
            this.genLink13 = this.genLink1[1].split('to');
            this.genLink14 = this.genLink13[0];
            this.genLink15 = " to " + this.genLink13[1];          
            let GuidID = response.GuidID;
            localStorage.setItem('GuidID', GuidID);
            $("#myModalSingupErr").modal("show");

          }
        }

        this.HideSpinner();
        if (response.Valid == true || response.isValid == true) {

          let msgs = response.Message.split('<br/>');
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
      }, (error: any) => {
        alert(error.error.Message);
      });
  }

  emptyPopup() {
    this.RestrictMsg = "";
    this.RestrictMsg1 = "";
    this.RestrictMsg2 = "";
    this.genLink1 = "";
    this.genLink12 = "";
    this.genLink13 = "";
    this.genLink14 = "";
    this.genLink15 = "";
  }
   
}
