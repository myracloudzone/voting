import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoterService } from '../shared/service/voter.service';
import { SharedService } from '../shared/service/shared.service';

@Component({
    selector: 'app-voters',
    templateUrl: './voters.component.html',
    styleUrls: ['./voters.component.scss']
})
export class VotersComponent implements OnInit {
    private userId: String = null;
    private voters: Array<Object> = [];
    private voter = {};
    modalReference = null;
    constructor(
        private notifierService: NotifierService,
        private router: Router,
        config: NgbModalConfig,
        private modalService: NgbModal,
        private voterService: VoterService,
        private sharedService: SharedService
    ) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    ngOnInit() {
        this.getVoterList();
    }

    getVoterList() {
        this.sharedService.showLoader();
        this.voterService.getVoterList({}).subscribe(
            (data) => {
                if (data != null && data['data'] != null) {
                    this.voters = data['data'];
                }
                this.sharedService.hideLoader();
            },
            (error) => {
                this.sharedService.hideLoader();
                this.notifierService.notify('error', error.error.message);
            }
        );
    }

    addNewVoter(content, voterForEdit) {
        if (voterForEdit != null) {
            this.voter = voterForEdit;
        }
        this.modalReference = this.modalService.open(content);
        this.modalReference.result.then(
            (result) => {
                this.getVoterList();
            },
            (reason) => {
                this.getVoterList();
            }
        );
    }

    closeModal() {
        this.modalReference.close();
    }

    createOrUpdateVoter() {
        this.sharedService.showLoader();
        if (this.voter['id'] == null) {
            this.voterService.createVoter(this.voter).subscribe(
                (data) => {
                    this.notifierService.notify('success', 'Voter created/updated succesfully.');
                    this.closeModal();
                },
                (error) => {
                    this.notifierService.notify('error', error.error.message);
                }
            );
        } else {
            this.voterService.updateVoter(this.voter).subscribe(
                (data) => {
                    this.closeModal();
                },
                (error) => {
                    this.notifierService.notify('error', error.error.message);
                }
            );
        }
    }

    deleteVoter(voter) {
        if (voter == null) {
            return;
        }
        this.voterService.deleteVoter({ id: voter.id }).subscribe((data) => {
            this.getVoterList();
        });
    }
}
