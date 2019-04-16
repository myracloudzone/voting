import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { AbstractHttpService } from './abstract-service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PartyMemberService extends AbstractHttpService<object> {
    url: string = this.host + '/service/party-member/';

    createPartyMember(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'create');
    }

    updatePartyMember(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'update');
    }

    deletePartyMember(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'delete');
    }

    getPartyMemberList(filter: any): Observable<object> {
        return this.getObservable('', this.url + 'list');
    }
}
