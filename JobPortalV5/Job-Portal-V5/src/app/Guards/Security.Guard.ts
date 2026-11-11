import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { AppConfigService } from '@app/Service/app-config.service';
import { JobPortalSessionService } from '@app/Shared/Services/jobportal-session.service';


@Injectable()
export class Security implements CanActivate {
    staySignedIn: any;


    constructor(private _router: Router, private _config: AppConfigService, private sessionService: JobPortalSessionService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
   
   //     let email: string = localStorage.getItem("Email");
   //     let appId: string = localStorage.getItem("AppId");
         

        let lastLoginId = localStorage.getItem("LastLoginId");
        if (isNullOrUndefined(lastLoginId) || lastLoginId == '' || lastLoginId.split(",").length < 2) {
            return this.tryRefreshBeforeLogin();
        }

        this._config.environment.CompanyGroupID = lastLoginId.split(",")[1];
        let companyLogin = localStorage.getItem(this._config.environment.CompanyGroupID);
        if (isNullOrUndefined(companyLogin) || companyLogin == '') {
            return this.tryRefreshBeforeLogin();
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

        if (!isNullOrUndefined(email) && email != '' && !isNullOrUndefined(appId) && appId != '' && !isNullOrUndefined(accessToken) && accessToken != '' && !this.isAccessTokenExpired()) {
            return true;
        }

        if (!isNullOrUndefined(email) && email != '' && !isNullOrUndefined(appId) && appId != '') {
            return this.sessionService.refreshAccessToken().pipe(
                map((response) => {
                    if (!isNullOrUndefined(response) && !isNullOrUndefined(response.AccessToken) && response.AccessToken != '') {
                        return true;
                    }
                    this._router.navigate(['/login']);
                    return false;
                }),
                catchError(() => {
                    this._router.navigate(['/login']);
                    return of(false);
                })
            );
        }

        this._router.navigate(['/login']);
        return false;
    }

    private tryRefreshBeforeLogin(): Observable<boolean> {
        return this.sessionService.refreshAccessToken().pipe(
            map((response) => {
                if (!isNullOrUndefined(response) && !isNullOrUndefined(response.AccessToken) && response.AccessToken != '') {
                    return true;
                }
                this._router.navigate(['/login']);
                return false;
            }),
            catchError(() => {
                this._router.navigate(['/login']);
                return of(false);
            })
        );
    }

    private isAccessTokenExpired(): boolean {
        let expiresUtc = localStorage.getItem('AccessTokenExpiresUtc');
        if (isNullOrUndefined(expiresUtc) || expiresUtc == '') {
            return false;
        }

        let expires = new Date(expiresUtc).getTime();
        if (isNaN(expires)) {
            return false;
        }

        return expires <= new Date().getTime();
    }

}

