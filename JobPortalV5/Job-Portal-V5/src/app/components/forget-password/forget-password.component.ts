import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { Constants } from '../../Helper/Constant';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DataService } from '@app/Shared/Services/data.services';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

    Email: string = "";

    public responseData;
    DisconnectInternet: boolean = false;
    isMandatoryfields: boolean = false;

    // for backgrouud color // 

    BackgroundImage: string = "";
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    WrongUrl: boolean = true;
    CompGroupIdKey: string = "";

    res: any;
    check: string = "False"


    constructor(private activatedRoute: ActivatedRoute, private Labels: Labels, private _config: AppConfigService, private http: HttpClient,
        private objRouter: Router, private toastr: ToastrService, private spinner: NgxSpinnerService, public CompanyIdService: GetCompanyParameter,
        public ClrThemeChng: ThemeColorService, private dataService: DataService) {

      //if (localStorage.length > 0) {
      //  let groupid = localStorage.getItem("LastLoginId").split(",")[1];
      //  var ArrayLoginId = localStorage.getItem(groupid).split(',')[1];
      //  var LastLoginId = localStorage.getItem("LastLoginId").split(",")[0];
      //  var lenghtOfCheck = localStorage.getItem(groupid).split(',')[2].length;


      //  if (LastLoginId == ArrayLoginId) {
      //    var lenghtOfGroupId = localStorage.getItem(groupid).split(',')[0].length;
      //    this.check = localStorage.getItem(groupid).split(',')[2].slice(0, lenghtOfCheck);
      //    this._config.environment.CompanyGroupID = localStorage.getItem(groupid).split(',')[0].slice(1, lenghtOfGroupId);
      //    if (this.check == "true") {
      //      this.WrongUrl = false;
      //    }
      //    return;
      //  }
      //}

      //if (localStorage.length < 0) {
      //  $("#myModalWrongURL").modal("toggle");
      //  this.WrongUrl = false;
      //}
           
    }

    btnPost1_Click() {
        debugger;
        if (navigator.onLine) {
            if (this.Email == "") {
                this.isMandatoryfields = true;
            } else {
                localStorage.setItem('Email', this.Email);
                let RequestObject = {

                    ApplicantEmail: this.Email,
                    Culture: Constants.Culture,
                    CompanyId: this.CompanyIdService.CompanyId,
                    //RedirectURL: this.CompanyIdService.RedirectPath,
                    //FromEmail: Constants.FromEmail,
                    LinkExpiryTime: Constants.LinkExpiryTime,
                }
                this.isMandatoryfields = false;
                this.openSpinner();
                let forgotPassword = this._config.environment.baseUrl + Constants.ForgotPassword;
                this.PostData(RequestObject, forgotPassword, { headers: this.dataService.headers });
                //  this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/ForgotPassword");
            }
    }
        else {
    
    this.DisconnectInternet = true;
}

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


    // For labels //

    lblPleaseEnterYourEmailAddress: string = "Please Enter Your Email Address";
    lblVerifyEmail: string = "Verify Email";

    getHomeLabels() {
        debugger;
        if (this.Labels.dashLabels == true) {
          if (this.Labels.lblPleaseEnterYourEmailAddress != "" && !isNullOrUndefined(this.Labels.lblPleaseEnterYourEmailAddress))
            this.lblPleaseEnterYourEmailAddress = this.Labels.lblPleaseEnterYourEmailAddress;

          if (this.Labels.lblVerifyEmail != "" && !isNullOrUndefined(this.Labels.lblVerifyEmail))
            this.lblVerifyEmail = this.Labels.lblVerifyEmail;
        }
    }



    errorMsg: string = "";
    iserrorMsg : boolean = false

    public PostData(model, url: string,headers: any) {

        const retVal = this.http.post(url, model, headers)
            .subscribe((response: any) => {
                debugger;
                console.log(response);
                this.HideSpinner();
                if (!isNullOrUndefined(response) && response.IsValid == false && response.isEmailSend == false) {
                    this.iserrorMsg = true;
                    this.errorMsg = response.Message;

                }
                if (!isNullOrUndefined(response) && response.IsValid == true && response.isEmailSend == true) {
                    this.objRouter.navigate(['/pin/code']);
                    localStorage.setItem('Email', this.Email);

                }
            }, error => {
                this.HideSpinner();
                debugger;
                console.log(error);
            }
            );
    }


    forChanges: any;
    breakcode: any;
    code: any;
    //  this.BackgroundImage = "../../../assets/images/" + this.code + "/general.PNG";

    Color() {
        debugger;
        this.forChanges = this.ClrThemeChng.ChangeTheme;
        this.breakcode = this.forChanges.split('#');
        this.code = this.breakcode[1];

        if (isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.BackgroundImage = "assets/images/" + Constants.default + "/general.png";
        }
        else if (!isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
            this.ThemeFontColor = this.forChanges;
            this.BackgroundImage = "assets/images/" + this.code + "/general.png";
        }

        //debugger;
        //if (Constants.Color == "") {
        //    this.DefaultFontColor = "#" + Constants.default;
        //    this.BackgroundImage = "../../../assets/images/" + Constants.default + "/general.png";
        //}
        //else {
        //    if (Constants.Color == "007FFF") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.png";
        //    }
        //    if (Constants.Color == "4059A9") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.PNG";
        //    }
        //    if (Constants.Color == "79C942") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.PNG";
        //    }
        //    if (Constants.Color == "999999") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.PNG";
        //    }
        //    if (Constants.Color == "F47117") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.PNG";
        //    }
        //    if (Constants.Color == "E000B6") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.PNG";
        //    }
        //    if (Constants.Color == "982BBC") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.PNG";
        //    }
        //    if (Constants.Color == "B30111") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.png";
        //    }
        //    if (Constants.Color == "EFC203") {
        //        this.ThemeFontColor = "#" + Constants.Color;
        //        this.BackgroundImage = "../../../assets/images/" + Constants.Color + "/general.PNG";
        //    }

        //}

    }

    getCompanyParameter() {
        this.openSpinner();
        let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
        this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
            if (response.CompanyId == 0) {
                $("#myModalWrongURL").modal("toggle");
                this.WrongUrl = false;
            }

            this.CompanyIdService.CompanyId = response.CompanyId;
            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
            this.getHomeLabels();
            this.getJobPortalConfiguration();
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
                this.HideSpinner();

            })
    }



    ngOnInit() {

        this.getCompanyParameter();
    }

}
