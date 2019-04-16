import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyService } from '../shared/service/party.service';
import { SharedService } from '../shared/service/shared.service';

@Component({
    selector: 'app-party',
    templateUrl: './party.component.html',
    styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit {
    private userId: String = null;
    private parties: Array<Object> = [];
    private modalReference = null;
    private party = {};
    constructor(
        private notifierService: NotifierService,
        private router: Router,
        config: NgbModalConfig,
        private modalService: NgbModal,
        private partyService: PartyService,
        private sharedService: SharedService
    ) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    ngOnInit() {
        this.getPartyList();
    }

    getPartyList() {
        this.sharedService.hideLoader();
        this.partyService.getPartyList({}).subscribe(
            (data) => {
                if (data != null && data['data'] != null) {
                    this.parties = data['data'];
                }
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }

    addNewParty(content, partyForEdit) {
        if (partyForEdit != null) {
            this.party = partyForEdit;
        }
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then(
            (result) => {
                this.getPartyList();
            },
            (reason) => {
                this.getPartyList();
            }
        );
    }

    closeModal() {
        this.modalReference.close();
        this.party = {};
    }

    createOrUpdateParty() {
        this.sharedService.hideLoader();
        if (this.party['id'] == null) {
            this.partyService.createParty(this.party).subscribe(
                (data) => {
                    this.closeModal();
                },
                (error) => {
                    this.sharedService.hideLoader();
                    this.notifierService.notify('error', error.error.message);
                }
            );
        } else {
            this.partyService.updateParty(this.party).subscribe(
                (data) => {
                    this.closeModal();
                },
                (error) => {
                    this.sharedService.hideLoader();
                    this.notifierService.notify('error', error.error.message);
                }
            );
        }
    }

    deleteParty(party) {
        if (party == null) {
            return;
        }
        this.sharedService.hideLoader();
        this.partyService.deleteParty({ id: party.id }).subscribe(
            (data) => {
                this.getPartyList();
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }
}
