import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { SharedService } from './shared.service';

@Injectable()
export abstract class AbstractHttpService<T extends Object> {
    host: string = '';
    abstract url: string;
    listSuffix: string = 'list';
    codeProperty: string = 'id';
    httpOptions: object = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private httpClient: HttpClient, private sharedService: SharedService) {}

    getListObservable(filter: object, url?: string): Observable<T> {
        const serviceUrl = url || this.url;
        return this.httpClient.get<T>(serviceUrl + this.listSuffix, filter);
    }

    getObservable(code: string, url?: string): Observable<T> {
        const serviceUrl = url || this.url;
        return this.httpClient.get<T>(serviceUrl + code);
    }

    createObservable(item: T, url?: string): Observable<T> {
        const serviceUrl = url || this.url;
        return this.httpClient.post<T>(serviceUrl, item, this.httpOptions);
    }

    updateObservable(code: string, item: T, url?: string): Observable<T> {
        const serviceUrl = url || this.url;
        return this.httpClient.put<T>(serviceUrl + code, item, this.httpOptions);
    }

    deleteObservable(code: string, url?: string): Observable<T> {
        const serviceUrl = url || this.url;
        return this.httpClient.delete<T>(serviceUrl + code);
    }

    getList(returnFn: Function, filter?: object, url?: string, errorFn?: Function): void {
        const filterToSend = filter ? filter : {};
        const serviceUrl = url || this.url;
        this.getListObservable(filterToSend, serviceUrl).subscribe(
            (data) => {
                returnFn(data);
            },
            (err) => {
                if (errorFn != null) {
                    errorFn(err);
                } else {
                    console.error(err);
                }
            }
        );
    }
}
