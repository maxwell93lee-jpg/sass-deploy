import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SupabaseBillingRepositoryImpl } from '../../../../infrastructure/repositories/supabase-billing.repository.impl';
import { SupabasePaymentRepositoryImpl } from '../../../../infrastructure/repositories/supabase-payment.repository.impl';
import { TossPaymentGatewayImpl } from '../../../../infrastructure/api/tosspayments/toss-payment-gateway.impl';
import { ProcessDailyBillingUseCase } from '../../../../core/use-cases/billing/process-daily-billing.use-case';

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret for Authorization
  // Note: Vercel sends `Authorization: Bearer <CRON_SECRET>` with cron requests.
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('[Cron Billing] Unauthorized access attempt.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Initialize Admin Supabase Client
    // A Service Role Key is required to bypass Row Level Security (RLS) when querying all users for billing.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('[Cron Billing] WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Using anon key which may fail due to RLS policies.');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // 3. Initialize Ports and Use Case
    const billingRepo = new SupabaseBillingRepositoryImpl(supabaseAdmin);
    const paymentRepo = new SupabasePaymentRepositoryImpl(supabaseAdmin);
    const paymentGateway = new TossPaymentGatewayImpl();

    const processBillingUseCase = new ProcessDailyBillingUseCase(billingRepo, paymentRepo, paymentGateway);

    // 4. Execute the daily billing use case
    const runDate = new Date();
    console.log(`[Cron Billing] Starting daily billing execution at ${runDate.toISOString()}`);
    
    const result = await processBillingUseCase.execute(runDate);

    console.log(`[Cron Billing] Completed. Processed: ${result.totalProcessed}, Success: ${result.successCount}, Fail: ${result.failCount}`);

    return NextResponse.json({
      message: 'Batch processing completed',
      processDate: runDate.toISOString(),
      result
    });
  } catch (error: any) {
    console.error('[Cron Billing] Unexpected Error:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
