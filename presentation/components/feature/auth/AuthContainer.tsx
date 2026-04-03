'use client';

import React, { useState } from 'react';
import { login, signup } from '@/core/use-cases/auth/actions';
import { createClient } from '@/infrastructure/api/supabase/client';

export function AuthContainer() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [errorMsg, setErrorMsg] = useState('');
  const supabase = createClient(); // We need a browser client for OAuth

  async function handleLogin(formData: FormData) {
    setErrorMsg('');
    const res = await login(formData);
    if (res?.error) {
      setErrorMsg(res.error);
    }
  }

  async function handleRegister(formData: FormData) {
    setErrorMsg('');
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;

    if (password !== passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    const terms = formData.get('terms');
    if (!terms) {
      setErrorMsg('이용약관 및 개인정보처리방침에 동의해야 합니다.');
      return;
    }

    const res = await signup(formData);
    if (res?.error) {
      setErrorMsg(res.error);
    }
  }

  async function handleOAuth(provider: 'google' | 'kakao') {
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg('소셜 로그인 중 오류가 발생했습니다.');
    }
  }

  return (
    <section className="w-full lg:w-1/2 flex items-center justify-center bg-surface p-6 sm:p-12">
      <div className="w-full max-w-md">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">cloud</span>
          </div>
          <span className="text-xl font-extrabold text-on-surface tracking-tighter font-headline">CloudNote</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-10 border-b border-surface-container">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`pb-4 text-lg font-semibold transition-all ${activeTab === 'login' ? 'auth-tab-active' : 'text-outline hover:text-on-surface-variant'}`}
          >
            로그인
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`pb-4 text-lg font-semibold transition-all ${activeTab === 'register' ? 'auth-tab-active' : 'text-outline hover:text-on-surface-variant'}`}
          >
            회원가입
          </button>
        </div>

        {/* Error Message Display */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="block">
            <h2 className="text-2xl font-bold text-on-surface mb-2 font-headline">환영합니다!</h2>
            <p className="text-on-surface-variant mb-8 text-sm">계정에 로그인하여 노트를 계속 작성하세요.</p>

            <form action={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase ml-1">이메일 주소</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@cloudnote.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:bg-primary/5 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="password" className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">비밀번호</label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">비밀번호를 잊으셨나요?</a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:bg-primary/5 transition-all outline-none"
                />
              </div>

              <div className="flex items-center px-1">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-on-surface-variant">로그인 상태 유지</label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-tr from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all"
              >
                로그인
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container-high"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-surface text-outline font-medium">또는 소셜 계정으로 로그인</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOAuth('google')}
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95"
              >
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqhm0UHbGFsumFE4WWU5F4ULph-I12z1HicJbkmBcWv1DOKXS4zpa-iMM3C_KIpLoAtpnJDX5r1xvYbsnLA85obTTcTrNqnFNk9VkuHK56sZlkY-0dGKztd30CswUj5wDkphlyXdy5tg6bYwfdQA0WWV3ZQWbRBamguqmEyCGsJkk55en2Z3HH7UGP18IQbr_sAe9XKP_BGb6FyZx59RtDBVccZ3MNio5kmOppPOtdMepvRNQx3B6yl978BX0YRP-kO65dzPpKmn1h" alt="Google" className="w-5 h-5"/>
                <span className="text-sm font-semibold text-on-surface-variant">Google</span>
              </button>
              <button 
                onClick={() => handleOAuth('kakao')}
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#FEE500] rounded-xl hover:opacity-90 transition-opacity active:scale-95"
              >
                <span className="material-symbols-outlined text-black text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                <span className="text-sm font-semibold text-black">카카오톡</span>
              </button>
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="block">
            <h2 className="text-2xl font-bold text-on-surface mb-2 font-headline">계정 만들기</h2>
            <p className="text-on-surface-variant mb-8 text-sm">CloudNote와 함께 지적 생산성을 높여보세요.</p>

            <form action={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="reg-email" className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase ml-1">이메일 주소</label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@cloudnote.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:bg-primary/5 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reg-password" className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase ml-1">비밀번호</label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  placeholder="8자 이상의 비밀번호"
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:bg-primary/5 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reg-confirm" className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase ml-1">비밀번호 확인</label>
                <input
                  id="reg-confirm"
                  name="passwordConfirm"
                  type="password"
                  required
                  placeholder="비밀번호 다시 입력"
                  className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:bg-primary/5 transition-all outline-none"
                />
              </div>

              <div className="flex items-start px-1 mt-6">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-on-surface-variant leading-tight">
                  <span className="text-primary underline cursor-pointer">이용약관</span> 및 <span className="text-primary underline cursor-pointer">개인정보처리방침</span>에 동의합니다.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-tr from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all"
              >
                회원가입 완료
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-outline">
            © 2026 CloudNote. 모든 권리 보유.
          </p>
        </footer>
      </div>
    </section>
  );
}
