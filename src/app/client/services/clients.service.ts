import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { Client } from "../model/client.entity";
import {HttpClient} from '@angular/common/http';

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
}
