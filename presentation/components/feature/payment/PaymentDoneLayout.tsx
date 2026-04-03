import React from 'react';
import { Payment } from '../../../../core/entities/payment.entity';
import Link from 'next/link';

interface PaymentDoneLayoutProps {
  payment: Payment;
}

export default function PaymentDoneLayout({ payment }: PaymentDoneLayoutProps) {
  // Format Date (e.g., "2024. 05. 22 14:30")
  const dateObj = new Date(payment.createdAt);
  const formattedDate = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, '0')}. ${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  
  // Next month date
  const nextMonthObj = new Date(dateObj);
  nextMonthObj.setMonth(nextMonthObj.getMonth() + 1);
  const nextPaymentDate = `${nextMonthObj.getFullYear()}. ${String(nextMonthObj.getMonth() + 1).padStart(2, '0')}. ${String(nextMonthObj.getDate()).padStart(2, '0')}`;

  const planName = payment.planId === 'pro' ? 'Pro' : payment.planId === 'enterprise' ? 'Enterprise' : 'Free';
  const methodName = payment.method === 'card' ? '신용/체크카드' :
                     payment.method === 'kakaopay' ? '카카오페이' :
                     payment.method === 'naverpay' ? '네이버페이' : '토스페이';

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg relative z-10">
        


        {/* Success Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_rgba(25,28,30,0.06)] overflow-hidden border border-outline-variant/10">
          
          {/* Header Section */}
          <div className="pt-12 pb-8 px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 mb-6">
              <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface font-headline tracking-tight mb-2">결제가 완료되었습니다!</h1>
            <p className="text-on-surface-variant font-medium">{planName} 플랜이 활성화되었습니다</p>
          </div>

          {/* Divider-less Info Section (Using Tonal Layering) */}
          <div className="bg-surface-container-low mx-8 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant font-medium">주문 번호</span>
                <span className="text-sm text-on-surface font-semibold font-headline">{payment.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant font-medium">결제 금액</span>
                <span className="text-sm text-on-surface font-bold font-headline">₩{payment.amount.toLocaleString()} / 월</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant font-medium">결제 수단</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">credit_card</span>
                  <span className="text-sm text-on-surface font-medium">{methodName}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant font-medium">결제 일시</span>
                <span className="text-sm text-on-surface font-medium">{formattedDate}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <span className="text-sm text-on-surface-variant font-medium">다음 결제 예정일</span>
                <span className="text-sm text-primary font-bold">{nextPaymentDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-10 flex flex-col gap-3">
            <Link 
              href="/dashboard" 
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-base shadow-sm hover:opacity-90 transition-opacity active:scale-[0.98] text-center"
            >
              대시보드로 이동
            </Link>
            <button className="w-full bg-surface-container-high text-on-surface-variant py-4 rounded-xl font-semibold text-base hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
              영수증 다운로드
            </button>
          </div>
        </div>

        {/* Support Text */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            결제 영수증 및 안내 사항은 가입하신 이메일로 발송되었습니다.<br/>
            정기 결제 해지는 설정 &gt; 구독 관리 메뉴에서 언제든 가능합니다.
          </p>
          <div className="flex justify-center items-center gap-4">
            <a className="text-xs font-semibold text-primary hover:underline" href="#">고객센터 문의하기</a>
            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
            <a className="text-xs font-semibold text-primary hover:underline" href="#">구독 정책 확인</a>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
