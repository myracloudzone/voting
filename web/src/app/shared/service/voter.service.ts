import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { AbstractHttpService } from './abstract-service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VoterService extends AbstractHttpService<object> {
    url: string = this.host + '/service/voter/';

    createVoter(userNameObj): Observable<object> {
        return this.createObservable(userNameObj, this.url + 'create');
    }

    updateVoter(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'update');
    }

    deleteVoter(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'delete');
    }

    getVoterList(filter: any): Observable<object> {
        return this.getObservable('', this.url + 'list');
    }

    applyVote(obj): Observable<object> {
        return this.createObservable(obj, this.url + 'postVote');
    }

    checkForVoting(filter: any): Observable<object> {
        return this.getObservable('', this.url + 'checkForVoting');
    }

    getVotingResult(filter: any): Observable<object> {
        return this.getObservable('', this.url + 'getVotingResult');
    }
}
