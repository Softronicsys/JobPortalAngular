import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSuccessComponent } from './account-success.component';

describe('AccountSuccessComponent', () => {
  let component: AccountSuccessComponent;
  let fixture: ComponentFixture<AccountSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
