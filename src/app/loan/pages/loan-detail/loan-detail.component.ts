import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LoansService } from '../../services/loans.service';
import { Loan } from '../../model/loan.entity';
import {AmortizationTableComponent} from '../../components/amortization-table/amortization-table.component';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule, MatButtonModule, AmortizationTableComponent],
  templateUrl: './loan-detail.component.html',
  styleUrl: './loan-detail.component.scss'
})
export class LoanDetailComponent implements OnInit {

  loan: Loan | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private loansService: LoansService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadLoanDetails(id);
    }
  }

  loadLoanDetails(id: number) {
    this.loansService.getById(id).subscribe({
      next: (data) => {
        this.loan = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  goBack() {
    window.history.back();
  }
}
