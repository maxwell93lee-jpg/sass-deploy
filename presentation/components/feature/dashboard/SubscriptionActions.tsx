'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionActions({ hasBillingKey }: { hasBillingKey: boolean }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleCancelClick = async () => {
    const isConfirmed = window.confirm(
      '정말로 구독을 취소하시겠습니까?\n취소하셔도 다음 결제일 전까지는 모든 기능을 계속 이용하실 수 있습니다.'
    );

    if (!isConfirmed) return;

    setIsCancelling(true);

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || '구독이 취소되었습니다.');
        // Refresh the page to reflect the new state (e.g., hidden cancel button)
        router.refresh();
      } else {
        alert(result.error || '구독 취소 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Cancellation Error:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePlanChange = () => {
    // Navigate to payment page for plan changes
    router.push('/payment');
  };

  return (
    <div className="mt-12 flex gap-4">
      <button 
        onClick={handlePlanChange}
        className="bg-surface-container-high text-on-surface-variant px-6 py-3 rounded-xl font-semibold hover:bg-surface-container-highest transition-colors active:scale-95"
      >
        플랜 변경
      </button>
      
      {hasBillingKey && (
        <button 
          onClick={handleCancelClick}
          disabled={isCancelling}
          className="text-slate-400 px-6 py-3 rounded-xl font-medium hover:text-error transition-colors disabled:opacity-50"
        >
          {isCancelling ? '처리 중...' : '구독 취소'}
        </button>
      )}
    </div>
  );
}
