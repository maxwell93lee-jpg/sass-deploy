import { PaymentGatewayPort, ExecuteBillingParams, ExecuteBillingResult } from '../../../application/ports/payment-gateway.port';

const TOSS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY || 'test_sk_XjExPeJWYVQR12P55agr49R5gvNL';

export class TossPaymentGatewayImpl implements PaymentGatewayPort {
  async executeBilling(params: ExecuteBillingParams): Promise<ExecuteBillingResult> {
    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
    const headers = {
      Authorization: `Basic ${encryptedSecretKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const executeResponse = await fetch(`https://api.tosspayments.com/v1/billing/${params.billingKey}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerKey: params.customerKey,
          amount: params.amount,
          orderId: params.orderId,
          orderName: params.orderName,
          customerEmail: params.customerEmail,
          customerName: params.customerName,
          taxFreeAmount: 0,
        }),
      });

      const executeData = await executeResponse.json();
      
      if (!executeResponse.ok) {
        console.error('[TossPaymentGatewayImpl] Toss Execute Error:', executeData);
        return {
          success: false,
          error: executeData.message || '정기결제 승인에 실패했습니다.',
          status: executeResponse.status,
          data: executeData
        };
      }
      
      return {
        success: true,
        data: executeData,
        status: 200
      };
    } catch (error: any) {
      console.error('[TossPaymentGatewayImpl] Network Error:', error);
      return {
        success: false,
        error: error.message || '네트워크 오류가 발생했습니다.',
        status: 500
      };
    }
  }
}
