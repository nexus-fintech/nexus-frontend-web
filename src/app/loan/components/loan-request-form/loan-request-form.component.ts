import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';

import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {LoanRequest} from '../../model/loan-request.request';

@Component({
  selector: 'app-loan-request-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './loan-request-form.component.html',
  styleUrl: './loan-request-form.component.scss'
})
export class LoanRequestFormComponent extends BaseFormComponent implements OnInit {

  // CAMBIO CLAVE: Recibe el clientId del componente padre.
  @Input() clientId: number | null = null;

  @Output() formSubmitted = new EventEmitter<LoanRequest>();

  loanForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    // Eliminado: el campo 'clientId' del formulario. Ya no es editable.
    this.loanForm = this.fb.group({
      amount: [5000, [Validators.required, Validators.min(100)]],
      termInMonths: [12, [Validators.required, Validators.min(1), Validators.max(60)]],
      annualInterestRate: [0.15, [Validators.required, Validators.min(0.01), Validators.max(1)]],
    });
  }

  onSubmit() {
    if (this.loanForm.valid && this.clientId) {
      // Seguridad: Obtenemos los valores del formulario
      const formValues = this.loanForm.value;

      // Seguridad: Creamos el objeto usando el clientId INYECTADO (no el del formulario).
      const loanRequest: LoanRequest = {
        clientId: this.clientId, // Usamos el ID seguro del padre
        amount: formValues.amount,
        termInMonths: formValues.termInMonths,
        annualInterestRate: formValues.annualInterestRate
      };

      this.formSubmitted.emit(loanRequest);
      this.loanForm.reset({
        amount: 5000,
        termInMonths: 12,
        annualInterestRate: 0.15
      });
    }
  }
}
