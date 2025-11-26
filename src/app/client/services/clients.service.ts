import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { Client } from "../model/client.entity";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';

/**
 * Servicio de Infraestructura para el Bounded Context: Client.
 * Maneja la comunicación HTTP con el endpoint /clients.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientsService extends BaseService<Client> {

  constructor(http: HttpClient) {
    super(http);
    // Define el endpoint específico: http://localhost:8080/api/v1/clients
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
}
