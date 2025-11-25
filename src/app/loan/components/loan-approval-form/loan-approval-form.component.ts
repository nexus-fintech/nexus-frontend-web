import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {LoanApprovalRequest} from '../../model/loan-approval.request';

@Component({
  selector: 'app-loan-approval-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './loan-approval-form.component.html',
  styleUrl: './loan-approval-form.component.scss'
})
export class LoanApprovalFormComponent extends BaseFormComponent {

  @Output() approvalSubmitted = new EventEmitter<LoanApprovalRequest>();

  riskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.riskForm = this.fb.group({
      clientAge: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      monthlyIncome: ['', [Validators.required, Validators.min(0)]],
      monthlyDebt: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.riskForm.valid) {
      this.approvalSubmitted.emit(this.riskForm.value);
    }
  }
}
