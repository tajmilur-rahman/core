import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../../app/service/auth.service';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const sessionData = this.authService.getSession();
        if (sessionData && sessionData?.jwtToken) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + sessionData?.jwtToken) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', '*') });

        const secureReq = request.clone({
            url: `${environment.url}${request.url}`
        });

        return next.handle(secureReq).pipe(
                map((event: HttpEvent<any>) => {
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    return throwError(error);
                })
            );
    }
}
