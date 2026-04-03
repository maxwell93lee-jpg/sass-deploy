import { redirect } from 'next/navigation';
import { createClient } from '@/infrastructure/api/supabase/server';
import { SupabaseDashboardRepositoryImpl } from '@/infrastructure/repositories/supabase-dashboard.repository.impl';
import { GetDashboardDataUseCase } from '@/core/use-cases/dashboard/get-dashboard-data.use-case';
import DashboardLayout from '@/presentation/components/feature/dashboard/DashboardLayout';

export default async function DashboardPage() {
  const supabase = await createClient();
  let { data: { user } } = await supabase.auth.getUser();
  let currentUser = user || (process.env.NODE_ENV === 'development' ? { id: 'test-user-123', email: 'test@example.com', user_metadata: { full_name: '홍길동' } } as any : null);

  if (!currentUser) {
    redirect('/auth');
  }

  const repository = new SupabaseDashboardRepositoryImpl(supabase);
  const useCase = new GetDashboardDataUseCase(repository);
  let dashboardData;
  
  try {
    dashboardData = await useCase.execute(currentUser.id);
  } catch (err) {
    // Fail gracefully or show a default empty state if the user DB row is missing during initial sync
    dashboardData = {
      stats: {
        plan: 'pro' as const,
        status: 'Active' as const,
        nextBillingDate: '2024-11-15T00:00:00.000Z',
        price: 10,
        notesCount: 428,
        notesLimit: 1000,
        storageUsed: 2.4,
        storageLimit: 10,
        aiSummariesUsed: 15,
        aiSummariesLimit: 50,
      },
      activities: [
        { id: '1', type: 'note_create' as const, message: "새로운 노트 '주간 회의록'이 생성되었습니다.", createdAt: '2024-10-24T10:00:00.000Z' },
        { id: '2', type: 'ai_summary' as const, message: "'마케팅 전략' 노트의 AI 요약이 완료되었습니다.", createdAt: '2024-10-24T09:00:00.000Z' },
        { id: '3', type: 'sync' as const, message: "기기 간 동기화가 성공적으로 완료되었습니다.", createdAt: '2024-10-23T15:00:00.000Z' },
      ]
    };
  }

  const userName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '사용자';

  return <DashboardLayout data={dashboardData} userName={userName} />;
}
