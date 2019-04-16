import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { HomeComponent } from '../home/home.component';
import { VotersComponent } from '../voters/voters.component';
import { PartyMembersComponent } from '../party-members/party-members.component';
import { PartyComponent } from '../party/party.component';
import { ProfileComponent } from '../profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { VotingComponent } from '../voting/voting.component';
import { NvD3Module } from 'ng2-nvd3';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        NgbModule,
        NgSelectModule,
        NvD3Module
    ],
    declarations: [
        HomeComponent,
        VotersComponent,
        PartyMembersComponent,
        PartyComponent,
        ProfileComponent,
        VotingComponent
    ]
})
export class AdminLayoutModule {}
