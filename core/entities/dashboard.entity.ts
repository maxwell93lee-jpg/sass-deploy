export interface DashboardStats {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'Active' | 'Inactive';
  nextBillingDate: string | null;
  price: number;
  notesCount: number;
  notesLimit: number;
  storageUsed: number;
  storageLimit: number;
  aiSummariesUsed: number;
  aiSummariesLimit: number;
}

export interface ActivityLog {
  id: string;
  type: 'note_create' | 'ai_summary' | 'sync' | 'share' | 'login';
  message: string;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activities: ActivityLog[];
}
