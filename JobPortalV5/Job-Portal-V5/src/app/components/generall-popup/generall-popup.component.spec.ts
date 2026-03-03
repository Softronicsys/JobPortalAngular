import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerallPopupComponent } from './generall-popup.component';

describe('GenerallPopupComponent', () => {
  let component: GenerallPopupComponent;
  let fixture: ComponentFixture<GenerallPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerallPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerallPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
