export interface ScheduleEntry {
  id: number;
  installmentNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  fee: number;
  totalAmount: number;
  isPaid: boolean;
}
