import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyMemberService } from '../shared/service/party-member.service';
import { PartyService } from '../shared/service/party.service';
import { SharedService } from '../shared/service/shared.service';

@Component({
    selector: 'app-party-members',
    templateUrl: './party-members.component.html',
    styleUrls: ['./party-members.component.scss']
})
export class PartyMembersComponent implements OnInit {
    private userId: String = null;
    private members: Array<Object> = [];
    private parties = [];
    private selectedPartyMember = {};
    private modalReference = null;
    constructor(
        private notifierService: NotifierService,
        private router: Router,
        config: NgbModalConfig,
        private modalService: NgbModal,
        private partyMemberService: PartyMemberService,
        private partyService: PartyService,
        private sharedService: SharedService
    ) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    ngOnInit() {
        this.getPartyMemberList();
        this.getPartyList();
    }

    getPartyMemberList() {
        this.sharedService.showLoader();
        this.partyMemberService.getPartyMemberList({}).subscribe(
            (data) => {
                if (data != null && data['data'] != null) {
                    this.members = data['data'];
                }
                this.sharedService.hideLoader();
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }

    getPartyList() {
        this.sharedService.showLoader();
        this.partyService.getPartyList({}).subscribe(
            (data) => {
                if (data != null && data['data'] != null) {
                    this.parties = data['data'];
                }
                this.sharedService.hideLoader();
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }

    addNewPartyMember(content, partyMemberForEdit) {
        this.selectedPartyMember = {};
        if (partyMemberForEdit != null) {
            this.selectedPartyMember = partyMemberForEdit;
        }
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then(
            (result) => {
                this.getPartyMemberList();
            },
            (reason) => {
                this.getPartyMemberList();
            }
        );
    }

    closeModal() {
        this.modalReference.close();
    }

    createOrUpdatePartyMember() {
        this.sharedService.showLoader();
        if (this.selectedPartyMember['id'] == null) {
            this.partyMemberService.createPartyMember(this.selectedPartyMember).subscribe(
                (data) => {
                    this.notifierService.notify('success', 'Party-Member created succesfully.');
                    this.closeModal();
                },
                (error) => {
                    this.sharedService.hideLoader();
                    this.notifierService.notify('error', error.error.message);
                }
            );
        } else {
            this.partyMemberService.updatePartyMember(this.selectedPartyMember).subscribe(
                (data) => {
                    this.notifierService.notify('success', 'Party-Member updated succesfully.');
                    this.closeModal();
                },
                (error) => {
                    this.sharedService.hideLoader();
                    this.notifierService.notify('error', error.error.message);
                }
            );
        }
    }

    deletePartyMember(party) {
        if (party == null) {
            return;
        }
        this.sharedService.showLoader();
        this.partyMemberService.deletePartyMember({ id: party.id }).subscribe(
            (data) => {
                this.notifierService.notify('success', 'Party-Member deleted succesfully.');
                this.getPartyMemberList();
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }

    compareParty(o1: any, o2: any): boolean {
        return o1.id === o2.id;
    }
}
