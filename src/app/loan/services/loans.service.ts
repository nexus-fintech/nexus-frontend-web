import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { BaseService } from "../../shared/services/base.service";
import { Loan } from "../model/loan.entity";
import { HttpClient } from '@angular/common/http';
import { LoanApprovalRequest } from '../model/loan-approval.request';

/**
 * Infrastructure Service for the Loan Bounded Context.
 * Handles HTTP communication with the /loans endpoint.
 */
@Injectable({
  providedIn: 'root'
})
export class LoansService extends BaseService<Loan> {

  constructor(http: HttpClient) {
    super(http);
    // Defines the specific endpoint: http://localhost:8080/api/v1/loans
    this.resourceEndpoint = '/loans';
  }

  /**
   * Business-specific method to approve a loan.
   * POST /api/v1/loans/{loanId}/approve
   * @param loanId ID of the loan to approve.
   * @param approvalRequest Financial data for the Risk Engine.
   * @returns The updated loan (ACTIVE or REJECTED).
   */
  approve(loanId: number, approvalRequest: LoanApprovalRequest): Observable<Loan> {
    const url = `${this.resourcePath()}/${loanId}/approve`;

    return this.http.post<Loan>(url, JSON.stringify(approvalRequest), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Retrieves a specific loan by ID, including its schedule.
   * GET /api/v1/loans/{id}
   */
  getById(loanId: number): Observable<Loan> {
    const url = `${this.resourcePath()}/${loanId}`;
    return this.http.get<Loan>(url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Retrieves the list of loans for a specific client.
   * GET /api/v1/loans?clientId={clientId}
   */
  getLoansByClientId(clientId: number): Observable<Loan[]> {
    const url = `${this.resourcePath()}?clientId=${clientId}`;
    return this.http.get<Loan[]>(url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
