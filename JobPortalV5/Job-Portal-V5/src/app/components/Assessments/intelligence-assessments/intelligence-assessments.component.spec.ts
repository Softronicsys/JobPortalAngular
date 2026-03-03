import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelligenceAssessmentsComponent } from './intelligence-assessments.component';

describe('IntelligenceAssessmentsComponent', () => {
  let component: IntelligenceAssessmentsComponent;
  let fixture: ComponentFixture<IntelligenceAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntelligenceAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligenceAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
