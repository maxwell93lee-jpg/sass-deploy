import { ProcessDailyBillingUseCase } from '../process-daily-billing.use-case';
import { BillingRepositoryPort } from '../../../../application/ports/billing.repository.port';
import { PaymentRepositoryPort } from '../../../../application/ports/payment.repository.port';
import { PaymentGatewayPort } from '../../../../application/ports/payment-gateway.port';
import { BillingUser } from '../../../entities/billing.entity';
import { Payment } from '../../../entities/payment.entity';

describe('ProcessDailyBillingUseCase', () => {
  let useCase: ProcessDailyBillingUseCase;
  let mockBillingRepo: jest.Mocked<BillingRepositoryPort>;
  let mockPaymentRepo: jest.Mocked<PaymentRepositoryPort>;
  let mockPaymentGateway: jest.Mocked<PaymentGatewayPort>;

  const mockUsers: BillingUser[] = [
    {
      userId: 'user-1',
      email: 'user1@example.com',
      customerName: 'User One',
      planId: 'pro',
      customerKey: 'cust_1',
      billingKey: 'bill_1',
      nextBillingDate: '2026-04-01T00:00:00.000Z',
    },
    {
      userId: 'user-2',
      email: 'user2@example.com',
      customerName: 'User Two',
      planId: 'pro',
      customerKey: 'cust_2',
      billingKey: 'bill_2',
      nextBillingDate: '2026-04-01T10:00:00.000Z',
    },
  ];

  beforeEach(() => {
    mockBillingRepo = {
      getUsersDueForBilling: jest.fn(),
      updateNextBillingDate: jest.fn(),
    };

    mockPaymentRepo = {
      createPayment: jest.fn(),
      getPaymentById: jest.fn(),
      updatePaymentStatus: jest.fn(),
    };

    mockPaymentGateway = {
      executeBilling: jest.fn(),
    };

    useCase = new ProcessDailyBillingUseCase(
      mockBillingRepo,
      mockPaymentRepo,
      mockPaymentGateway
    );
  });

  it('should get users due for billing and process each correctly', async () => {
    const processDate = new Date('2026-04-01T23:59:59.999Z');
    
    mockBillingRepo.getUsersDueForBilling.mockResolvedValue(mockUsers);
    mockPaymentGateway.executeBilling.mockResolvedValue({
      success: true,
      data: { method: 'card' },
    });
    mockPaymentRepo.createPayment.mockResolvedValue({
      id: 'mock-id',
      status: 'completed'
    } as Payment);

    const result = await useCase.execute(processDate);

    expect(mockBillingRepo.getUsersDueForBilling).toHaveBeenCalledWith(processDate);
    expect(result.totalProcessed).toBe(2);
    expect(result.successCount).toBe(2);
    expect(result.failCount).toBe(0);

    // Verify gateway called twice with correct params
    expect(mockPaymentGateway.executeBilling).toHaveBeenCalledTimes(2);
    expect(mockPaymentGateway.executeBilling).toHaveBeenCalledWith(
      expect.objectContaining({
        customerKey: 'cust_1',
        billingKey: 'bill_1',
        amount: 10, // Assuming static 10 KRW for mock Pro
        customerEmail: 'user1@example.com',
      })
    );

    // Verify createPayment was called with 'completed'
    expect(mockPaymentRepo.createPayment).toHaveBeenCalledTimes(2);
    expect(mockPaymentRepo.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        status: 'completed'
      })
    );

    // Verify next billing date was updated (+1 month approx)
    expect(mockBillingRepo.updateNextBillingDate).toHaveBeenCalledTimes(2);
  });

  it('should handle payment failure correctly', async () => {
    const processDate = new Date('2026-04-01T23:59:59.999Z');
    
    // Return only one user
    mockBillingRepo.getUsersDueForBilling.mockResolvedValue([mockUsers[0]]);
    
    // Gateway returns failure
    mockPaymentGateway.executeBilling.mockResolvedValue({
      success: false,
      error: 'Card declined',
    });
    mockPaymentRepo.createPayment.mockResolvedValue({} as Payment);

    const result = await useCase.execute(processDate);

    expect(result.totalProcessed).toBe(1);
    expect(result.successCount).toBe(0);
    expect(result.failCount).toBe(1);

    // Should create a 'failed' payment log
    expect(mockPaymentRepo.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        status: 'failed',
        failReason: 'Card declined',
      })
    );

    // NOT called: Next billing date should not be advanced
    expect(mockBillingRepo.updateNextBillingDate).not.toHaveBeenCalled();
  });
});
