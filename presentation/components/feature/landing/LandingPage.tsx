import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">


      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-[radial-gradient(circle_at_50%_50%,rgba(0,80,203,0.05)_0%,rgba(247,249,251,0)_70%)]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 mb-8">
              <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
              <span className="text-xs font-semibold tracking-wide text-primary">AI-POWERED NOTES</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-on-surface mb-8 font-headline leading-[1.1]">
              당신의 아이디어를<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">클라우드에</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
              어디서든 메모하고, AI가 정리해드립니다.<br className="hidden md:block" />
              복잡한 생각들을 정제된 지식으로 바꾸는 가장 스마트한 방법.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all inline-block">
                무료로 시작하기
              </Link>
              <button className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-low transition-colors">
                기능 둘러보기
              </button>
            </div>
            
            {/* Hero Visual */}
            <div className="mt-20 w-full max-w-5xl relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden relative" style={{ aspectRatio: '16/10' }}>
                <div className="absolute inset-0 bg-surface-container-high/20 backdrop-blur-sm flex items-center justify-center text-outline">
                  [Hero Image Placeholder]
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Features */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-surface-container-lowest p-10 rounded-3xl flex flex-col justify-between overflow-hidden relative">
                <div>
                  <h3 className="text-2xl font-bold font-headline mb-4">지능형 자동 태깅</h3>
                  <p className="text-on-surface-variant">작성하는 순간 AI가 내용의 맥락을 파악하고 최적의 카테고리를 제안합니다.</p>
                </div>
                <div className="mt-8 flex gap-3 flex-wrap">
                  <span className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-medium">#전략기획</span>
                  <span className="px-4 py-2 bg-primary-fixed text-on-primary-fixed rounded-full text-sm font-medium">#디자인패턴</span>
                  <span className="px-4 py-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-sm font-medium">#시장분석</span>
                </div>
              </div>
              <div className="md:col-span-4 bg-primary p-10 rounded-3xl text-on-primary flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_sync</span>
                <h3 className="text-2xl font-bold font-headline mb-4">실시간 동기화</h3>
                <p className="opacity-80">모든 기기에서 끊김 없는 작업을 보장합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">심플한 요금 체계</h2>
              <p className="text-on-surface-variant">당신의 필요에 맞는 플랜을 선택하세요.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col border border-outline-variant/10 hover:shadow-lg transition-shadow">
                <h4 className="text-xl font-bold mb-2">Free</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold font-headline">0원</span>
                  <span className="text-on-surface-variant text-sm">/월</span>
                </div>
                <p className="text-on-surface-variant text-sm mb-8">개인적인 메모와 간단한 정리가 필요한 분들을 위해</p>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    무제한 노트 생성
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    기본 AI 요약 (월 5회)
                  </li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant/50">
                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                    고급 검색 기능 미포함
                  </li>
                </ul>
                <button className="w-full py-3 rounded-lg border border-primary text-primary font-bold hover:bg-surface-container-low transition-colors">무료로 시작</button>
              </div>

              {/* Pro Plan */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col relative ring-2 ring-primary shadow-2xl shadow-primary/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Popular</div>
                <h4 className="text-xl font-bold mb-2">Pro</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold font-headline">9,900원</span>
                  <span className="text-on-surface-variant text-sm">/월</span>
                </div>
                <p className="text-on-surface-variant text-sm mb-8">생산성을 극대화하고 싶은 프로 일잘러를 위해</p>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    무제한 AI 요약 및 분석
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    시맨틱 고급 검색
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    PDF 및 이미지 텍스트 추출
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    우선 순위 기술 지원
                  </li>
                </ul>
                <button className="w-full py-3 rounded-lg bg-primary text-on-primary font-bold hover:bg-surface-tint shadow-lg transition-all">지금 시작하기</button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col border border-outline-variant/10 hover:shadow-lg transition-shadow">
                <h4 className="text-xl font-bold mb-2">Enterprise</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold font-headline">29,900원</span>
                  <span className="text-on-surface-variant text-sm">/사용자</span>
                </div>
                <p className="text-on-surface-variant text-sm mb-8">안전한 협업과 지식 공유가 필요한 팀을 위해</p>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    전용 팀 워크스페이스
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    엔터프라이즈급 보안 및 암호화
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    통합 관리자 대시보드
                  </li>
                </ul>
                <button className="w-full py-3 rounded-lg border border-outline text-on-surface font-bold hover:bg-surface-container-low transition-colors">문의하기</button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-inverse-surface rounded-[2rem] p-12 md:p-20 text-center overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-inverse-on-surface mb-8 font-headline leading-tight">
                생각의 속도에 맞춘 메모 경험,<br />지금 CloudNote와 함께하세요.
              </h2>
              <Link href="/auth" className="bg-primary hover:bg-surface-tint text-on-primary px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 inline-block">
                무료로 계정 만들기
              </Link>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
