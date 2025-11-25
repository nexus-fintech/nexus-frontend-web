/**
 * Modelo de Dominio (Frontend).
 * Representa un Préstamo en el sistema.
 * Espejo de: com.nexus.backend.loan.interfaces.rest.resources.LoanResource
 */
export interface Loan {
  id: number;
  clientId: number;
  requestedAmount: number;
  annualInterestRate: number;
  termInMonths: number;
  status: 'REQUESTED' | 'ACTIVE' | 'REJECTED' | 'PAID' | 'DEFAULT'; // Tipado estricto para el Enum
  disbursementDate?: string; // Opcional: Viene null si el estado es REQUESTED
}
