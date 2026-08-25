import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Constants } from '../../../Helper/Constant';
import { ThemeColorService } from '../../../Service/ThemeColor.service';
import { GetCompanyParameter } from '../../../Service/CompanyParameter.service';
import { isNullOrUndefined } from 'util';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
import { DataService } from '@app/Shared/Services/data.services';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    // for backgrouud color // 

    BackgroundImage: string = "";
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    WrongUrl: boolean = true;

    showButton: boolean = false;
    btnLogin: string = "SIGN IN";
    btnSignUp: string = "SIGN UP";
    btnAboutUs: string = "ABOUT US";
    lnkAboutUs: string = ""; 

    @Input()
    hideHomeButton: boolean = true;
    @Input()
    hideSignupButton: boolean = true;

    constructor(public sanitizer: DomSanitizer, private Labels: Labels, private _config: AppConfigService, public CompanyIdService: GetCompanyParameter,
        public ClrThemeChng: ThemeColorService, private http: HttpClient, private dataService: DataService) {
        //if (!isNullOrUndefined(localStorage.getItem('GroupId'))) {
        //    this._config.environment.CompanyGroupID = localStorage.getItem('GroupId');
        //}
        //if (isNullOrUndefined(localStorage.getItem('GroupId'))) {
        //    //alert("Use correct URL or Adress of the page")
        //    $("#myModalWrongURL").modal("toggle");
        //    this.WrongUrl = false;
        //}
      this.lnkAboutUs = this._config.environment.CompanyAboutUs;
      
    }


    ngOnInit() {
        //this.getBrowserName();
        this.getCompanyParameter();

    }

    public getSantizeUrl(url: string) {
        if (isNullOrUndefined(url) || url === '') {
            return null;
        }
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    forChanges: any;
    breakcode: any;
    code: any;


    emptyIDandCode() {
        let logoutUrl = this._config.environment.baseUrl + 'Auth/Logout';
        this.dataService.post(logoutUrl, {}).subscribe(() => { }, () => { });

        localStorage.removeItem("JobCode");
        localStorage.removeItem("CompanyID");
        localStorage.removeItem("showMessage");
        localStorage.removeItem('Email')
        localStorage.removeItem('UserName')
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("AccessTokenExpiresUtc");
        this.dataService.PassHeader();
    }

    // Get browser name for header validation.

    isValidationForBrowser: boolean = false;
    getBrowserName() {
        
        const agent = window.navigator.userAgent.toLowerCase()
        switch (true) {
            case agent.indexOf('edge') > -1:
                this.isValidationForBrowser = true;
                return 'edge';
            case agent.indexOf('opr') > -1 && !!(<any>window).opr:
                this.isValidationForBrowser = true;
                return 'opera';
            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
                this.isValidationForBrowser = false;
                return 'chrome';               
            case agent.indexOf('trident') > -1:
                this.isValidationForBrowser = true;
                return 'ie';
            case agent.indexOf('firefox') > -1:
                this.isValidationForBrowser = true;
                return 'firefox';
            case agent.indexOf('safari') > -1:
                this.isValidationForBrowser = true;
                return 'safari';
            default:
                return 'other';
        }
    }



    //  this.BackgroundImage = "../../../assets/images/" + this.code + "/home.PNG";

    Color() {
        
        this.forChanges = this.ClrThemeChng.ChangeTheme;
        this.breakcode = this.forChanges.split('#');
        this.code = this.breakcode[1];

        if (isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.BackgroundImage = "assets/images/" + Constants.default + "/home.png";
        }
        else if (!isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
            this.ThemeFontColor = this.forChanges;
            this.BackgroundImage = "assets/images/" + this.code + "/home.png";
        }
    }
   

    getHomeLabels() {

        if (isNullOrUndefined(localStorage.getItem('CheckForAllBtn'))) {
            this.showButton = true;
        }
        if (this.Labels.dashLabels == true) {
          if (this.Labels.btnLogin != "" && !isNullOrUndefined(this.Labels.btnLogin))
            this.btnLogin = this.Labels.btnLogin;
          if (this.Labels.btnSignUp != "" && !isNullOrUndefined(this.Labels.btnSignUp))
            this.btnSignUp = this.Labels.btnSignUp;
        }
    }


    ChangeTheme: any;

    getJobPortalConfiguration() {

        
        let RequestObject = {

            CompanyId: this.CompanyIdService.CompanyId,
        };
        let getJobPortalConfiguration = this._config.environment.baseUrl + Constants.GetJobPortalConfiguration;
        this.http.post(getJobPortalConfiguration, RequestObject, { headers: this.dataService.headers })
            // this.PostData(RequestObject, "https://jobportalapi.azurewebsites.net/GetJobPortalConfiguration")
            .subscribe((response: any) => {
                
                this.ClrThemeChng.ChangeTheme = response.ThemeColor;

                this.Color();

            })
    }

    islogo: any;


    getCompanyParameter() {
      //alert(this._config.environment.CompanyGroupID)
      //alert(Constants.Culture)
        let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
        this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
          //alert(response.CompanyId)
            if (response.CompanyId == 0) {
                this.WrongUrl = false;
            }

            this.CompanyIdService.CompanyId = response.CompanyId;
            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64 || '';
            this.islogo = response.CompanyLogoBase64;

            this.getJobPortalConfiguration();
            this.getHomeLabels();
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



}
