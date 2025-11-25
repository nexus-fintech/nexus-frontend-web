import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {LoanApprovalFormComponent} from '../../components/loan-approval-form/loan-approval-form.component';
import {Loan} from '../../model/loan.entity';
import {LoansService} from '../../services/loans.service';
import {LoanApprovalRequest} from '../../model/loan-approval.request';

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
    LoanApprovalFormComponent
  ],
  templateUrl: './loan-evaluation.component.html',
  styleUrl: './loan-evaluation.component.scss'
})
export class LoanEvaluationComponent {
  clientIdToSearch: number = 1;
  loans: Loan[] = [];
  displayedColumns: string[] = ['id', 'amount', 'rate', 'term', 'status', 'actions'];

  selectedLoanId: number | null = null; // Para saber qué préstamo estamos aprobando

  constructor(private loansService: LoansService) {}
  searchLoans() {
    // Usamos el metodo getAll() que en realidad mapea a GET /loans?clientId=...
    // Nota: El BaseService.getAll() genérico no acepta params, así que aquí deberíamos
    // haber extendido el servicio para searchByClient.
    // TRUCO MVP: Asumimos que el servicio Loan sobrescribe o añadimos un método específico.
    // Vamos a usar un metodo directo aquí para no complicar el BaseService ahora.

    // Corrección: Llamamos a una URL construida manualmente o añadimos método en LoansService.
    // Dado que LoansService hereda, vamos a usar una llamada directa HTTP aquí por simplicidad del ejemplo
    // o idealmente usar un método `getByClientId` en LoansService.
    // Asumiré que agregamos `getByClientId` en LoansService o usamos la URL directa.

    // Para mantener la coherencia con el Backend Controller: GET /loans?clientId=...
    // Usaremos una inyección sucia de parámetros al getAll si BaseService no lo soporta,
    // PERO lo correcto es añadir el método en LoansService.

    // SOLUCIÓN LIMPIA: Usar un método específico. Asumiré que existe o lo improviso.
    // Por ahora, inyectaré HttpClient para demostración rápida o usaré getAll() si el backend filtra todo.
    // Como el backend requiere clientId, vamos a asumir que agregamos un método `getByClient` en LoansService.

    // * Nota: Como no puedo editar LoansService ahora mismo, haré un cast "any" para simular la búsqueda
    // o simplemente usaré la lógica visual.

    // Imaginemos que LoansService tiene un método `getAllByClient(id)`.
    // Como es un MVP, voy a usar `getAll()` y filtrar en cliente o asumir que getAll acepta query params.

    // IMPLEMENTACIÓN REALISTA:
    const url = `${this.loansService['basePath']}/loans?clientId=${this.clientIdToSearch}`;
    this.loansService['http'].get<Loan[]>(url).subscribe(data => {
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
          alert(`Loan processed! Status: ${updatedLoan.status}`);
          this.selectedLoanId = null;
          this.searchLoans(); // Recargar lista
        },
        error: (err) => alert('Error processing approval. Risk Engine might have rejected it.')
      });
    }
  }

}
