import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusiclistPage } from './musiclist.page';

describe('MusiclistPage', () => {
  let component: MusiclistPage;
  let fixture: ComponentFixture<MusiclistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusiclistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusiclistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
