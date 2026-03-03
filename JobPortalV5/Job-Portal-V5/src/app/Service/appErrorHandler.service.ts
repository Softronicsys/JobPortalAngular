import { ErrorHandler, Injectable, EventEmitter } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { DataService } from '@app/Shared/Services/data.services';
import { Router } from '@angular/router';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { appErrorPopup } from '@app/Shared/appErrorPopup/appErrorPopup.component.ts';
import { GetCompanyParameter } from '@app/Service/CompanyParameter.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
declare var $: any;

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(
    private _config: AppConfigService,
    private _userService: DataService,
    public CompanyIdService: GetCompanyParameter, private http: HttpClient
  ) { }
  //errorOccured = new EventEmitter<boolean>();
  //objApperror: appErrorPopup = new appErrorPopup();
  Errors: any = {
    ErrorCode: '',
    Error: '',
    FormName: '',
    FunctionName: '',
    ErrorDescription: '',
    Terminal: '',
    CompanyName: "",
    UserID: localStorage.getItem("Email") ? localStorage.getItem("Email") : ""
  };

  handleError(error) {
    this.Errors.CompanyName = this.CompanyIdService.CompanyName;
    this.Errors.UserID = localStorage.getItem("Email") ? localStorage.getItem("Email") : "";
    //console.log('Company services are: ', this.CompanyIdService);
    
    if (this._config.environment.baseUrl.indexOf('localhost') < 0) {      
      this.Errors.FormName = window.location.href;
      if (error._body != null && error._body != '' && error._body != undefined) {
        if (error.status != '417') {
          return;
        }

        this.Errors.ErrorCode = error.status;
        this.Errors.Error = error.statusText;
        this.Errors.FunctionName = error.url;
        this.Errors.ErrorDescription = error._body;

      }
      else {

        if (error.stack == undefined || error.stack == null || error.stack == '') {
          return;
        }
        //if (error.stack.indexOf('412') != -1 || error.stack.indexOf('409') != -1 || error.stack.indexOf('401')!=-1) {
        //    return;
        //}
        if (error.stack.indexOf('onreadystatechange') != -1) {
            return;
        }

        var _POSError = "Cannot read property 'pos' of undefined";
        var _POSError2 = "Unable to get property 'pos' of undefined or null reference";

        if (error.message.toLowerCase().indexOf("'pos' of undefined") > 0) {
          return;
        }
        if (error.message == 'Syntax Error: Maximum call stack size exceeded') {
          return;
        }
        this.Errors.ErrorCode = -1;
        this.Errors.Error = "Syntax Error: " + error.message;
        this.Errors.FunctionName = "N/A";
        this.Errors.ErrorDescription = error.stack;

      }
      //this.errorOccured.emit(true);
      console.log("Eroor: ", error);
      console.log("Eroor Logged: ", this.Errors);
      this.http.post(this._config.environment.baseUrl + 'ErrorHandler', this.Errors)
        .subscribe((response: any) => {
          //$('#ConfirmBox').modal('show');
        }); 
    }
    else {
      console.log("Eroor: ", error);
      $('#ConfirmBox').modal('show');
    }
  }
}
