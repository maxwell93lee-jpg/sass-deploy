import { NextResponse } from 'next/server';
import { createClient } from '../../../../infrastructure/api/supabase/server';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    console.log('[Payment Confirm API] Parameters:', { paymentKey, orderId, amount });

    if (!paymentKey || !orderId || !amount) {
      console.error('[Payment Confirm API] Missing parameters');
      return NextResponse.json({ error: '결제 필수 정보가 누락되었습니다. (paymentKey, orderId, amount)' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Validate payment amount against the original record in DB to prevent manipulation
    const { data: paymentRecord, error: fetchError } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('id', orderId)
      .single();

    if (fetchError || !paymentRecord) {
      console.error('[Payment Confirm API] Payment Record Not Found:', orderId);
      return NextResponse.json({ error: '해당 주문 번호를 찾을 수 없습니다.' }, { status: 400 });
    }

    if (paymentRecord.amount !== Number(amount)) {
      console.error('[Payment Confirm API] Amount Mismatch Detected.', { expected: paymentRecord.amount, received: amount });
      
      // Optionally update status to 'failed' due to manipulation
      await supabase.from('payments').update({ status: 'failed', fail_reason: 'Amount mismatch (Tampering detected)' }).eq('id', orderId);

      return NextResponse.json({ error: '결제 시도 금액과 실제 요청 금액이 일치하지 않습니다. 위변조가 의심됩니다.' }, { status: 400 });
    }

    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');

    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        paymentKey, 
        orderId, 
        amount: Number(amount) 
      }),
    });

    const tossData = await tossResponse.json();
    console.log('[Payment Confirm API] Toss Response:', { ok: tossResponse.ok, status: tossResponse.status, data: tossData });

    if (!tossResponse.ok) {
      return NextResponse.json({ error: tossData.message || '토스 결제 승인에 실패했습니다.' }, { status: tossResponse.status });
    }

    // Update user plan in Supabase
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      console.error('[Payment Confirm API] Auth error or user not found:', authError);
      // We still consider the payment successful at Toss, but we couldn't link it to a user.
      // In a real app, you might want to log this as a critical failure for manual intervention.
      return NextResponse.json({ 
        success: true, 
        data: tossData,
        warning: '결제는 완료되었으나 사용자 정보를 확인하지 못했습니다.' 
      });
    }

    const user = authData.user;
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const { error: dbError } = await supabase
      .from('users')
      .update({ 
        plan: 'pro',
        next_billing_date: nextBillingDate.toISOString()
      })
      .eq('id', user.id);

    if (dbError) {
      console.error('[Payment Confirm API] User Plan DB Update Error:', dbError);
    }

    // Now update the payment record to 'completed'
    const { error: paymentDbError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        method: tossData.method || 'unknown'
      })
      .eq('id', orderId);

    if (paymentDbError) {
      console.error('[Payment Confirm API] Payment Record DB Update Error:', paymentDbError);
    }

    return NextResponse.json({ success: true, data: tossData });
  } catch (error: any) {
    console.error('[Payment Confirm API] Unexpected Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
