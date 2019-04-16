import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { AbstractHttpService } from './abstract-service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticateService extends AbstractHttpService<object> {
    url: string = this.host + '/service/auth/';

    authenticate(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'authenticate');
    }

    logout(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'logout');
    }

    getLoggedInMember(filter: any): Observable<object> {
        return this.getObservable('', this.url + 'getLoggedInMember');
    }

    isValidSession(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'isValidSession');
    }
}
