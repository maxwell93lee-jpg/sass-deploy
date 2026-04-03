import { DashboardRepositoryPort } from '../../../application/ports/dashboard.repository.port';
import { DashboardData } from '../../entities/dashboard.entity';

export class GetDashboardDataUseCase {
  constructor(private readonly dashboardRepository: DashboardRepositoryPort) {}

  async execute(userId: string): Promise<DashboardData> {
    const stats = await this.dashboardRepository.getDashboardStats(userId);
    const activities = await this.dashboardRepository.getRecentActivities(userId);

    return {
      stats,
      activities
    };
  }
}
