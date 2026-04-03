'use client';

import React, { useState } from 'react';
import PaymentLayout from '../../presentation/components/feature/payment/PaymentLayout';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || 'test_ck_4vZnjEJeQVxJzDoab4d8PmOoBN0k';

// Mock customer key - in a real app, this should be fetched from the backend (auth user session)
const getCustomerKey = () => {
  let key = localStorage.getItem('mock_customer_key');
  if (!key) {
    key = crypto.randomUUID ? crypto.randomUUID() : 'cu-' + Date.now();
    localStorage.setItem('mock_customer_key', key);
  }
  return key;
};

export default function PaymentPageClientContainer() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async (paymentData: { planId: string; amount: number; method: string }) => {
    setIsLoading(true);

    try {
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const customerKey = getCustomerKey();
      
      const payment = tossPayments.payment({ customerKey });

      // Request automatic billing authentication
      await payment.requestBillingAuth({
        method: "CARD", 
        successUrl: window.location.origin + '/payment/success',
        failUrl: window.location.origin + '/payment/fail',
        customerName: '홍길동',
        customerEmail: 'test@cloudnote.com',
      });
      
    } catch (e: any) {
      console.error(e);
      // Only show alert if it's not a user cancellation
      if (e.code !== 'PAY_PROCESS_CANCELED') {
         alert('결제(빌링키) 연동 중 오류가 발생했습니다: ' + (e.message || '알 수 없는 오류'));
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <PaymentLayout onPay={handlePay} isLoading={isLoading} />
    </div>
  );
}
