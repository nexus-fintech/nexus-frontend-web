/**
 * Modelo de Dominio (Frontend).
 * Espejo de: com.nexus.backend.client.interfaces.rest.resources.ClientResource
 */
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}
