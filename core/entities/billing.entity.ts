export interface BillingUser {
  userId: string;
  email: string;
  customerName: string;
  planId: 'pro' | 'enterprise';
  customerKey: string;
  billingKey: string;
  nextBillingDate: string;
}
