import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { SharedService } from '../shared/service/shared.service';

@NgModule({
    imports: [RouterModule, CommonModule],
    declarations: [SidebarComponent],
    exports: [SidebarComponent]
})
export class SidebarModule {
    constructor(public sharedService: SharedService) {}
}
