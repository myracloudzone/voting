/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PartyComponent } from './party.component';

describe('PartyComponent', () => {
    let component: PartyComponent;
    let fixture: ComponentFixture<PartyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PartyComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PartyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
