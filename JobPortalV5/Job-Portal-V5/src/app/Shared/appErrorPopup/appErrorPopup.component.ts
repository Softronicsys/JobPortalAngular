import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { Action } from '@app/Helper/Enums';
import { Constants } from '@app/Helper/Constant'; 
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { UpdateProfileService } from '@app/Service/UpdateProfile.service';
import { GetCompanyParameter } from '@app/Service/CompanyParameter.service';
import { ThemeColorService } from '@app/Service/ThemeColor.service';
import { DataService } from '@app/Shared/Services/data.services';
import { AppConfigService } from '@app/Service/app-config.service';
import { Subject, Observable } from 'rxjs';
import { Labels } from '@app/Service/DatabaseLbl.service';


@Component({
    selector: 'app-appErrorPopup',
    templateUrl: './appErrorPopup.component.html',
    styleUrls: ['./appErrorPopup.component.css']
})
export class appErrorPopup implements OnInit {

    // for international deployement //
    @ViewChild('myname') input;
    IsInternationalDeployment = Constants.IsInternationalDeployment;
    // for declaration //
    @ViewChild('confirmBox') confirmBox: any;
    DisconnectInternet: boolean = false;
    // for spinner //
    isSpinnerPopup: boolean = false;
    isSpinnerPage: boolean = true;
 


    Age: string = "";


    @Output() getApplicantInfo: EventEmitter<any>;

    constructor(private spinner: NgxSpinnerService) {
     
    }

    ClrThemeChng: ThemeColorService

    // Popup for Delete //

    deltId: any;
    deltMedia: any;
    delInsurance: any;
    delFinancial: any;
    delDoc: any;

    ThemeFontColor: string = "";
    DefaultFontColor: string = "";

    ngOnInit() {
      //$('#ConfirmBox').modal('show');
      //this._AppErrorHandler.errorOccured.emit(false);
    }


    Color() {

      let forChanges:any = this.ClrThemeChng.ChangeTheme;

      if (isNullOrUndefined(forChanges)) {
        this.DefaultFontColor = "#" + Constants.default;
      }
      else if (!isNullOrUndefined(forChanges)) {

        let breakcode = forChanges.split('#');
        let code = breakcode[1];
        this.ThemeFontColor = forChanges;
      }
    }
    fnReload() {
      location.reload();
    }
    noClicked() {
      this.spinner.hide();
    }

}
