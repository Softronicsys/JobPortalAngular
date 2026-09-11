import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { AppConfigService } from '@app/Service/app-config.service';


@Injectable()
export class Security implements CanActivate {
    staySignedIn: any;


    constructor(private _router: Router, private _config: AppConfigService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   
   //     let email: string = localStorage.getItem("Email");
   //     let appId: string = localStorage.getItem("AppId");
         

        let lastLoginId = localStorage.getItem("LastLoginId");
        if (isNullOrUndefined(lastLoginId) || lastLoginId == '' || lastLoginId.split(",").length < 2) {
            this._router.navigate(['/login']);
            return false;
        }

        this._config.environment.CompanyGroupID = lastLoginId.split(",")[1];
        let companyLogin = localStorage.getItem(this._config.environment.CompanyGroupID);
        if (isNullOrUndefined(companyLogin) || companyLogin == '') {
            this._router.navigate(['/login']);
            return false;
        }

        let loginParts = companyLogin.split(',');
        let appId: string = loginParts[3];
        let email: string = loginParts[4];
        let username: string = loginParts[5];
        let accessToken: string = localStorage.getItem("AccessToken");

        localStorage.setItem('UserName', username);
        localStorage.setItem('Email', email);
        localStorage.setItem('AppId', appId);

    //    let DisplayId: string = localStorage.getItem("DisplayId");

        //let staySignedIn: string = localStorage.getItem("StaySignedIn");

        //if (this.staySignedIn == "true") {
        //    this._router.navigate(['/dashboard'])
        //}

        if (!isNullOrUndefined(email) && email != '' && !isNullOrUndefined(appId) && appId != '' && !isNullOrUndefined(accessToken) && accessToken != '') {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }


}

