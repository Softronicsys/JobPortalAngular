import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivationFFComponent } from './account-activation-ff.component';

describe('AccountActivationFFComponent', () => {
  let component: AccountActivationFFComponent;
  let fixture: ComponentFixture<AccountActivationFFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountActivationFFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActivationFFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
