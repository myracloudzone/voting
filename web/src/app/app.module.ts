import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { AppComponent } from './app.component';
import { SharedService } from './shared/service/shared.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from './interceptor/http.interceptor';

import { NotifierModule } from 'angular-notifier';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { VoterService } from './shared/service/voter.service';
import { PartyService } from './shared/service/party.service';
import { PartyMemberService } from './shared/service/party-member.service';
import { AuthenticateService } from './shared/service/authenticate.service';
@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        RouterModule,
        HttpModule,
        HttpClientModule,
        NavbarModule,
        FooterModule,
        SidebarModule,
        NotifierModule.withConfig({
            position: {
                horizontal: {
                    position: 'right',
                    distance: 12
                },
                vertical: {
                    position: 'top',
                    gap: 0
                }
            }
        }),
        AppRoutingModule
    ],
    declarations: [AppComponent, AdminLayoutComponent, LoginComponent],
    providers: [
        SharedService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
        VoterService,
        PartyService,
        PartyMemberService,
        AuthenticateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
