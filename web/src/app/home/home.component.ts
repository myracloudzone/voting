import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NvD3Component } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { Router } from '../../../node_modules/@angular/router';
import { NotifierService } from '../../../node_modules/angular-notifier';
import { NgbModalConfig } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../shared/service/shared.service';
import { VoterService } from '../shared/service/voter.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    options;
    data;
    dataLoaded = false;
    constructor(
        private notifierService: NotifierService,
        private router: Router,
        config: NgbModalConfig,
        private voterService: VoterService,
        private sharedService: SharedService
    ) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    ngOnInit() {
        this.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d) {
                    return d.key;
                },
                y: function(d) {
                    return d.y;
                },
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };
        this.data = [];
        this.getVotingResult();
    }

    getVotingResult() {
        this.sharedService.showLoader();
        this.voterService.getVotingResult({}).subscribe((data) => {
            if (data != null && data['data'] != null) {
                this.sharedService.hideLoader();
                const graphData = data['data'];
                graphData.forEach((element) => {
                    const tmp = {};
                    tmp['key'] = element.code;
                    tmp['y'] = element.countNumber;
                    this.data.push(tmp);
                });
            }
            this.dataLoaded = true;
        });
    }
}
