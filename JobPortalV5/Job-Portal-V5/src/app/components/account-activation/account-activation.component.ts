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
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {

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
    isLogin: boolean = false;
    msg: string = "";
    showLink: boolean = false;
    LinkMsg1: string = "";
    LinkMsg2: string = "";
    WrongUrl: boolean = true;

    IsCTC: boolean = false;
    ctcRedirectDone: boolean = false;

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
        debugger;
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
                    debugger;


                    // CTC case: only redirect when user is already active and URL has isctc=1
                    if (this.IsCTC == true && this.ctcRedirectDone == false) {
                        this.ctcRedirectDone = true;

                        this.UserName = response.UserName;
                        localStorage.setItem('UserName', response.UserName);

                        this.PersonalInfoForCTC();
                        return;
                    }

                    this.registered = true;
                    this.Color();
                    this.ViewProfile = false;
                    this.wrong = false;
                    this.regenerateLink = false;
                    this.NameCompany1 = localStorage.getItem("CompanyName");
                    this.NameCompany = this.NameCompany1; 

                }
                if (response.IsAccountCreated == false && response.IsValid == false && response.IsViewProfile == false ) {
               
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
                if (this.RegType == "2")
                {
                  if (response.Message == "Your account has been successfully activated. Please complete your profile by clicking on the button below.") {
                    this.PersonalInfo();
                  }
                }
                

          }, (error: any) => {
              console.log(error);
          });
    }


    // get Labels //

    lblDear: string = "Dear";
    lblAccountActivation: string = "Account Activation";
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

                    if (this.RegType && this.RegType == "2")
                    {
                      this.objRouter.navigate(["MyProfile", { showPersonalInfo: false, RegType: this.RegType, JobCode: this.JobCode }]);
                    }
                    else
                    {
                      this.objRouter.navigate(["MyProfile", { showPersonalInfo: true }]);
                    }
                     
                } 
            }, (error: any) => {
                console.log(error);
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
        console.log('AccountActivationComponent loaded');

        this.activatedRoute.queryParams.subscribe(params => {
            debugger;
            this.key = params['g'];

            if (params['rt']) {
                this.RegType = params['rt'];
            }

            if (params['jc']) {
                this.JobCode = params['jc'];
            }

            this.IsCTC = params['isctc'] == '1';

            console.log('Guid:', this.key);
            console.log('IsCTC:', this.IsCTC);

            this.getCompanyParameter();
        });
    }

  //  ngOnInit() {
  //      debugger;

  //    this.activatedRoute.queryParams.subscribe(params => {
  //      debugger;
  //        this.key = params['g'];
  //        if (params['rt'])
  //        {
  //          this.RegType = params['rt'];
  //        }

  //        if (params['jc']) {
  //          this.JobCode = params['jc'];
  //        }

  //        // CTC link case
  //        this.IsCTC = params['isctc'] == '1';


  //        console.log(this.RegType);
  //        console.log(this.JobCode);
  //        console.log('IsCTC:', this.IsCTC);

  //        //alert(this.Activationype);
  //        this.getCompanyParameter();

  //    });

      
  //      //localStorage.getItem('UserName');

  //}


    PersonalInfoForCTC() {
        debugger;
        let RequestObject = {
            Guid: this.key,
            CompanyId: this.CompanyIdService.CompanyId,
        };

        this.openSpinner();

        let personalInfo = this._config.environment.baseUrl + Constants.PersonalInfo;

        this.http.post(personalInfo, RequestObject, { headers: this.dataService.headers })
            .subscribe((response: any) => {
                this.personalInformation = response;
                this.HideSpinner();

                if (!isNullOrUndefined(response) && response.IsValid == true) {
                    this.StoreAccessToken(response);

                    localStorage.setItem('Email', response.Email);
                    localStorage.setItem('AppId', response.AppId);

                    var str = this._config.environment.CompanyGroupID + "," +
                        this.CompanyIdService.CompanyId + "," +
                        "false" + "," +
                        response.AppId + "," +
                        response.Email + "," +
                        this.UserName + ",";

                    localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));

                    localStorage.setItem(
                        "LastLoginId",
                        this.CompanyIdService.CompanyId + "," + this._config.environment.CompanyGroupID
                    );

                    // Redirect to MyProfile and tell dashboard to open CTC tab

                    sessionStorage.setItem('OpenApplicantPackageTab', '1');

                    this.objRouter.navigateByUrl('/MyProfile', { replaceUrl: true });
                    //this.objRouter.navigate([
                    //    "MyProfile",
                    //    {
                    //        showPersonalInfo: false,
                    //        isctc: 1
                    //    }
                    //]);
                }

            }, (error: any) => {
                console.log(error);
                this.HideSpinner();
            });
    }
}
