export interface LoanRequest {
  clientId: number;
  amount: number;
  termInMonths: number;
  annualInterestRate: number;
}
