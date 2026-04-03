import { PaymentRepositoryPort } from '../../../application/ports/payment.repository.port';
import { Payment, CreatePaymentInput } from '../../entities/payment.entity';

export class CreateMockPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepositoryPort) {}

  async execute(input: CreatePaymentInput): Promise<Payment> {
    // Ideally this would connect to Toss/Stripe/KakaoPay to verify the token/amount 
    // and then save the record to the database via repository port.
    // For this mock implementation, we just validate the inputs and store directly.

    if (!input.userId || !input.planId || input.amount <= 0) {
      throw new Error("Invalid payment metadata");
    }

    return this.paymentRepository.createPayment(input);
  }
}
