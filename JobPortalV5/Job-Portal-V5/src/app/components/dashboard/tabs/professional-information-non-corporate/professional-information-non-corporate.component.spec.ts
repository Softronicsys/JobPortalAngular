import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalInformationNonCorporateComponent } from './professional-information-non-corporate.component';

describe('ProfessionalInformationNonCorporateComponent', () => {
  let component: ProfessionalInformationNonCorporateComponent;
  let fixture: ComponentFixture<ProfessionalInformationNonCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalInformationNonCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalInformationNonCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
