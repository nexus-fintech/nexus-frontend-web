/**
 * Domain Model (Frontend).
 * Represents a Loan in the system.
 * Mirror of: com.nexus.backend.loan.interfaces.rest.resources.LoanResource
 */

import {ScheduleEntry} from './schedule-entry.entity';

export interface Loan {
  id: number;
  clientId: number;
  requestedAmount: number;
  annualInterestRate: number;
  termInMonths: number;
  status: 'REQUESTED' | 'ACTIVE' | 'REJECTED' | 'PAID' | 'DEFAULT';
  disbursementDate?: string;
  schedule?: ScheduleEntry[];
}
