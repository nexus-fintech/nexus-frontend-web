import {Component, EventEmitter, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {LoanRequest} from '../../model/loan-request.request';

@Component({
  selector: 'app-loan-request-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './loan-request-form.component.html',
  styleUrl: './loan-request-form.component.scss'
})
export class LoanRequestFormComponent extends BaseFormComponent {
  @Output() formSubmitted = new EventEmitter<LoanRequest>();

  loanForm: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.loanForm = this.fb.group({
      clientId: ['', [Validators.required, Validators.min(1)]], // En producción vendría de la URL o Auth
      amount: ['', [Validators.required, Validators.min(100)]],
      termInMonths: ['', [Validators.required, Validators.min(1), Validators.max(60)]],
      annualInterestRate: ['', [Validators.required, Validators.min(0.01), Validators.max(1.0)]]
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.formSubmitted.emit(this.loanForm.value);
      this.loanForm.reset();
    }
  }
}
