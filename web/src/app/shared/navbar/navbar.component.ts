import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SharedService } from '../service/shared.service';
import { AuthenticateService } from '../service/authenticate.service';
import { Router } from '../../../../node_modules/@angular/router';
declare var $: any;

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;
    private isToggledOpen = true;

    constructor(
        location: Location,
        private element: ElementRef,
        public sharedService: SharedService,
        private authenticateService: AuthenticateService,
        private router: Router
    ) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter((listTitle) => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    }

    logoutUser() {
        this.sharedService.showLoader();
        this.authenticateService.logout({}).subscribe((data) => {
            this.sharedService.hideLoader();
            this.sharedService['loggedInMember'] = null;
            this.router.navigate(['/login']);
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function() {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    }
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    }
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    toggleSideBar(isMouseEvent) {
        if (isMouseEvent) {
            if (this.sharedService.isScreenToggled === true) {
                $('#footer').toggleClass('footer-detail-toggle');
                $('.sidebar').toggleClass('side-bar-toggle');
                $('#sidebar-wrapper').toggleClass('sidebar-wrapper-toggle');
                $('.main-panel').toggleClass('main-panel-toggle');
                $('.navbar-fixed-top').toggleClass('navbar-fixed-top-toggle');
            }
        } else {
            this.sharedService.isScreenToggled = !this.sharedService.isScreenToggled;
            $('#footer').toggleClass('footer-detail-toggle');
            $('.sidebar').toggleClass('side-bar-toggle');
            $('#sidebar-wrapper').toggleClass('sidebar-wrapper-toggle');
            $('.main-panel').toggleClass('main-panel-toggle');
            $('.navbar-fixed-top').toggleClass('navbar-fixed-top-toggle');
        }
    }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.split('/').pop();
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }
}
