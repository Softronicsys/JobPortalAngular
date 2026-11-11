import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { JobPortalSessionService } from './jobportal-session.service';

@Injectable()
export class JobPortalAuthInterceptor implements HttpInterceptor {
    constructor(private sessionService: JobPortalSessionService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var authRequest = this.addAuth(request);
        return next.handle(authRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (!error || error.status !== 401 || this.isRefreshRequest(request.url)) {
                    return throwError(error);
                }

                return this.sessionService.refreshAccessToken(request.url).pipe(
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

    private isRefreshRequest(url: string): boolean {
        return url && url.indexOf('/Auth/Refresh') !== -1;
    }
}
