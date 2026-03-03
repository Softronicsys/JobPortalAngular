import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { Constants } from '../../Helper/Constant';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
declare var $: any;
import { DataService } from '@app/Shared/Services/data.services';


@Component({
  selector: 'app-pin-code',
  templateUrl: './pin-code.component.html',
  styleUrls: ['./pin-code.component.css']
})
export class PinCodeComponent implements OnInit {

    PinCode: string = "";
    DisconnectInternet: boolean = false;
    isMandatoryfields: boolean = false;


    BackgroundImage: string = "";
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    WrongUrl: boolean = true;

    res: any;
    check: string = "False"

    constructor(private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private objRouter: Router, private spinner: NgxSpinnerService,
        public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService, private dataService: DataService) {

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


    forgotPasswordSubmitPin() {
        debugger;
        if (navigator.onLine) {

            if (this.PinCode == "") {
                this.isMandatoryfields = true;
            } else {
                let RequestObject = {
                    PinCode: this.PinCode,
                    Email: localStorage.getItem('Email'),
                    CompanyId: this.CompanyIdService.CompanyId,
                }
                this.openSpinner();
                let forgotPassSubmitPin = this._config.environment.baseUrl + Constants.ForgotPassSubmitPin;
                this.PostData(RequestObject, forgotPassSubmitPin, { headers: this.dataService.headers });
            }
        }
        else {

            this.DisconnectInternet = true;
        }
    }


    cancel() {
        localStorage.removeItem('Email')
        this.objRouter.navigate(['forget-password']);
    }


    // For labels //

    lblPinCodeHeading: string = "We have emailed you a Pin Code on email address you have just entered. If you can't find the email, please check your spam or junk folder and enter Pin Code in the text box below.";
    lblPinCode: string = "Pin Code";
    lblConfirm: string = "Confirm";
    Cancel: string = "Cancel";

    getHomeLabels() {
        debugger;
        if (this.Labels.dashLabels == true) {
          if (this.Labels.lblPinCodeHeading != "" && !isNullOrUndefined(this.Labels.lblPinCodeHeading))
            this.lblPinCodeHeading = this.Labels.lblPinCodeHeading;

          if (this.Labels.lblPinCode != "" && !isNullOrUndefined(this.Labels.lblPinCode))
            this.lblPinCode = this.Labels.lblPinCode;

          if (this.Labels.lblConfirm != "" && !isNullOrUndefined(this.Labels.lblConfirm))
            this.lblConfirm = this.Labels.lblConfirm;

          if (this.Labels.Cancel != "" && !isNullOrUndefined(this.Labels.Cancel))
            this.Cancel = this.Labels.Cancel;
        }
    }




    iserrorMsg: boolean = false;
    errorMsg: string = "";

    public PostData(model, url: string,headers:any) {

        debugger;
        const retVal = this.http.post(url, model,headers)
            .subscribe((response: any) => {
                debugger;
                this.HideSpinner();
                console.log(response);
                if (!isNullOrUndefined(response) && response.IsValid == true && response.Result == "2") {
                    this.objRouter.navigate(['Change-Password']);
                    this.HideSpinner();
                }
                if (!isNullOrUndefined(response) && response.IsValid == false && response.Result == "0") {
                    this.iserrorMsg = true;
                    this.errorMsg = response.Message;
                }
                if (!isNullOrUndefined(response) && response.IsValid == false && response.Result == "1") {
                    this.iserrorMsg = true;
                    this.errorMsg = response.Message;
                }
               
            }, error => {
                this.HideSpinner();
                console.log(error);
            }
            );
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
    BorderColor: string = "";
    DefaultBorderColor: string = "";
    // this.BackgroundImage = "../../../assets/images/" + this.code + "/general.PNG";

    Color() {
        debugger;
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
            this.HideSpinner();
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

                this.ClrThemeChng.ChangeTheme = response.ThemeColor;
                this.Color();
                this.HideSpinner();

            })
    }



    ngOnInit() {
        this.getCompanyParameter();
       

  }

}
