import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { AbstractHttpService } from './abstract-service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PartyService extends AbstractHttpService<object> {
    url: string = this.host + '/service/party/';

    createParty(userNameObj): Observable<object> {
        return this.createObservable(userNameObj, this.url + 'create');
    }

    updateParty(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'update');
    }

    deleteParty(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'delete');
    }

    getPartyList(filter: any): Observable<object> {
        return this.getObservable('', this.url + 'list');
    }
}
