import { BillingRepositoryPort } from '../../../application/ports/billing.repository.port';

export class CancelSubscriptionUseCase {
  constructor(private readonly billingRepo: BillingRepositoryPort) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for cancellation');
    }

    // Cancellation currently means removing the billing key so the next cycle is not charged.
    // The user keeps their current plan until the next_billing_date is reached.
    await this.billingRepo.cancelSubscription(userId);
  }
}
