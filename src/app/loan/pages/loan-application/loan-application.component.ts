import { Component } from '@angular/core';
import {LoansService} from '../../services/loans.service';
import {LoanRequest} from '../../model/loan-request.request';
import {CommonModule} from '@angular/common';
import {LoanRequestFormComponent} from '../../components/loan-request-form/loan-request-form.component';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [CommonModule, LoanRequestFormComponent],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.scss'
})
export class LoanApplicationComponent {
  constructor(private loansService: LoansService) {}

  onRequestSubmitted(request: LoanRequest) {
    this.loansService.create(request).subscribe({
      next: (loan) => {
        alert(`Loan Requested Successfully! ID: ${loan.id}`);
        // Aquí podrías redirigir a la lista de préstamos
      },
      error: (err) => alert('Error requesting loan. Check console.')
    });
  }
}
