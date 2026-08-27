import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, observable } from 'rxjs';
import { catchError, retry, map, switchMap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

//import { environment } from '@env/environment';
//import { GeneralPopupService } from './general-popup.service';
//import { SpinnerService } from './spinner.service';

@Injectable()
export class DataService {

    private TimeAlowedForLongProcess: number = 20000;
    public _TokenKey: string;
    public currentFormId = "";
    longProcessRequestObj = {};
    public headers: any;


    constructor(
        private _http: HttpClient
        //private _GeneralPopupService: GeneralPopupService,
        //private _spinnerService: SpinnerService
    ) {
        this.PassHeader();
    }

    PassHeader() {
        this.headers = this.buildHeaders();
    }

    multipartHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        var accessToken = localStorage.getItem('AccessToken');
        if (accessToken) {
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        return headers;
    }


    ReplaceApostropheWthTelda(str: string): string
    {
      if (str != null && !isNullOrUndefined(str) && str != "")
        str = str.replace(/'/gi, '`');

      return str;
    }

    get(url: string, hideSpinner?: boolean): Observable<any> {
        var isConnected = this.isNetworkAvailable();
        if (!isConnected) {
            return;
        }
        let uniqueName = this.generateUniqueName();
        //this.HandleLongProcess(uniqueName);
        //let options = this.getHeaders('login', this._TokenKey);
        let options = this.getHeaders('login');
        return this._http.get<any>(url, options).pipe(
            map((res) => {
                this.clearLongProcessRequest(uniqueName);
                return res;
            }),
            catchError((error) => this.handleAuthError(error, uniqueName, 'GET', url, () => this._http.get<any>(url, this.getHeaders('login'))))
        );
    };

    post(url: string, model: any, hideSpinner?: boolean): Observable<any> {
        var isConnected = this.isNetworkAvailable();
        if (!isConnected) {
            return;
        }
        let uniqueName = this.generateUniqueName();
        //this.HandleLongProcess(uniqueName);
        let body = JSON.stringify(model);
        let options = this.getHeaders('login');
        return this._http.post<any>(url, body, options).pipe(
            map((res) => {
                this.clearLongProcessRequest(uniqueName);
                return res;
            }),
            catchError((error) => this.handleAuthError(error, uniqueName, 'POST', url, () => this._http.post<any>(url, body, this.getHeaders('login'))))
        );
    };

    put(url: string, id: number, model: any, hideSpinner?: boolean): Observable<any> {
        var isConnected = this.isNetworkAvailable();
        if (!isConnected) {
            return;
        }
        let uniqueName = this.generateUniqueName();
        //this.HandleLongProcess(uniqueName);
        let body = JSON.stringify(model);
       // let options = this.getHeaders('login');
        let options = this.getHeaders('login');
        return this._http.put<any>(url + '/' + id, body, options).pipe(
            map((res) => {
                this.clearLongProcessRequest(uniqueName);
                return res;
            }),
            catchError((error) => this.handleAuthError(error, uniqueName, 'PUT', url, () => this._http.put<any>(url + '/' + id, body, this.getHeaders('login'))))
        );
    };

    delete(url: string, id: number, hideSpinner?: boolean): Observable<any> {
        var isConnected = this.isNetworkAvailable();
        if (!isConnected) {
            return;
        }
        let uniqueName = this.generateUniqueName();
        //this.HandleLongProcess(uniqueName);
        //let options = this.getHeaders('login');
        let options = this.getHeaders('login');
        return this._http.delete<any>(url + '/' + id, options).pipe(
            map((res) => {
                this.clearLongProcessRequest(uniqueName);
                return res;
            }),
            catchError((error) => this.handleAuthError(error, uniqueName, 'Delete', url, () => this._http.delete<any>(url + '/' + id, this.getHeaders('login'))))
        );
    };

    //for excel sheet
    getExcelData(url: string, json: string): Observable<Object[]> {
        var isConnected = this.isNetworkAvailable();
        if (!isConnected) {
            return;
        }
        let uniqueName = this.generateUniqueName();
        //this.HandleLongProcess(uniqueName);
        return Observable.create(observer => {
            let self = this;
            var userAgent = this.getUserAgent("login");
            let xhr = new XMLHttpRequest();
           // url = environment.baseUrl + url;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.setRequestHeader("login", userAgent);
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        var blob = new Blob([xhr.response], { type: contentType });
                        observer.next(blob);
                        observer.complete();
                    }
                    else {
                        observer.error(xhr);
                    }
                    self.clearLongProcessRequest(uniqueName);
                }
            }
            xhr.send(json);
        });
    };

    private handleError(error: HttpErrorResponse, name, type?) {
        this.clearLongProcessRequest(name);
        return throwError(error || 'Server error');
    };

    private handleAuthError(error: HttpErrorResponse, name, type, url: string, retryRequest: () => Observable<any>) {
        if (error && error.status === 401 && url && url.indexOf('/Auth/Refresh') === -1) {
            return this.refreshAccessToken(url).pipe(
                switchMap(() => retryRequest()),
                catchError((refreshError) => this.handleError(refreshError || error, name, type))
            );
        }
        return this.handleError(error, name, type);
    }

    private refreshAccessToken(sourceUrl: string): Observable<any> {
        var refreshUrl = this.getApiRoot(sourceUrl) + 'Auth/Refresh';
        return this._http.post<any>(refreshUrl, {}, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            withCredentials: true
        }).pipe(
            map((response) => {
                if (response && response.AccessToken) {
                    localStorage.setItem('AccessToken', response.AccessToken);
                    localStorage.setItem('AccessTokenExpiresUtc', response.AccessTokenExpiresUtc || '');
                    this.PassHeader();
                }
                return response;
            })
        );
    }

    private getApiRoot(sourceUrl: string): string {
        var url = new URL(sourceUrl, window.location.origin);
        return url.protocol + '//' + url.host + '/';
    }

    private buildHeaders(): HttpHeaders {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        var accessToken = localStorage.getItem('AccessToken');
        if (accessToken) {
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        return headers;
    }

    isNetworkAvailable(): boolean {
        if (!navigator.onLine) {
            alert("Connection with the server is lost, please try again.");
            return false;
        }
        return true;
    }

    generateUniqueName() {
        var uniqueNum: any = Math.floor(100000 + Math.random() * 900000);
        uniqueNum = 'app' + uniqueNum;
        return uniqueNum;
    }

    getUserAgent(name) {
        var Sys: any = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie/)) ? Sys.ie = s[1] : (s = ua.match(/firefox/)) ? Sys.firefox = s[1] : (s = ua.match(/chrome/)) ? Sys.chrome = s[1] : (s = ua.match(/opera/)) ? Sys.opera = s[1] : (s = ua.match(/safari/)) ? Sys.safari = s[1] : 0;
        var currentNavigator = s[0];

        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                var concatedData = currentNavigator + '-' + decodeURIComponent(c.substring(nameEQ.length, c.length));
                return concatedData;
            }
        }
        return null;
    };

    getXSRFToken(name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    };

    getHeaders(name, token?) {
        var data = this.getUserAgent(name);
        let httpOptions = {
            headers: this.buildHeaders(),
            withCredentials: true
        };
        if (data) {
            httpOptions.headers = httpOptions.headers.set('login', data);
            if (token) {
                var _xsrftoken = this.getXSRFToken("xsrftoken");
                httpOptions.headers = httpOptions.headers.set('Token', token);
                httpOptions.headers = httpOptions.headers.set('xsrftoken', _xsrftoken);
            }
        }
        return httpOptions
    };



    //HandleLongProcess(processName): void {
    //    var self = this;
    //    this.longProcessRequestObj[processName] = setTimeout(res => {
    //        var isAlreadyOpen = document.getElementById('open-alert');
    //        if (!isAlreadyOpen && this._spinnerService.show) { // and should be add that spinner is showing
    //            var ref = document.getElementById('loadingSpinnerId').classList;
    //            ref.add('alert-loadingimage');
    //            this._GeneralPopupService.lonProcessPopup('Process is too long. Do you want to continue?').afterClosed().subscribe(cls => {
    //                if (cls == 'No') {
    //                    return location.reload(true);
    //                }
    //                ref.remove('alert-loadingimage');
    //            });
    //        }
    //    }, this.TimeAlowedForLongProcess);
    //};

    clearLongProcessRequest(processName) {
        clearTimeout(this.longProcessRequestObj[processName]);
        delete this.longProcessRequestObj[processName];
    }


}




