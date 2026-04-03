import { BillingUser } from '../../core/entities/billing.entity';

export interface BillingRepositoryPort {
  /**
   * Retrieves users who are due for billing up to the specified date.
   */
  getUsersDueForBilling(date: Date): Promise<BillingUser[]>;
  
  /**
   * Updates the next billing date for a user.
   */
  updateNextBillingDate(userId: string, newDate: Date): Promise<void>;

  /**
   * Cancels the subscription by removing the billing key.
   */
  cancelSubscription(userId: string): Promise<void>;
}
