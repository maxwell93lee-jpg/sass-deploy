'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const orderId = searchParams.get('orderId');
  const [isProcessing, setIsProcessing] = useState(true);
  const isProcessed = useRef(false);

  useEffect(() => {
    // Only run this registration once per load
    if (isProcessed.current) return;
    
    // We only process if we have an orderId to update
    if (orderId) {
      isProcessed.current = true;
      
      const recordFailure = async () => {
        try {
          await fetch('/api/payments/fail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: errorCode,
              message: errorMessage,
              orderId: orderId
            })
          });
        } catch (e) {
          console.error('Failed to report payment failure/cancel:', e);
        } finally {
          setIsProcessing(false);
        }
      };
      
      recordFailure();
    } else {
      setIsProcessing(false);
    }
  }, [orderId, errorCode, errorMessage]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
        </div>
        
        <h1 className="text-2xl font-bold text-on-surface mb-2">결제 취소 및 실패</h1>
        
        <div className="bg-surface-container p-4 rounded-xl mb-8 mt-4 text-left">
          <p className="text-sm font-bold text-on-surface mb-1">상세 내역</p>
          <p className="text-on-surface-variant text-sm break-keep">{errorMessage || '결제 중 알 수 없는 오류가 발생했습니다.'}</p>
          {errorCode && <p className="text-xs text-outline mt-2 font-mono">Code: {errorCode}</p>}
          {orderId && <p className="text-xs text-outline font-mono">Order ID: {orderId}</p>}
        </div>

        <button 
          onClick={() => router.push('/payment')}
          disabled={isProcessing}
          className="bg-primary text-on-primary w-full py-3 rounded-xl font-bold shadow-md hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          {isProcessing ? '처리 중...' : '결제 다시 시도하기'}
        </button>
      </div>
    </div>
  );
}
