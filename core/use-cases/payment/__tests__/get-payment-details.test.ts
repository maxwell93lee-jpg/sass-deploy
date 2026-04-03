import { GetPaymentDetailsUseCase } from '../get-payment-details.use-case';
import { PaymentRepositoryPort } from '../../../../application/ports/payment.repository.port';

describe('GetPaymentDetailsUseCase', () => {
  let mockPaymentRepo: jest.Mocked<PaymentRepositoryPort>;
  let useCase: GetPaymentDetailsUseCase;

  beforeEach(() => {
    mockPaymentRepo = {
      createPayment: jest.fn(),
      getPaymentById: jest.fn(),
      updatePaymentStatus: jest.fn(),
    };
    useCase = new GetPaymentDetailsUseCase(mockPaymentRepo);
  });

  it('should retrieve payment details correctly for a valid id', async () => {
    mockPaymentRepo.getPaymentById.mockResolvedValue({
      id: 'mock-tx-123',
      userId: 'user-1',
      planId: 'pro',
      amount: 10800,
      method: 'card',
      status: 'completed',
      createdAt: '2024-05-22T14:30:00Z',
    });

    const result = await useCase.execute('mock-tx-123');

    expect(result).not.toBeNull();
    expect(result?.id).toBe('mock-tx-123');
    expect(mockPaymentRepo.getPaymentById).toHaveBeenCalledWith('mock-tx-123');
  });

  it('should throw an error for a missing or invalid id', async () => {
    mockPaymentRepo.getPaymentById.mockResolvedValue(null);
    await expect(useCase.execute('invalid')).rejects.toThrow('Payment not found');
  });
});
