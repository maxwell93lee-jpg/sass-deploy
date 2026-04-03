import React, { useState } from 'react';

interface PaymentLayoutProps {
  onPay: (paymentData: { planId: string; amount: number; method: string }) => void;
  isLoading?: boolean;
}

export default function PaymentLayout({ onPay, isLoading }: PaymentLayoutProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');

  const plans = {
    free: { price: 0, name: 'Free' },
    pro: { price: 500, name: 'Pro' },
    enterprise: { price: -1, name: 'Enterprise' } // -1 indicates custom pricing
  };

  const currentPrice = plans[selectedPlan].price;
  const vat = currentPrice > 0 ? currentPrice * 0.1 : 0;
  const totalPrice = currentPrice > 0 ? currentPrice + Math.floor(vat) : 0;

  const handlePayClick = () => {
    if (selectedPlan === 'enterprise' || selectedPlan === 'free') {
      // In this mock, we only process 'pro' payments directly
      // If free, we could just redirect or show success.
      return;
    }
    onPay({
      planId: selectedPlan,
      amount: totalPrice,
      method: "tosspayments" // Method is now entirely handled by the widget
    });
  };

  return (
    <div className="flex-grow pt-8 pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
      {/* Header Section */}
      <section className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-on-surface mb-4">구독 플랜 선택</h1>
        <p className="text-lg text-on-surface-variant font-body max-w-2xl leading-relaxed">
          당신의 창의력을 무한히 펼칠 수 있는 디지털 안식처. <br className="hidden md:block" /> CloudNote의 프리미엄 기능을 통해 더 깊이 있는 사고를 경험하세요.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Plan Selection (Left Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Free Plan Card */}
            <div 
              onClick={() => setSelectedPlan('free')}
              className={`group relative p-6 rounded-xl border transition-all cursor-pointer ${
                selectedPlan === 'free' ? 'border-primary bg-surface-container shadow-md' : 'border-transparent bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-label-md font-semibold text-on-surface-variant mb-1">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-headline">₩0</span>
                  <span className="text-sm text-outline">/월</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  <span>최대 50개 노트</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  <span>기본 서식 지원</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan Card (Recommended) */}
            <div 
              onClick={() => setSelectedPlan('pro')}
              className={`group relative p-6 rounded-xl border-2 shadow-xl cursor-pointer ${
                selectedPlan === 'pro' ? 'border-primary bg-surface-container-lowest scale-105 z-10' : 'border-transparent bg-surface-container-low hover:bg-surface-container scale-100'
              }`}
            >
              {selectedPlan === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Recommended</div>
              )}
              <div className="mb-6">
                <h3 className={`text-label-md font-bold mb-1 ${selectedPlan === 'pro' ? 'text-primary' : 'text-on-surface-variant'}`}>Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold font-headline ${selectedPlan === 'pro' ? 'text-primary' : 'text-on-surface'}`}>₩500</span>
                  <span className="text-sm text-outline">/월</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-medium">무제한 노트 생성</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-medium">AI 요약 및 태깅</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-medium">기기 무제한 동기화</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan Card */}
            <div 
              onClick={() => setSelectedPlan('enterprise')}
              className={`group relative p-6 rounded-xl border transition-all cursor-pointer ${
                selectedPlan === 'enterprise' ? 'border-primary bg-surface-container shadow-md' : 'border-transparent bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-label-md font-semibold text-on-surface-variant mb-1">Enterprise</h3>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  <span>팀 협업 관리 도구</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  <span>보안 커스텀 설정</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Features Highlight Bento */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="col-span-2 md:col-span-1 bg-surface-container-low p-8 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-3xl mb-4">cloud_sync</span>
              <h4 className="text-lg font-bold mb-2">실시간 멀티 동기화</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">모든 기기에서 즉시 동기화되어 당신의 생각이 끊기지 않게 합니다.</p>
            </div>
            <div className="col-span-2 md:col-span-1 bg-primary p-8 rounded-2xl text-on-primary relative overflow-hidden">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-on-primary text-3xl mb-4">psychology</span>
                <h4 className="text-lg font-bold mb-2">AI 기반 지식 연결</h4>
                <p className="text-sm text-on-primary/80 leading-relaxed">작성된 노트를 분석하여 관련 있는 과거의 기록을 자동으로 추천합니다.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Payment Details (Right Column) */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/20 sticky top-24">
            <h2 className="text-xl font-bold mb-8">결제 상세 정보</h2>
            
            {/* Order Summary */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-surface-container-high">
                <div className="space-y-1">
                  <p className="text-sm text-on-surface-variant">선택한 플랜</p>
                  <p className="font-bold text-lg">
                    {plans[selectedPlan].name} Plan 
                    {selectedPlan === 'pro' && <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded">월간 결제</span>}
                  </p>
                </div>
                <p className="font-headline font-bold text-primary">
                  {currentPrice > 0 ? `₩${currentPrice.toLocaleString()}` : '₩0'}
                </p>
              </div>
              
              {currentPrice > 0 && selectedPlan !== 'enterprise' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">결제 주기</span>
                    <span>매월 (1일)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">부가세 (VAT)</span>
                    <span>₩{vat.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center border-t-2 border-primary/10">
                <span className="text-lg font-bold">총 결제 금액</span>
                <span className="text-2xl font-extrabold text-primary font-headline">
                  {totalPrice > 0 ? `₩${totalPrice.toLocaleString()}` : '₩0'}
                </span>
              </div>
            </div>

            {/* TossPayments Billing Info */}
            {selectedPlan === 'pro' && (
              <div className="mb-10 p-4 bg-surface-container rounded-xl border border-primary/20">
                <p className="text-sm font-medium text-center text-primary-fixed">
                  <span className="material-symbols-outlined align-middle mr-1 text-[18px]">credit_card</span>
                  정기결제 카드 정보를 안전하게 등록합니다.
                </p>
              </div>
            )}

            {/* CTA & Policy */}
            <div className="space-y-4">
              <button 
                onClick={handlePayClick}
                disabled={isLoading || selectedPlan !== 'pro'}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  selectedPlan === 'pro' 
                    ? 'bg-primary hover:bg-primary-container text-on-primary shadow-primary/20' 
                    : 'bg-surface-container-highest text-outline cursor-not-allowed'
                }`}
              >
                <span>{selectedPlan === 'pro' ? '정기결제 카드 등록' : '선택 불가'}</span>
                {isLoading && selectedPlan === 'pro' && <span className="animate-pulse opacity-70">...</span>}
                {!isLoading && selectedPlan === 'pro' && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              </button>
              
              <div className="bg-surface-container-low p-4 rounded-xl space-y-2">
                <div className="flex items-start gap-2 text-[11px] text-on-surface-variant leading-relaxed">
                  <span className="material-symbols-outlined text-[14px] mt-0.5">info</span>
                  <p>구독 시작 후 7일 이내에 사용 기록이 없는 경우 전액 환불이 가능합니다. 이후에는 남은 기간을 일할 계산하여 환불됩니다.</p>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-on-surface-variant leading-relaxed">
                  <span className="material-symbols-outlined text-[14px] mt-0.5">cancel</span>
                  <p>언제든지 설정 페이지에서 구독을 해지할 수 있으며, 해지 후에도 현재 결제 주기가 끝날 때까지 혜택이 유지됩니다.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
