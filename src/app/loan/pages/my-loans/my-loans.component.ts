import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { switchMap } from 'rxjs';

import { AuthenticationService } from '../../../iam/services/authentication.service';
import {LoansService} from '../../services/loans.service';
import {ClientsService} from '../../../client/services/clients.service';
import {Loan} from '../../model/loan.entity';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatIconModule, RouterLink,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './my-loans.component.html',
  styleUrl: './my-loans.component.scss'
})
export class MyLoansComponent implements OnInit {

  loansDataSource = new MatTableDataSource<Loan>();
  isLoading: boolean = true;

  displayedColumns: string[] = ['id', 'amount', 'rate', 'term', 'status', 'actions'];

  constructor(
    private loansService: LoansService,
    private authService: AuthenticationService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.loadMyLoans();
  }

  loadMyLoans() {
    this.isLoading = true;

    this.authService.currentUserId.pipe(
      switchMap(userId => {
        if (userId) {
          return this.clientsService.getClientByUserId(userId);
        }
        return [null];
      }),
      switchMap(clientProfile => {
        if (clientProfile && clientProfile.id) {
          return this.loansService.getLoansByClientId(clientProfile.id);
        }
        return [[]];
      })
    ).subscribe({
      next: (loans) => {
        this.loansDataSource.data = loans;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading client loans:', err);
        this.isLoading = false;
      }
    });
  }

}
