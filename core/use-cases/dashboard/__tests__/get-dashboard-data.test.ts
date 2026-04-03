import { GetDashboardDataUseCase } from '../get-dashboard-data.use-case';
import { DashboardRepositoryPort } from '../../../../application/ports/dashboard.repository.port';

describe('GetDashboardDataUseCase', () => {
  let mockDashboardRepository: jest.Mocked<DashboardRepositoryPort>;
  let useCase: GetDashboardDataUseCase;

  beforeEach(() => {
    mockDashboardRepository = {
      getDashboardStats: jest.fn(),
      getRecentActivities: jest.fn(),
    };
    useCase = new GetDashboardDataUseCase(mockDashboardRepository);
  });

  it('should return combined dashboard data for a given user', async () => {
    // Arrange
    const userId = 'user-123';
    mockDashboardRepository.getDashboardStats.mockResolvedValue({
      plan: 'pro',
      status: 'Active',
      nextBillingDate: '2024-11-15T00:00:00.000Z',
      price: 12900,
      notesCount: 428,
      notesLimit: 1000,
      storageUsed: 2.4, // GB
      storageLimit: 10, // GB
      aiSummariesUsed: 15,
      aiSummariesLimit: 50,
    });
    mockDashboardRepository.getRecentActivities.mockResolvedValue([
      { id: '1',  type: 'note_create', message: "새로운 노트 '주간 회의록'이 생성되었습니다.", createdAt: '2024-10-24T10:00:00.000Z' }
    ]);

    // Act
    const result = await useCase.execute(userId);

    // Assert
    expect(mockDashboardRepository.getDashboardStats).toHaveBeenCalledWith(userId);
    expect(mockDashboardRepository.getRecentActivities).toHaveBeenCalledWith(userId);
    expect(result.stats.plan).toBe('pro');
    expect(result.activities).toHaveLength(1);
    expect(result.activities[0].type).toBe('note_create');
  });
});
