'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from '@/core/use-cases/auth/actions';

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center px-6 md:px-12 h-16 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cloud</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tighter font-headline">CloudNote</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-['Manrope','Pretendard'] antialiased tracking-tight">기능</Link>
          <Link href="/#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-['Manrope','Pretendard'] antialiased tracking-tight">요금제</Link>
          
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-bold text-primary hover:text-surface-tint transition-colors font-['Manrope','Pretendard'] antialiased tracking-tight">
                대시보드
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-sm font-medium text-slate-500 hover:text-error transition-colors font-['Manrope','Pretendard'] antialiased tracking-tight">
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium text-sm px-4 py-2 font-['Manrope','Pretendard'] antialiased tracking-tight">
                로그인
              </Link>
              <Link href="/auth" className="bg-primary hover:bg-surface-tint text-on-primary px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-sm">
                시작하기
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden material-symbols-outlined text-slate-600 dark:text-slate-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 'close' : 'menu'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-xl">
          <Link href="/#features" className="text-base font-medium text-slate-700 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>기능</Link>
          <Link href="/#pricing" className="text-base font-medium text-slate-700 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>요금제</Link>
          <hr className="border-slate-100 dark:border-slate-800" />
          {user ? (
            <>
              <Link href="/dashboard" className="text-base font-bold text-primary" onClick={() => setIsMenuOpen(false)}>대시보드</Link>
              <form action={signOut} className="w-full">
                <button type="submit" className="text-base font-medium text-error flex items-center gap-2 w-full text-left">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-base font-medium text-slate-700 dark:text-slate-300" onClick={() => setIsMenuOpen(false)}>로그인</Link>
              <Link href="/auth" className="bg-primary text-on-primary text-center py-3 rounded-xl font-bold shadow-lg shadow-primary/20" onClick={() => setIsMenuOpen(false)}>무료로 시작하기</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
