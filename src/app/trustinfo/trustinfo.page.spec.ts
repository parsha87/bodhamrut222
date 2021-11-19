import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustinfoPage } from './trustinfo.page';

describe('TrustinfoPage', () => {
  let component: TrustinfoPage;
  let fixture: ComponentFixture<TrustinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
