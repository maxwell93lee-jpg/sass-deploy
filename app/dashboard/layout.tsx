import React from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-surface antialiased min-h-screen">


      <div className="flex min-h-screen">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col p-4 gap-2 h-[calc(100vh-64px)] w-64 fixed left-0 top-16 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-sm font-medium">
          <div className="px-2 py-6 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">cloud</span>
              </div>
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">CloudNote</span>
            </div>
            <p className="text-xs text-slate-500">디지털 안식처</p>
          </div>
          <nav className="flex-1 flex flex-col gap-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm rounded-lg font-semibold active:scale-95">
              <span className="material-symbols-outlined">home</span>
              <span>홈</span>
            </Link>
            <Link href="/notes" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:translate-x-1 transition-all duration-300 rounded-lg">
              <span className="material-symbols-outlined">description</span>
              <span>내 노트</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:translate-x-1 transition-all duration-300 rounded-lg">
              <span className="material-symbols-outlined">settings</span>
              <span>설정</span>
            </Link>
            <Link href="/payment" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:translate-x-1 transition-all duration-300 rounded-lg">
              <span className="material-symbols-outlined">card_membership</span>
              <span>구독</span>
            </Link>
          </nav>
          <button className="mt-4 w-full bg-gradient-to-tr from-primary to-primary-container text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>새 노트 작성</span>
          </button>
        </aside>

        {/* Child Content (Dashboard, Notes) */}
        {children}

      </div>
      
      {/* Mobile NavBar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around py-3 px-6 z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-blue-600 font-semibold">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">홈</span>
        </Link>
        <Link href="/notes" className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">description</span>
          <span className="text-[10px]">노트</span>
        </Link>
        <div className="relative -top-6">
          <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        <Link href="/payment" className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">card_membership</span>
          <span className="text-[10px]">구독</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px]">설정</span>
        </Link>
      </nav>
    </div>
  );
}
