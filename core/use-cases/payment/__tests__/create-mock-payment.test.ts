import { CreateMockPaymentUseCase } from '../create-mock-payment.use-case';
import { PaymentRepositoryPort } from '../../../../application/ports/payment.repository.port';

describe('CreateMockPaymentUseCase', () => {
  let mockPaymentRepo: jest.Mocked<PaymentRepositoryPort>;
  let useCase: CreateMockPaymentUseCase;

  beforeEach(() => {
    mockPaymentRepo = {
      createPayment: jest.fn(),
      getPaymentById: jest.fn(),
      updatePaymentStatus: jest.fn(),
    };
    useCase = new CreateMockPaymentUseCase(mockPaymentRepo);
  });

  it('should successfully create a mock payment and return true completion status', async () => {
    const input = {
      userId: 'user-1',
      planId: 'pro' as const,
      amount: 10800,
      method: 'card' as const,
    };

    mockPaymentRepo.createPayment.mockResolvedValue({
      id: 'mock-tx-123',
      ...input,
      status: 'completed',
      createdAt: '2024-05-22T14:30:00Z',
    });

    const result = await useCase.execute(input);

    expect(result.status).toBe('completed');
    expect(result.id).toBe('mock-tx-123');
    expect(mockPaymentRepo.createPayment).toHaveBeenCalledWith(input);
  });
});
