import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicuplodPage } from './musicuplod.page';

describe('MusicuplodPage', () => {
  let component: MusicuplodPage;
  let fixture: ComponentFixture<MusicuplodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicuplodPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicuplodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
