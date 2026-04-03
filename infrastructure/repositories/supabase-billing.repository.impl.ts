import { SupabaseClient } from '@supabase/supabase-js';
import { BillingRepositoryPort } from '../../application/ports/billing.repository.port';
import { BillingUser } from '../../core/entities/billing.entity';

export class SupabaseBillingRepositoryImpl implements BillingRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUsersDueForBilling(date: Date): Promise<BillingUser[]> {
    const isoDateString = date.toISOString();

    const { data, error } = await this.supabase
      .from('users')
      .select('id, email, plan, customer_key, billing_key, next_billing_date')
      // Only users with an active billing key (so Pro/Enterprise who are subscribed)
      .not('billing_key', 'is', null)
      // Only users whose next_billing_date is less than or equal to the specified date
      .lte('next_billing_date', isoDateString);

    if (error) {
      console.error('[SupabaseBillingRepositoryImpl] Error fetching users due for billing:', error);
      throw new Error('Failed to fetch users due for billing');
    }

    if (!data) return [];

    return data.map((user: any): BillingUser => ({
      userId: user.id,
      email: user.email,
      customerName: user.raw_user_meta_data?.full_name || '사용자',
      planId: user.plan,
      customerKey: user.customer_key,
      billingKey: user.billing_key,
      nextBillingDate: user.next_billing_date,
    }));
  }

  async updateNextBillingDate(userId: string, newDate: Date): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ next_billing_date: newDate.toISOString() })
      .eq('id', userId);

    if (error) {
      console.error(`[SupabaseBillingRepositoryImpl] Error updating billing date for ${userId}:`, error);
      throw new Error(`Failed to update next billing date for user ${userId}`);
    }
  }

  async cancelSubscription(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ 
        billing_key: null,
        customer_key: null 
      })
      .eq('id', userId);

    if (error) {
      console.error(`[SupabaseBillingRepositoryImpl] Error cancelling subscription for ${userId}:`, error);
      throw new Error(`Failed to cancel subscription for user ${userId}`);
    }
  }
}
