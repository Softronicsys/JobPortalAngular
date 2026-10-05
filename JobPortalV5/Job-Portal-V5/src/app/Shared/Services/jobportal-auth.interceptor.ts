import { Injectable } from '@angular/core';
import {
    HttpBackend,
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class JobPortalAuthInterceptor implements HttpInterceptor {
    private refreshHttp: HttpClient;

    constructor(handler: HttpBackend) {
        this.refreshHttp = new HttpClient(handler);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var authRequest = this.addAuth(request);
        return next.handle(authRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (!error || error.status !== 401 || this.isRefreshRequest(request.url)) {
                    return throwError(error);
                }

                return this.refreshAccessToken(request.url).pipe(
                    switchMap(() => next.handle(this.addAuth(request))),
                    catchError((refreshError) => throwError(refreshError || error))
                );
            })
        );
    }

    private addAuth(request: HttpRequest<any>): HttpRequest<any> {
        var accessToken = localStorage.getItem('AccessToken');
        var headers = request.headers;
        if (accessToken) {
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        return request.clone({
            headers: headers,
            withCredentials: true
        });
    }

    private refreshAccessToken(sourceUrl: string): Observable<any> {
        return this.refreshHttp.post<any>(this.getApiRoot(sourceUrl) + 'Auth/Refresh', {}, {
            withCredentials: true
        }).pipe(
            switchMap((response) => {
                if (response && response.AccessToken) {
                    localStorage.setItem('AccessToken', response.AccessToken);
                    localStorage.setItem('AccessTokenExpiresUtc', response.AccessTokenExpiresUtc || '');
                }
                return new Observable((observer) => {
                    observer.next(response);
                    observer.complete();
                });
            })
        );
    }

    private getApiRoot(sourceUrl: string): string {
        var url = new URL(sourceUrl, window.location.origin);
        return url.href.substring(0, url.href.lastIndexOf('/') + 1);
    }

    private isRefreshRequest(url: string): boolean {
        return url && url.indexOf('/Auth/Refresh') !== -1;
    }
}
