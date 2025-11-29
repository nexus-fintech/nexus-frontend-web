import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { Client } from "../model/client.entity";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, of, retry} from 'rxjs';
import {UpdateClientRequest} from '../model/update-client.request';

/**
 * Infrastructure Service for the Client Bounded Context.
 * Handles HTTP communication with the /clients endpoint.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientsService extends BaseService<Client> {

  constructor(http: HttpClient) {
    super(http);
    // Defines the specific endpoint: http://localhost:8080/api/v1/clients
    this.resourceEndpoint = '/clients';
  }

  getClientByUserId(userId: number): Observable<Client | null> {
    const url = `${this.resourcePath()}/by-user/${userId}`;

    return this.http.get<Client>(url, this.httpOptions).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.warn(`Profile not found for user ID ${userId}. Returning null.`);
          return of(null);
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Retrieves a client by its numeric ID.
   * GET /api/v1/clients/{id}
   */
  getById(id: number): Observable<Client> {
    const url = `${this.resourcePath()}/${id}`;
    return this.http.get<Client>(url, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Updates an existing client.
   * PUT /api/v1/clients/{id}
   */
  override update(id: number, data: UpdateClientRequest): Observable<Client> {
    const url = `${this.resourcePath()}/${id}`;
    return this.http.put<Client>(url, JSON.stringify(data), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
