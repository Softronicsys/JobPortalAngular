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
         

        this._config.environment.CompanyGroupID = localStorage.getItem("LastLoginId").split(",")[1];
        let appId: string = localStorage.getItem(this._config.environment.CompanyGroupID).split(',')[3];
        let email: string = localStorage.getItem(this._config.environment.CompanyGroupID).split(',')[4];
        let username: string = localStorage.getItem(this._config.environment.CompanyGroupID).split(',')[5];

        localStorage.setItem('UserName', username);
        localStorage.setItem('Email', email);
        localStorage.setItem('AppId', appId);

    //    let DisplayId: string = localStorage.getItem("DisplayId");

        //let staySignedIn: string = localStorage.getItem("StaySignedIn");

        //if (this.staySignedIn == "true") {
        //    this._router.navigate(['/dashboard'])
        //}

        if (!isNullOrUndefined(email) && email != '' && !isNullOrUndefined(appId) && appId != '') {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }


}

