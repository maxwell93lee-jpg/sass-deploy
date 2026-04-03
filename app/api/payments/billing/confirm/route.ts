import { NextResponse } from 'next/server';
import { createClient } from '../../../../../infrastructure/api/supabase/server';

const TOSS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY || 'test_sk_XjExPeJWYVQR12P55agr49R5gvNL';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authKey, customerKey } = body;

    console.log('[Billing Confirm API] Parameters:', { authKey, customerKey });

    if (!authKey || !customerKey) {
      console.error('[Billing Confirm API] Missing parameters');
      return NextResponse.json({ error: '인증 필수 정보가 누락되었습니다. (authKey, customerKey)' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Get current authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      console.error('[Billing Confirm API] Auth error or user not found:', authError);
      return NextResponse.json({ error: '인증된 사용자 정보를 찾을 수 없습니다.' }, { status: 401 });
    }
    const user = authData.user;

    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
    const headers = {
      Authorization: `Basic ${encryptedSecretKey}`,
      'Content-Type': 'application/json',
    };

    // 2. Issue Billing Key
    const issueResponse = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers,
      body: JSON.stringify({ authKey, customerKey }),
    });

    const issueData = await issueResponse.json();
    if (!issueResponse.ok || !issueData.billingKey) {
      console.error('[Billing Confirm API] Toss Issue Error:', issueData);
      return NextResponse.json({ error: issueData.message || '빌링키 발급에 실패했습니다.' }, { status: issueResponse.status });
    }

    const billingKey = issueData.billingKey;
    const cardCompany = issueData.card?.company || '알 수 없음';
    console.log('[Billing Confirm API] Issued Billing Key Successfully.', { customerKey, cardCompany });

    // 3. Execute the first automatic payment immediately
    const orderId = crypto.randomUUID();
    const initialAmount = 500; // 500 KRW for Pro plan test
    const orderName = 'CloudNote PRO 플랜 정기결제 (최초가입)';

    const { TossPaymentGatewayImpl } = await import('../../../../../infrastructure/api/tosspayments/toss-payment-gateway.impl');
    const paymentGateway = new TossPaymentGatewayImpl();

    const executeResult = await paymentGateway.executeBilling({
      customerKey,
      billingKey,
      amount: initialAmount,
      orderId,
      orderName,
      customerEmail: user.email || 'test@cloudnote.com',
      customerName: user.user_metadata?.full_name || '홍길동',
    });

    if (!executeResult.success) {
      console.error('[Billing Confirm API] Toss Execute Error:', executeResult.data);
      return NextResponse.json({ error: executeResult.error || '최초 정기결제 승인에 실패했습니다.' }, { status: executeResult.status || 500 });
    }
    
    const executeData = executeResult.data;

    // 4. Update Database
    // A. Record Payment History
    const { error: paymentDbError } = await supabase
      .from('payments')
      .insert({
        id: orderId,
        user_id: user.id,
        plan_id: 'pro',
        amount: initialAmount,
        method: executeData.card?.cardType || '카드(자동결제)',
        status: 'completed'
      });

    if (paymentDbError) {
      console.error('[Billing Confirm API] Payment Record DB Insert Error:', paymentDbError);
    }

    // B. Update User Profile with Billing Info
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const now = new Date();
    const kstBase = new Date(now.getTime() + KST_OFFSET);
    
    // 1개월 뒤 00:00:00 KST 계산
    const nextBillingDateKST = new Date(Date.UTC(
      kstBase.getUTCFullYear(),
      kstBase.getUTCMonth() + 1,
      kstBase.getUTCDate(),
      0, 0, 0, 0
    ));
    
    // DB(UTC)에 저장을 위해 다시 UTC로 변환
    const nextBillingDate = new Date(nextBillingDateKST.getTime() - KST_OFFSET);

    const { error: dbError } = await supabase
      .from('users')
      .update({ 
        plan: 'pro',
        next_billing_date: nextBillingDate.toISOString(),
        customer_key: customerKey,
        billing_key: billingKey
      })
      .eq('id', user.id);

    if (dbError) {
      console.error('[Billing Confirm API] User Plan DB Update Error:', dbError);
      // Depending on strictness, we might return error, but Toss already captured money. 
      // Return success but log critically in a real environment.
    }

    return NextResponse.json({ success: true, data: executeData });
  } catch (error: any) {
    console.error('[Billing Confirm API] Unexpected Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
