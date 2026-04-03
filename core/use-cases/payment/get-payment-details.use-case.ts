import { PaymentRepositoryPort } from '../../../application/ports/payment.repository.port';
import { Payment } from '../../entities/payment.entity';

export class GetPaymentDetailsUseCase {
  constructor(private readonly paymentRepository: PaymentRepositoryPort) {}

  async execute(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.getPaymentById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }
}
