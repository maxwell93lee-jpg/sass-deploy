export interface ExecuteBillingParams {
  customerKey: string;
  billingKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail: string;
  customerName: string;
}

export interface ExecuteBillingResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

export interface PaymentGatewayPort {
  /**
   * Translates a billing key into a payment via Toss Payments API
   */
  executeBilling(params: ExecuteBillingParams): Promise<ExecuteBillingResult>;
}
