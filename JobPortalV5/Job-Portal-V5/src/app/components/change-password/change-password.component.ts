import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { Constants } from '../../Helper/Constant';
import { ThemeColorService } from '../../Service/ThemeColor.service';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DataService } from '@app/Shared/Services/data.services';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    confirmPassword: string = "";
    newPassword: string = "";
    key1: any;
    key2: any;
    message: string = "";
    ShowMessage: boolean = true;
    isMandatoryfields: boolean = false;
    DisconnectInternet: boolean = false;
    errorMessage: boolean = false;

    // for backgrouud color // 

    BackgroundImage: string = "";
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    tickImage: string = "";
    Email: string = "";
    notAppropriate: boolean = false;
    WrongUrl: boolean = true;
    CompGroupIdKey: string = "";


    constructor(private Labels: Labels, private _config: AppConfigService, private http: HttpClient, private objRouter: Router
        , private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService, private toastr: ToastrService,
        public CompanyIdService: GetCompanyParameter, public ClrThemeChng: ThemeColorService, private dataService: DataService) {

        this.activatedRoute.queryParams.subscribe(params => {
            debugger;        
            if (!isNullOrUndefined(params.p)) {
                this.key1 = params['e'];
                this.Email = this.key1;
                localStorage.setItem('Email', this.Email)
                this.key2 = params['p'];
            }

            //if (!isNullOrUndefined(params.id)) {
            //    this.CompGroupIdKey = params['id'];
                
            //    this._config.environment.CompanyGroupID = this.CompGroupIdKey;
            //}
             
        });

        this.Email = localStorage.getItem('Email');
    }

    forgotPasswordChangePassword() {
        debugger;
        if (navigator.onLine) {
            debugger;
            if (this.Email == null || this.Email == '') {
                this.notAppropriate = true;
                this.errorMessage = false;
                this.isMandatoryfields = false;
                return;
            }
            if (this.confirmPassword !== this.newPassword) {
                this.errorMessage = true;
                this.isMandatoryfields = false;
                this.notAppropriate = false;
                return;
            }
            if (this.confirmPassword == "" || this.newPassword == "") {
                this.isMandatoryfields = true;
                this.errorMessage = false;
                this.notAppropriate = false;
                return;
            
        } else {
                let RequestObject = {
                Email: this.Email,
                NewPassword: this.newPassword,
                ConfirmPassword: this.confirmPassword,
                CompanyId: this.CompanyIdService.CompanyId,
            }
            this.isMandatoryfields = false;
            this.errorMessage = false;
            this.notAppropriate = false;
            this.openSpinner();
            let forgotPassChangePassword = this._config.environment.baseUrl + Constants.ForgotPassChangePassword;
                this.PostData(RequestObject, forgotPassChangePassword, { headers: this.dataService.headers });
         //   this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/ForgotPassChangePassword");
          
        }
    }
        else {
    
            this.DisconnectInternet = true;
            this.ShowMessage = false;
}
    }
    clickBtn: any;
    ChangePassMsg: string = "";

    forgotPasswordClickBtn(e: any, p: any) {

        let RequestObject = {

            Email: this.key1,
            PinCode: this.key2,
            CompanyId: this.CompanyIdService.CompanyId,

        }
        let forgotPasswordClickBtn = this._config.environment.baseUrl + Constants.ForgotPasswordClickBtn;
        this.http.post(forgotPasswordClickBtn, RequestObject, { headers: this.dataService.headers })
    //    this.http.get("https://jobportalapi.azurewebsites.net/ForgotPasswordClickBtn", RequestObject)
            .subscribe((response: any) => {
                debugger;
                console.log('response : ', response);
                this.clickBtn = response;
                //if (response.IsValid == false) {
                //    $("#myModal1").modal("show");
                //    this.ChangePassMsg = response.Message;

                //}
                
                debugger;
                if (!isNullOrUndefined(response) && response.IsValid == true && response.Result == "2") {
                  //  localStorage.removeItem('Email');
                }
            }, (error: any) => {
                console.log(error);
            });
    }

    removeEmail() {
        this.objRouter.navigate(['/login']);
    }

    removeEmail1() {
        $("#myModal1").modal("hide");
    }

    // For labels //

    lblNewPassword: string = "New Password";
    lblConfirmPassword: string = "Confirm Password";
    lblReset: string = "RESET";

    getHomeLabels() {
        debugger;
        if (this.Labels.dashLabels == true) {
          if (this.Labels.lblNewPassword != "" && !isNullOrUndefined(this.Labels.lblNewPassword))
            this.lblNewPassword = this.Labels.lblNewPassword;

          if (this.Labels.lblConfirmPassword != "" && !isNullOrUndefined(this.Labels.lblConfirmPassword))
            this.lblConfirmPassword = this.Labels.lblConfirmPassword;

          if (this.Labels.lblReset != "" && !isNullOrUndefined(this.Labels.lblReset))
            this.lblReset = this.Labels.lblReset;
        }
    }



    public PostData(model, url: string, headers: any) {

        const retVal = this.http.post(url, model, headers)
            .subscribe((response: any) => {
                debugger;
                this.Color();

                console.log(response);
                if (!isNullOrUndefined(response) && response.IsValid == true) {
                    $("#myModal").modal("show");
                    this.message = response.Message;
                    this.HideSpinner();
                }
                if (response.IsValid == false) {
                    $("#myModal").modal("show");
                    this.errorMessage = true;;
                    this.message = response.Message;
                    this.HideSpinner();
                }
                    
                

            }, error => {
                console.log(error.Message);
            }
            );
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

            if (response.CompanyId != 0) {
                var str = this._config.environment.CompanyGroupID + "," + this.CompanyIdService.CompanyId + "," + "false"+ ",,,,";
                localStorage.setItem(this._config.environment.CompanyGroupID, JSON.stringify(str));
                localStorage.setItem("LastLoginId", response.CompanyId + "," + this._config.environment.CompanyGroupID)
            }

            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
            this.forgotPasswordClickBtn(this.key1, this.key2);
            this.getJobPortalConfiguration();
            this.Color();
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
    // this.BackgroundImage = "../../../assets/images/" + this.code + "/general.PNG";

    Color() {

        debugger;
        this.forChanges = this.ClrThemeChng.ChangeTheme;

        if (isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.BackgroundImage = "assets/images/" + Constants.default + "/general.png";
            this.tickImage = "assets/images/" + Constants.default + "/tick.png";
        }
        else if (!isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {

          this.breakcode = this.forChanges.split('#');
          this.code = this.breakcode[1];
            this.ThemeFontColor = this.forChanges;
            this.BackgroundImage = "assets/images/" + this.code + "/general.png";
            this.tickImage = "assets/images/" + this.code + "/tick.png";
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

    RedirectToLogin() {
      //location.href = "/login";
      $("#myModal").modal("hide");
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
        this.forgotPasswordClickBtn(this.key1, this.key2);

        //this.activatedRoute.queryParams.subscribe(params => {
        //    debugger;
        //  this.key1 = params[' e '];
        //   this.key2 = params['p'];

        //this.forgotPasswordClickBtn(this.key1, this.key2);

  
        //});

        
    }

}
