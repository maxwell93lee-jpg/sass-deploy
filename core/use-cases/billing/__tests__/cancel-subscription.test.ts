import { CancelSubscriptionUseCase } from '../cancel-subscription.use-case';
import { BillingRepositoryPort } from '../../../../application/ports/billing.repository.port';

describe('CancelSubscriptionUseCase', () => {
  let useCase: CancelSubscriptionUseCase;
  let mockBillingRepo: jest.Mocked<BillingRepositoryPort>;

  beforeEach(() => {
    mockBillingRepo = {
      getUsersDueForBilling: jest.fn(),
      updateNextBillingDate: jest.fn(),
      cancelSubscription: jest.fn(),
    };
    useCase = new CancelSubscriptionUseCase(mockBillingRepo);
  });

  it('should call cancelSubscription on the repository with correct userId', async () => {
    const userId = 'test-user-id';
    mockBillingRepo.cancelSubscription.mockResolvedValue(undefined);

    await useCase.execute(userId);

    expect(mockBillingRepo.cancelSubscription).toHaveBeenCalledWith(userId);
    expect(mockBillingRepo.cancelSubscription).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if userId is missing', async () => {
    await expect(useCase.execute('')).rejects.toThrow('User ID is required for cancellation');
  });
});
