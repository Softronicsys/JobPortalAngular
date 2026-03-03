import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from '../../Helper/Constant';
import { ThemeColorService } from '../../Service/ThemeColor.service'; 
import { isNullOrUndefined } from 'util';
import { GetCompanyParameter } from '../../Service/CompanyParameter.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppConfigService } from '@app/Service/app-config.service';
import { Labels } from '@app/Service/DatabaseLbl.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
import { ActivatedRoute, Router, NavigationEnd, Params, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '@app/Shared/Services/data.services';

@Component({
    selector: 'app-account-success',
    templateUrl: './account-success.component.html',
    styleUrls: ['./account-success.component.css']
})
export class AccountSuccessComponent implements OnInit {

  RegType: string = "1";
  JobCode: "";

  MsgRegEmail: string = "";
  emailForRegLink: string = '';
  compIDForRegLink: string = '';

    // for backgrouud color // 

    BackgroundImage: string = ""; 
    ThemeFontColor: string = "";
    DefaultFontColor: string = "";
    WrongUrl: boolean = true;
    ForShowAccountSuccess: any;
    res: any;
    check: string = "False"


    constructor(private objRouter: Router, public sanitizer: DomSanitizer, private Labels: Labels,
        private _config: AppConfigService, private spinner: NgxSpinnerService, public ClrThemeChng: ThemeColorService,
        public CompanyIdService: GetCompanyParameter, private http: HttpClient, private dataService: DataService, public activatedRoute: ActivatedRoute) {

        //if (localStorage.length > 0) {
        //    debugger;
        //    for (var i = 0; i < localStorage.length; i++) {
        //        var lastloginId = localStorage.getItem("LastLoginId").split(",")[0]
        //        var abc = localStorage.key(i);
        //        var CompanyIdForCamparison = localStorage.getItem(abc).split(',')[1];
        //        if (lastloginId === CompanyIdForCamparison) {
        //            var abc = localStorage.key(i);
        //            var lenghtOfGroupId = localStorage.getItem(abc).split(',')[0].length;
        //            var lenghtOfCheck = localStorage.getItem(abc).split(',')[2].length;
        //            this.res = localStorage.getItem(abc).split(',')[0].slice(1, lenghtOfGroupId);

        //            this.check = localStorage.getItem(abc).split(',')[2].slice(0, lenghtOfCheck);
        //            this._config.environment.CompanyGroupID = localStorage.getItem(abc).split(',')[0].slice(1, lenghtOfGroupId);
        //            return;
                   
        //        }
        //    }

        //} else {
        //    $("#myModalWrongURL").modal("toggle");
        //    this.WrongUrl = false;
        //}



        //localStorage.getItem('ForShowAccountSuccess');

        // For show account Success
      debugger;

      //Get apply on signup data
      let regtype = this.activatedRoute.snapshot.params.RegType;
      let jobcode = this.activatedRoute.snapshot.params.JobCode;
      if (!isNullOrUndefined(regtype) && !isNullOrUndefined(jobcode)) {
        this.RegType = regtype;
        this.JobCode = jobcode;                
      }

        if (!isNullOrUndefined(localStorage.getItem("ForShowAccountSuccess"))) {
            this.objRouter.navigate(['/account-success']);
        } else {
            this.objRouter.navigate(['/login']);
        }

    }

    ngOnInit() {             
      this.emailForRegLink = localStorage.getItem('emailForRegLink');
      this.compIDForRegLink = localStorage.getItem('compIDForRegLink');

        this.forChanges = this.ClrThemeChng.ChangeTheme;
        this.ShowMsg();
        this.getCompanyParameter();

        localStorage.removeItem("msg1");
        localStorage.removeItem("msg2");
        localStorage.removeItem("msg");


    }

    forChanges: any;
    breakcode: any;
    code: any;

    Color() {
        debugger;
        this.forChanges = this.ClrThemeChng.ChangeTheme;

        if (isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
            this.DefaultFontColor = "#" + Constants.default;
            this.BackgroundImage = "assets/images/" + Constants.default + "/success.png";
        }
        else if (!isNullOrUndefined(this.ClrThemeChng.ChangeTheme)) {
          this.breakcode = this.forChanges.split('#');
          this.code = this.breakcode[1];
            this.ThemeFontColor = this.forChanges;
            this.BackgroundImage = "assets/images/" + this.code + "/success.png";
        }

    }

    ResendActivaionEmail() {
      this.openSpinner();
      this.ReGenerateLink();
    }

    ReGenerateLink() {
      debugger;

      $("#myModalSingupErr").modal("hide");

      let RequestObject = {
        CompanyId: this.compIDForRegLink,
        FromEmail: this.emailForRegLink,
        RegType: this.RegType,
        JobCode: this.JobCode
      }

      let generateNewLink = this._config.environment.baseUrl + Constants.ReGenerateEmailLink;
      this.http.post(generateNewLink, RequestObject, { headers: this.dataService.headers })
        .subscribe((response: any) => {
          console.log('response : ', response);

          this.HideSpinner();
          debugger;
          if (!isNullOrUndefined(response) && response.Valid == true) {

            this.MsgRegEmail = "Registration email has been sent on " + this.emailForRegLink + ".<br/>Please check your email.<br/>If you can't find the email, please check your spam or junk folder.";

            $("#myModalSingupErr").modal("show");

          }
          else {
            this.MsgRegEmail = "Email sending failed! Please try again."
            $("#myModalSingupErr").modal("show");
          }
        }, (error: any) => {
          console.log(error);
        });
    }


    public getSantizeUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    // get Labels //

    lblThankYou: string = "Thank You";



    getHomeLabels() {
        debugger;
        if (this.Labels.dashLabels == true) {
            this.lblThankYou = this.Labels.lblThankYou;
        }
    }



    getCompanyParameter() {

        debugger;
        let getCompanyParameter = this._config.environment.baseUrl + Constants.GetCompanyParameter + "?GroupCompanyId=" + this._config.environment.CompanyGroupID + "&Culture=" + Constants.Culture;
        this.http.get(getCompanyParameter, { headers: this.dataService.headers }).subscribe((response: any) => {
            this.CompanyIdService.CompanyId = response.CompanyId;
            this.CompanyIdService.CompanyName = response.CompanyName;
            this.CompanyIdService.RedirectPath = response.RedirectPath;
            this.CompanyIdService.CompanyLogoBase64 = response.CompanyLogoBase64;
            this.getHomeLabels();
            localStorage.removeItem('ForShowAccountSuccess');

        });


    }

    openSpinner() {
      this.spinner.show();
    }


    HideSpinner() {
      this.spinner.hide();
    }




    successMsg: string = "";
    successMsg1: string = "";
    successMsg2: string = "";


    ShowMsg() {
        debugger;
        this.successMsg = localStorage.getItem("msg");
        this.successMsg1 = localStorage.getItem("msg1");
        this.successMsg2 = localStorage.getItem("msg2");
        this.Color();

    }



}
