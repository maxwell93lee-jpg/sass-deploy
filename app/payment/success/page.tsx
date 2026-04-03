'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    const authKey = searchParams.get('authKey');
    const customerKey = searchParams.get('customerKey');

    console.log('Billing Auth Success Params:', { authKey, customerKey });

    if (authKey && customerKey) {
      let isMounted = true;
      setStatus('loading');
      
      const confirmBilling = async () => {
        try {
          const res = await fetch('/api/payments/billing/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ authKey, customerKey })
          });
          
          const result = await res.json();
          console.log('Billing Confirm Result:', result);
          
          if (res.ok && isMounted) {
            setStatus('success');
          } else if (isMounted) {
            setStatus('fail');
            setErrorMessage(result.error || '자동결제 승인 중 오류가 발생했습니다.');
          }
        } catch (error: any) {
          console.error('Billing Confirm Error:', error);
          if (isMounted) {
            setStatus('fail');
            setErrorMessage(error.message || '서버 통신 중 오류가 발생했습니다.');
          }
        }
      };
      
      confirmBilling();
      
      return () => {
        isMounted = false;
      };
    } else {
      setStatus('fail');
      setErrorMessage('자동결제 필수 정보(authKey, customerKey)가 누락되었습니다.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="bg-surface-container-low p-8 rounded-3xl shadow-lg max-w-md w-full text-center">
        {status === 'loading' && (
          <p className="text-on-surface-variant text-lg">자동결제 설정 중입니다...</p>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-2">정기결제 설정이 완료되었습니다!</h1>
            <p className="text-on-surface-variant mb-8">
              이제 CloudNote Pro의 모든 기능을 이용하실 수 있습니다.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-primary text-on-primary w-full py-3 rounded-xl font-bold shadow-md hover:bg-primary-container transition-colors"
            >
              대시보드로 이동
            </button>
          </>
        )}

        {status === 'fail' && (
          <>
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            </div>
            <h1 className="text-2xl font-bold text-error mb-2">자동결제 설정 실패</h1>
            <p className="text-on-surface-variant mb-8">{errorMessage || '올바른 인증 정보가 전달되지 않았습니다.'}</p>
            <button 
              onClick={() => router.push('/payment')}
              className="bg-surface-container-high text-on-surface w-full py-3 rounded-xl font-bold hover:bg-surface-container-highest transition-colors"
            >
              돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
