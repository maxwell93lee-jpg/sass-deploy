import { BillingRepositoryPort } from '../../../application/ports/billing.repository.port';
import { PaymentRepositoryPort } from '../../../application/ports/payment.repository.port';
import { PaymentGatewayPort } from '../../../application/ports/payment-gateway.port';

export class ProcessDailyBillingUseCase {
  constructor(
    private readonly billingRepo: BillingRepositoryPort,
    private readonly paymentRepo: PaymentRepositoryPort,
    private readonly paymentGateway: PaymentGatewayPort
  ) {}

  async execute(processDate: Date) {
    // 1. Get users scheduled for billing
    const users = await this.billingRepo.getUsersDueForBilling(processDate);
    
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      try {
        // We set Pro plan default mock price as 10 KRW to match subscription payment testing
        // In a real app, this amount would be retrieved from a product/subscription catalog
        const amount = user.planId === 'pro' ? 10 : 0;
        
        // Exclude completely free users if any leaked into the list
        if (amount === 0) continue;

        const orderId = `CN_RECV_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const orderName = `CloudNote ${user.planId.toUpperCase()} 플랜 월간 정기결제`;

        // 2. Call the payment gateway for recurring charge
        const result = await this.paymentGateway.executeBilling({
          customerKey: user.customerKey,
          billingKey: user.billingKey,
          amount,
          orderId,
          orderName,
          customerEmail: user.email,
          customerName: user.customerName,
        });

        if (result.success) {
          // 3. Record successful payment history
          await this.paymentRepo.createPayment({
            userId: user.userId,
            planId: user.planId,
            amount: amount,
            method: result.data?.card?.cardType || '카드(정기결제)',
            status: 'completed',
          });

          // 4. Calculate next billing date
          const KST_OFFSET = 9 * 60 * 60 * 1000;
          const kstBase = new Date(new Date().getTime() + KST_OFFSET);
          
          // 1개월 뒤 00:00:00 KST 계산
          const nextBillingDateKST = new Date(Date.UTC(
            kstBase.getUTCFullYear(),
            kstBase.getUTCMonth() + 1,
            kstBase.getUTCDate(),
            0, 0, 0, 0
          ));
          
          // DB(UTC)에 저장을 위해 다시 UTC로 변환
          const nextBillingDate = new Date(nextBillingDateKST.getTime() - KST_OFFSET);

          // 5. Update the user's next billing date
          await this.billingRepo.updateNextBillingDate(user.userId, nextBillingDate);

          successCount++;
        } else {
          // 3. Record failed payment history
          await this.paymentRepo.createPayment({
            userId: user.userId,
            planId: user.planId,
            amount: amount,
            method: 'unknown', // Could be unknown on failure if we don't have card details
            status: 'failed',
            failReason: result.error || 'Payment failed without error text',
          });

          failCount++;
        }
      } catch (error: any) {
        console.error(`[ProcessDailyBilling] Error processing user ${user.userId}:`, error.message);
        
        // Record unexpected error failure
        await this.paymentRepo.createPayment({
          userId: user.userId,
          planId: user.planId,
          amount: user.planId === 'pro' ? 10 : 0,
          method: 'unknown',
          status: 'failed',
          failReason: error.message || 'Unexpected application error',
        });
        
        failCount++;
      }
    }

    return {
      totalProcessed: users.length,
      successCount,
      failCount,
    };
  }
}
