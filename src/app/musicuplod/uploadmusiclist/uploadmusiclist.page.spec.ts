import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadmusiclistPage } from './uploadmusiclist.page';

describe('UploadmusiclistPage', () => {
  let component: UploadmusiclistPage;
  let fixture: ComponentFixture<UploadmusiclistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadmusiclistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadmusiclistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
