import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {RouterLink} from '@angular/router';

import {LoanApprovalFormComponent} from '../../components/loan-approval-form/loan-approval-form.component';
import {Loan} from '../../model/loan.entity';
import {LoansService} from '../../services/loans.service';
import {LoanApprovalRequest} from '../../model/loan-approval.request';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-loan-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    LoanApprovalFormComponent,
    RouterLink
  ],
  templateUrl: './loan-evaluation.component.html',
  styleUrl: './loan-evaluation.component.scss'
})
export class LoanEvaluationComponent {
  clientIdToSearch: number = 1;
  loans: Loan[] = [];
  displayedColumns: string[] = ['id', 'amount', 'rate', 'term', 'status', 'actions'];

  selectedLoanId: number | null = null;

  constructor(private loansService: LoansService, private http: HttpClient) {}

  searchLoans() {
    this.loansService.getLoansByClientId(this.clientIdToSearch).subscribe(data => {
      this.loans = data;
    });
  }

  selectForApproval(loan: Loan) {
    this.selectedLoanId = loan.id;
  }

  onApprovalSubmit(riskData: LoanApprovalRequest) {
    if (this.selectedLoanId) {
      this.loansService.approve(this.selectedLoanId, riskData).subscribe({
        next: (updatedLoan) => {
          console.log(`Loan processed! Status: ${updatedLoan.status}`);
          this.selectedLoanId = null;
          this.searchLoans();
        },
        error: (err) => console.error('Error processing approval. Risk Engine might have rejected it.', err)
      });
    }
  }

}
