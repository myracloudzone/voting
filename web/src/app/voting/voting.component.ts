import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyService } from '../shared/service/party.service';
import { PartyMemberService } from '../shared/service/party-member.service';
import { VoterService } from '../shared/service/voter.service';
import { SharedService } from '../shared/service/shared.service';

@Component({
    selector: 'app-voting',
    templateUrl: './voting.component.html',
    styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
    private userId: String = null;
    private members: Array<Object> = [];
    private parties = [];
    private selectedPartyMember = {};
    private modalReference = null;
    private errorMessage = '';
    constructor(
        private notifierService: NotifierService,
        private router: Router,
        config: NgbModalConfig,
        private modalService: NgbModal,
        private partyMemberService: PartyMemberService,
        private partyService: PartyService,
        private voterService: VoterService,
        private sharedService: SharedService
    ) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    ngOnInit() {
        this.getPartyMemberList();
        this.checkForVoting();
    }

    checkForVoting() {
        this.sharedService.showLoader();
        this.voterService.checkForVoting({}).subscribe(
            (data) => {
                if (data != null && data['isAllowed'] === true) {
                    this.sharedService.hideLoader();
                }
            },
            (error) => {
                $('#cover').fadeIn(100);
                this.errorMessage = error.error.message;
                this.sharedService.hideLoader();
            }
        );
    }

    getPartyMemberList() {
        this.sharedService.showLoader();
        this.partyMemberService.getPartyMemberList({}).subscribe(
            (data) => {
                if (data != null && data['data'] != null) {
                    this.members = data['data'];
                }
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }

    applyVote(member) {
        this.voterService.applyVote({ memberId: member.id }).subscribe(
            (data) => {
                this.notifierService.notify('success', 'Vote Applied Successfully.');
                this.checkForVoting();
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }
}
