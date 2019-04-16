import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { VotersComponent } from '../voters/voters.component';
import { PartyMembersComponent } from '../party-members/party-members.component';
import { PartyComponent } from '../party/party.component';
import { ProfileComponent } from '../profile/profile.component';
import { VotingComponent } from '../voting/voting.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: HomeComponent },
    { path: 'voters', component: VotersComponent },
    { path: 'members', component: PartyMembersComponent },
    { path: 'parties', component: PartyComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'voting', component: VotingComponent }
];
