import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { BaseService } from "../../shared/services/base.service";
import { Loan } from "../model/loan.entity";
import {HttpClient} from '@angular/common/http';
import {LoanApprovalRequest} from '../model/loan-approval.request';

/**
 * Servicio de Infraestructura para el Bounded Context: Loan.
 * Maneja la comunicación HTTP con el endpoint /loans.
 */
@Injectable({
  providedIn: 'root'
})
export class LoansService extends BaseService<Loan> {

  constructor(http: HttpClient) {
    super(http);
    // Define el endpoint específico: http://localhost:8080/api/v1/loans
    this.resourceEndpoint = '/loans';
  }

  /**
   * Método específico de negocio para aprobar un préstamo.
   * POST /api/v1/loans/{loanId}/approve
   * @param loanId ID del préstamo a aprobar.
   * @param approvalRequest Datos financieros para el Risk Engine.
   * @returns El préstamo actualizado (ACTIVE o REJECTED).
   */
  approve(loanId: number, approvalRequest: LoanApprovalRequest): Observable<Loan> {
    const url = `${this.resourcePath()}/${loanId}/approve`;

    return this.http.post<Loan>(url, JSON.stringify(approvalRequest), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
