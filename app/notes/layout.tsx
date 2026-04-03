import React from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background text-on-surface overflow-hidden">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col p-4 gap-2 h-screen w-64 bg-slate-50 border-r border-slate-200/50 font-['Pretendard'] text-sm font-medium">
        <div className="flex flex-col gap-1 mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">cloud</span>
            </div>
            <span className="text-lg font-bold text-blue-700 tracking-tighter">CloudNote</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">디지털 안식처</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 transition-all duration-300 rounded-lg active:scale-95">
            <span className="material-symbols-outlined">home</span>
            <span>홈</span>
          </Link>
          {/* Active Tab: 내 노트 */}
          <Link href="/notes" className="flex items-center gap-3 px-3 py-2 bg-white text-blue-600 shadow-sm rounded-lg font-semibold active:scale-95">
            <span className="material-symbols-outlined">description</span>
            <span>내 노트</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 transition-all duration-300 rounded-lg active:scale-95">
            <span className="material-symbols-outlined">settings</span>
            <span>설정</span>
          </Link>
          <Link href="/subscription" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 transition-all duration-300 rounded-lg active:scale-95">
            <span className="material-symbols-outlined">card_membership</span>
            <span>구독</span>
          </Link>
        </nav>
        
        <div className="mt-auto flex flex-col gap-1">
          <Link href="/help" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 transition-all duration-300 rounded-lg active:scale-95">
            <span className="material-symbols-outlined">help</span>
            <span>도움말</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      {children}
      
      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white flex items-center justify-around border-t shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-30">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">홈</span>
        </Link>
        <Link href="/notes" className="flex flex-col items-center gap-1 text-blue-600 font-bold">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
          <span className="text-[10px]">노트</span>
        </Link>
        <div className="mb-6">
          <button className="w-12 h-12 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-medium">설정</span>
        </Link>
        <Link href="/help" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">help</span>
          <span className="text-[10px] font-medium">도움말</span>
        </Link>
      </nav>
    </div>
  );
}
