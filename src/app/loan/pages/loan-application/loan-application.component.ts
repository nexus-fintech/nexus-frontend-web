import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Subscription, switchMap, take} from 'rxjs';

import {LoanRequestFormComponent} from '../../components/loan-request-form/loan-request-form.component';
import {LoansService} from '../../services/loans.service';

import {AuthenticationService} from '../../../iam/services/authentication.service';
import {ClientsService} from '../../../client/services/clients.service';
import {Client} from '../../../client/model/client.entity';
import {LoanRequest} from '../../model/loan-request.request';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [
    CommonModule,
    LoanRequestFormComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner
  ],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.scss'
})
export class LoanApplicationComponent implements OnInit {

  clientIdToInject: number | null = null;
  isLoading: boolean = true;

  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private loansService: LoansService,
    private authService: AuthenticationService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    // 1. Get the logged-in user's ID (IAM)
    this.authSubscription = this.authService.currentUserId.pipe(
      take(1),
      // 2. Use that ID to fetch the client profile
      switchMap(userId => {
        if (userId && userId > 0) {
          return this.clientsService.getClientByUserId(userId);
        }
        return [null];
      })
    ).subscribe({
      next: (clientProfile: Client | null) => {
        if (clientProfile && clientProfile.id) {
          // 3. If the profile is found, store the ID to inject it into the form
          this.clientIdToInject = clientProfile.id;
          console.log(`Loan Application: Found Client ID ${this.clientIdToInject} for injection.`);
        } else {
          // This should not happen thanks to the OnboardingGuard, but it's an extra safeguard.
          console.error("Loan Application: Client profile not found despite being logged in.");
          // Redirect to home or an error page if the ID is not found.
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching client ID for loan application.", err);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onRequestSubmitted(loanData: LoanRequest) {
    this.loansService.create(loanData).subscribe({
      next: (response) => {
        console.log('Loan submitted successfully!', response);
        this.router.navigate(['/home']).then();
      },
      error: (error) => {
        console.error('Error submitting loan:', error);
      }
    });
  }
}
