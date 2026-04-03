import { NextResponse } from 'next/server';
import { createClient } from '../../../../infrastructure/api/supabase/server';
import { SupabasePaymentRepositoryImpl } from '../../../../infrastructure/repositories/supabase-payment.repository.impl';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { code, message, orderId } = body;

    console.log('[Payment Fail API] Parameters:', { code, message, orderId });

    if (!orderId) {
      console.error('[Payment Fail API] Missing orderId parameter');
      return NextResponse.json({ error: 'Missing orderId parameter. Cannot update payment state.' }, { status: 400 });
    }

    const paymentRepo = new SupabasePaymentRepositoryImpl(supabase);
    
    // Determine the status from Toss Payments error code
    const status = code === 'PAY_PROCESS_CANCELED' ? 'canceled' : 'failed';
    const failReason = `${code || 'UNKNOWN_CODE'}: ${message || 'No specific fail message provided'}`;

    const payment = await paymentRepo.updatePaymentStatus(orderId, status, failReason);

    if (!payment) {
      console.warn(`[Payment Fail API] Failed to find or update payment record in DB for order: ${orderId}`);
    }

    return NextResponse.json({ success: true, payment, status });
  } catch (error: any) {
    console.error('[Payment Fail API] Unexpected Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
