import { Payment } from '../entities/Payment';

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByBookingId(bookingId: string): Promise<Payment | null>;
  create(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
}
