export interface Payment {
  id: string;
  userId: string;
  planId: 'pro' | 'enterprise'; // free doesn't require payment in this mock
  amount: number;
  method: string; // Toss method or string descriptor ('kakaopay', 'naverpay', 'card', etc)
  status: 'completed' | 'failed' | 'pending' | 'canceled';
  failReason?: string;
  createdAt: string;
}

export type CreatePaymentInput = Omit<Payment, 'id' | 'createdAt' | 'status'> & {
  status?: Payment['status'];
};
