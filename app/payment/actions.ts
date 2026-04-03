'use server';

import { createClient } from '../../infrastructure/api/supabase/server';
import { SupabasePaymentRepositoryImpl } from '../../infrastructure/repositories/supabase-payment.repository.impl';
import { CreateMockPaymentUseCase } from '../../core/use-cases/payment/create-mock-payment.use-case';
import { redirect } from 'next/navigation';

export async function processMockPaymentAction(paymentData: { planId: string; amount: number; method: string }) {
  const supabase = await createClient();
  
  // Verify UI auth user
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || 'anonymous-test-user';

  const paymentRepository = new SupabasePaymentRepositoryImpl(supabase);
  const useCase = new CreateMockPaymentUseCase(paymentRepository);

  try {
    const payment = await useCase.execute({
      userId,
      planId: paymentData.planId as any,
      amount: paymentData.amount,
      method: paymentData.method as any,
    });
    
    // Redirect to success page on success
    // Using string parameter passing for demo purposes (usually securely signed token)
    return { success: true, redirectUri: `/payment-done?orderId=${payment.id}&method=${payment.method}&amount=${payment.amount}` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
