import { Payment, CreatePaymentInput } from '../../core/entities/payment.entity';

export interface PaymentRepositoryPort {
  createPayment(data: CreatePaymentInput): Promise<Payment>;
  getPaymentById(id: string): Promise<Payment | null>;
  updatePaymentStatus(id: string, status: Payment['status'], failReason?: string): Promise<Payment | null>;
}
