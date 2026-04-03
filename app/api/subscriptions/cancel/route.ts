import { NextResponse } from 'next/server';
import { createClient } from '@/infrastructure/api/supabase/server';
import { SupabaseBillingRepositoryImpl } from '@/infrastructure/repositories/supabase-billing.repository.impl';
import { CancelSubscriptionUseCase } from '@/core/use-cases/billing/cancel-subscription.use-case';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // 1. Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 2. Initialize dependencies
    const repository = new SupabaseBillingRepositoryImpl(supabase);
    const useCase = new CancelSubscriptionUseCase(repository);

    // 3. Execute cancellation
    await useCase.execute(user.id);

    return NextResponse.json({ success: true, message: '구독이 성공적으로 해지되었습니다. 남아있는 기간 동안은 프로 기능을 계속 이용하실 수 있습니다.' });
  } catch (error: any) {
    console.error('[Subscription Cancel API] Error:', error);
    return NextResponse.json({ error: error.message || ' Internal Server Error' }, { status: 500 });
  }
}
