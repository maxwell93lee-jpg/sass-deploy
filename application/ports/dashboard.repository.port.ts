import { DashboardStats, ActivityLog } from '../../core/entities/dashboard.entity';

export interface DashboardRepositoryPort {
  getDashboardStats(userId: string): Promise<DashboardStats>;
  getRecentActivities(userId: string): Promise<ActivityLog[]>;
}
