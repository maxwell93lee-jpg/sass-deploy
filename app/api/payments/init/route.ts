import { NextResponse } from 'next/server';
import { createClient } from '../../../../infrastructure/api/supabase/server';
import { SupabasePaymentRepositoryImpl } from '../../../../infrastructure/repositories/supabase-payment.repository.impl';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please login to continue.' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, amount, method } = body;

    if (!planId || !amount) {
      return NextResponse.json({ error: 'Missing required parameters. (planId, amount)' }, { status: 400 });
    }

    const paymentRepo = new SupabasePaymentRepositoryImpl(supabase);
    
    // Create the payment in 'pending' status
    const payment = await paymentRepo.createPayment({
      userId: user.id,
      planId,
      amount: Number(amount),
      method: method || 'tospay', // Fallback
    });

    return NextResponse.json({ success: true, orderId: payment.id });
  } catch (error: any) {
    console.error('[Payment Init API] Unexpected Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
