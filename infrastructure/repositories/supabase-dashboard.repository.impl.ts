import { DashboardRepositoryPort } from '../../application/ports/dashboard.repository.port';
import { DashboardStats, ActivityLog } from '../../core/entities/dashboard.entity';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseDashboardRepositoryImpl implements DashboardRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('plan, next_billing_date')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    const { count: notesCount } = await this.supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { data: aiLogs } = await this.supabase
      .from('ai_usage_logs')
      .select('id')
      .eq('user_id', userId)
      .gte('used_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    // Basic mock mapping assuming limitations based on plan
    const isPro = user.plan === 'pro';
    return {
      plan: user.plan as DashboardStats['plan'],
      status: 'Active',
      nextBillingDate: user.next_billing_date,
      price: isPro ? 10 : 0,
      notesCount: notesCount || 0,
      notesLimit: isPro ? 10000 : 1000,
      storageUsed: 2.4, // Mocked for now
      storageLimit: isPro ? 100 : 10,
      aiSummariesUsed: aiLogs?.length || 0,
      aiSummariesLimit: isPro ? 500 : 50,
    };
  }

  async getRecentActivities(userId: string): Promise<ActivityLog[]> {
    const { data: notes } = await this.supabase
      .from('notes')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);

    const activities: ActivityLog[] = [];
    if (notes) {
      notes.forEach(note => {
        activities.push({
          id: note.id,
          type: 'note_create',
          message: `새로운 노트 '${note.title}'이(가) 생성되었습니다.`,
          createdAt: note.created_at,
        });
      });
    }

    // Sort by created_at descending
    return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
