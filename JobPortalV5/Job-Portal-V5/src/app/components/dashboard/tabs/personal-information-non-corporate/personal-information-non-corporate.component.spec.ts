import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationNonCorporateComponent } from './personal-information-non-corporate.component';

describe('PersonalInformationNonCorporateComponent', () => {
  let component: PersonalInformationNonCorporateComponent;
  let fixture: ComponentFixture<PersonalInformationNonCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalInformationNonCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInformationNonCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
