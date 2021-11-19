import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusiclistComponent } from './musiclist.component';

describe('MusiclistComponent', () => {
  let component: MusiclistComponent;
  let fixture: ComponentFixture<MusiclistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusiclistComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusiclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
