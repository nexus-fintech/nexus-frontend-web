import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApprovalFormComponent } from './loan-approval-form.component';

describe('LoanApprovalFormComponent', () => {
  let component: LoanApprovalFormComponent;
  let fixture: ComponentFixture<LoanApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanApprovalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
