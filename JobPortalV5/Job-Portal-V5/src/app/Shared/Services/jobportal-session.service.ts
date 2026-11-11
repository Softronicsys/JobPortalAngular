import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { AppConfigService } from '@app/Service/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class JobPortalSessionService {
    private refreshHttp: HttpClient;
    private refreshRequest: Observable<any>;

    constructor(handler: HttpBackend, private _config: AppConfigService) {
        this.refreshHttp = new HttpClient(handler);
    }

    refreshAccessToken(sourceUrl?: string): Observable<any> {
        if (this.refreshRequest) {
            return this.refreshRequest;
        }

        var refreshUrl = this.getRefreshUrl(sourceUrl);
        this.refreshRequest = this.refreshHttp.post<any>(refreshUrl, {}, {
            withCredentials: true
        }).pipe(
            map((response) => {
                if (response && response.AccessToken) {
                    localStorage.setItem('AccessToken', response.AccessToken);
                    localStorage.setItem('AccessTokenExpiresUtc', response.AccessTokenExpiresUtc || '');
                    this.storeApplicantContext(response);
                }
                return response;
            }),
            finalize(() => {
                this.refreshRequest = null;
            }),
            shareReplay(1)
        );

        return this.refreshRequest;
    }

    private getRefreshUrl(sourceUrl?: string): string {
        if (sourceUrl) {
            var url = new URL(sourceUrl, window.location.origin);
            return url.href.substring(0, url.href.lastIndexOf('/') + 1) + 'Auth/Refresh';
        }

        return this._config.environment.baseUrl + 'Auth/Refresh';
    }

    private storeApplicantContext(response: any) {
        if (!response || !response.AppId || !response.CompanyId || !response.Email) {
            return;
        }

        var groupCompanyId = this._config.environment.CompanyGroupID;
        var userName = response.UserName || response.Email;
        var loginValue = groupCompanyId + ',' +
            response.CompanyId + ',' +
            'false' + ',' +
            response.AppId + ',' +
            response.Email + ',' +
            userName;

        localStorage.setItem(groupCompanyId, loginValue);
        localStorage.setItem('LastLoginId', response.CompanyId + ',' + groupCompanyId);
        localStorage.setItem('AppId', response.AppId);
        localStorage.setItem('Email', response.Email);
        localStorage.setItem('UserName', userName);
    }
}
