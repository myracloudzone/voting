/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PartyMembersComponent } from './party-members.component';

describe('PartyMembersComponent', () => {
    let component: PartyMembersComponent;
    let fixture: ComponentFixture<PartyMembersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PartyMembersComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PartyMembersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
