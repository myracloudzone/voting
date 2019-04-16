import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';
import { SharedService } from '../shared/service/shared.service';
import { AuthenticateService } from '../shared/service/authenticate.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private user: any = {};
    constructor(
        private notifierService: NotifierService,
        private sharedService: SharedService,
        private authenticateService: AuthenticateService,
        private router: Router
    ) {}
    ngOnInit() {
        this.sharedService.showLoader();
        this.authenticateService.isValidSession({}).subscribe(
            (data) => {
                if (data['status'] === true) {
                    this.getLoggedInMember();
                }
                this.sharedService.hideLoader();
            },
            (error) => {
                this.sharedService.hideLoader();
            }
        );
    }

    getLoggedInMember() {
        this.sharedService.showLoader();
        this.authenticateService.getLoggedInMember({}).subscribe(
            (data2) => {
                this.sharedService.hideLoader();
                this.sharedService['loggedInMember'] = data2;
                this.router.navigate(['/voting']);
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }

    login() {
        if (this.user['username'] == null || this.user['username'].trim().length === 0) {
            this.notifierService.notify('error', 'Username is required.');
            return;
        } else if (this.user['password'] == null || this.user['password'].trim().length === 0) {
            this.notifierService.notify('error', 'Password is required.');
            return;
        }
        this.sharedService.showLoader();
        this.authenticateService.authenticate(this.user).subscribe(
            (data) => {
                this.getLoggedInMember();
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }
}
