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
import {MatProgressSpinner, MatSpinner} from '@angular/material/progress-spinner';

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
    private authService: AuthenticationService, // Para obtener el UserId
    private clientsService: ClientsService      // Para obtener el ClientId
  ) {}

  ngOnInit(): void {
    // 1. Obtener el ID del usuario logueado (IAM)
    this.authSubscription = this.authService.currentUserId.pipe(
      take(1),
      // 2. Usar ese ID para buscar el perfil de cliente
      switchMap(userId => {
        if (userId && userId > 0) {
          return this.clientsService.getClientByUserId(userId);
        }
        // Si no hay UserId, retornamos un observable que emite null
        return [null];
      })
    ).subscribe({
      next: (clientProfile: Client | null) => {
        if (clientProfile && clientProfile.id) {
          // 3. Si se encuentra el perfil, guardamos el ID para inyectarlo en el formulario
          this.clientIdToInject = clientProfile.id;
          console.log(`Loan Application: Found Client ID ${this.clientIdToInject} for injection.`);
        } else {
          // Esto no debería pasar gracias al OnboardingGuard, pero es una defensa extra.
          console.error("Loan Application: Client profile not found despite being logged in.");
          // Redirigir al home o a error si el ID no se encuentra.
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching client ID for loan application.", err);
        this.isLoading = false;
        // Podríamos redirigir a una página de error de sistema
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
        // UX: Mover al usuario a una pantalla de confirmación o de estado de préstamo
        this.router.navigate(['/home']).then();
      },
      error: (error) => {
        console.error('Error submitting loan:', error);
        // UX: Mostrar error al usuario
      }
    });
  }
}
