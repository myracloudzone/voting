import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/service/shared.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'fa fa-dashboard', class: 'dashboardView' },
    { path: '/voting', title: 'Vote Card', icon: 'fa fa-thumb-tack', class: 'voteCardView' },
    { path: '/voters', title: 'Voters', icon: 'fa fa-users', class: 'votersView' },
    { path: '/parties', title: 'Parties', icon: 'fa fa-users', class: 'partiesView' },
    { path: '/members', title: 'Party Members', icon: 'fa fa-users', class: 'partyMemberView' },
    { path: '/profile', title: 'Profile', icon: 'fa fa-user-circle', class: 'profileView' }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    isToggledOpen = true;

    constructor(private sharedService: SharedService) {}

    ngOnInit() {
        this.menuItems = ROUTES.filter((menuItem) => menuItem);
    }
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
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
}
