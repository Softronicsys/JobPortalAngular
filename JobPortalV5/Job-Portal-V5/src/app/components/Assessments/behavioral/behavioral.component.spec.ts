import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralComponent } from './behavioral.component';

describe('BehavioralComponent', () => {
  let component: BehavioralComponent;
  let fixture: ComponentFixture<BehavioralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehavioralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehavioralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
