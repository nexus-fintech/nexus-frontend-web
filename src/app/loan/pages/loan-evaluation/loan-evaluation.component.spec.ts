import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanEvaluationComponent } from './loan-evaluation.component';

describe('LoanEvaluationComponent', () => {
  let component: LoanEvaluationComponent;
  let fixture: ComponentFixture<LoanEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanEvaluationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
