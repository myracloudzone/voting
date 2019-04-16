import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from '../shared/service/shared.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router, private sharedService: SharedService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.sharedService.hideLoader();
                let message = '';
                if (error.status >= 400 && error.status <= 499) {
                    message = error.error.message;
                    if (error['status'] === 401) {
                        Swal.fire({
                            title: 'Your session has been expired. Please login to continue.',
                            text: '',
                            type: 'info',
                            showCancelButton: false,
                            showConfirmButton: true,
                            confirmButtonText: 'Login',
                            cancelButtonText: ''
                        }).then((result) => {
                            if (result.value) {
                                this.router.navigate(['/login']);
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                            }
                        });
                    }
                } else if (error.status >= 500) {
                    message = error.error.detail;
                }
                return throwError(error);
            })
        );
    }
}
