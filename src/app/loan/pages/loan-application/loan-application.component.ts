import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, ActivatedRoute} from "@angular/router"; // Importamos ActivatedRoute
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Subscription, of} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';

import {LoanRequestFormComponent} from '../../components/loan-request-form/loan-request-form.component';
import {LoansService} from '../../services/loans.service';

import {AuthenticationService} from '../../../iam/services/authentication.service';
import {ClientsService} from '../../../client/services/clients.service';
import {Client} from '../../../client/model/client.entity';
import {LoanRequest} from '../../model/loan-request.request';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [
    CommonModule,
    LoanRequestFormComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.scss'
})
export class LoanApplicationComponent implements OnInit, OnDestroy {

  clientIdToInject: number | null = null;
  isLoading: boolean = true;

  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute, // Para leer query params
    private loansService: LoansService,
    private authService: AuthenticationService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    // 1. Verificar si es un Escenario Asistido (Admin creando para Cliente)
    const queryClientId = this.route.snapshot.queryParamMap.get('clientId');
    const isAdmin = this.authService.hasRole('ROLE_ADMIN');

    if (queryClientId && isAdmin) {
      // Escenario: ADMIN ASISTIDO
      // Si hay ID en la URL y soy Admin, confío en ese ID directamente.
      console.log(`Loan Application: Admin assisting client #${queryClientId}`);
      this.clientIdToInject = Number(queryClientId);
      this.isLoading = false;
    } else {
      // Escenario: AUTOSERVICIO (Cliente pidiendo para sí mismo)
      // Ignoramos la URL y buscamos la identidad real del usuario logueado.
      this.loadIdentityFromToken();
    }
  }

  /**
   * Lógica original: Busca el perfil basado en el token del usuario.
   */
  private loadIdentityFromToken() {
    this.authSubscription = this.authService.currentUserId.pipe(
      take(1),
      switchMap(userId => {
        if (userId) {
          return this.clientsService.getClientByUserId(userId);
        }
        return of(null);
      })
    ).subscribe({
      next: (clientProfile: Client | null) => {
        if (clientProfile && clientProfile.id) {
          this.clientIdToInject = clientProfile.id;
          console.log(`Loan Application: Self-service for Client ID ${this.clientIdToInject}`);
        } else {
          console.error("Loan Application: Client profile not found for logged user.");
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching identity.", err);
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

        // UX: Redirección inteligente al terminar
        if (this.authService.hasRole('ROLE_ADMIN')) {
          // Si soy Admin, vuelvo al perfil del cliente que estaba ayudando
          this.router.navigate(['/clients', loanData.clientId]);
        } else {
          // Si soy Cliente, voy a mi lista personal
          this.router.navigate(['/my-loans']);
        }
      },
      error: (error) => {
        console.error('Error submitting loan:', error);
        // Aquí podrías mostrar un MatSnackBar con el error
      }
    });
  }
}
