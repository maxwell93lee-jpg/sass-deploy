import { SupabaseClient } from '@supabase/supabase-js';
import { PaymentRepositoryPort } from '../../application/ports/payment.repository.port';
import { Payment, CreatePaymentInput } from '../../core/entities/payment.entity';

export class SupabasePaymentRepositoryImpl implements PaymentRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) { }

  async createPayment(data: CreatePaymentInput): Promise<Payment> {
    // Generate an orderId starting with CN for CloudNote
    const orderId = `CN_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    const newPayment: Payment = {
      id: orderId,
      ...data,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const { error } = await this.supabase
        .from('payments')
        .insert({
          id: newPayment.id,
          user_id: newPayment.userId,
          plan_id: newPayment.planId,
          amount: newPayment.amount,
          method: newPayment.method,
          status: newPayment.status,
          created_at: newPayment.createdAt,
        });

      if (error) {
        console.error('Supabase DB Insert Error:', error.message);
        throw new Error('Failed to create payment record');
      }
    } catch (e) {
      console.error('Network/Supabase Error:', e);
      throw e;
    }

    return newPayment;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        planId: data.plan_id,
        amount: data.amount,
        method: data.method,
        status: data.status,
        failReason: data.fail_reason,
        createdAt: data.created_at,
      };
    } catch (e) {
      console.error('Error fetching payment:', e);
      return null;
    }
  }

  async updatePaymentStatus(id: string, status: Payment['status'], failReason?: string): Promise<Payment | null> {
    try {
      const updateData: any = { status };
      if (failReason !== undefined) {
        updateData.fail_reason = failReason;
      }

      const { data, error } = await this.supabase
        .from('payments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Error updating payment status:', error?.message);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        planId: data.plan_id,
        amount: data.amount,
        method: data.method,
        status: data.status,
        failReason: data.fail_reason,
        createdAt: data.created_at,
      };
    } catch (e) {
      console.error('Error updating payment status:', e);
      return null;
    }
  }
}
