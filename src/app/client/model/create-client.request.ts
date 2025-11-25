/**
 * DTO de Creación.
 * Datos necesarios para registrar un nuevo cliente.
 * Espejo de: com.nexus.backend.client.interfaces.rest.resources.CreateClientResource
 */
export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}
