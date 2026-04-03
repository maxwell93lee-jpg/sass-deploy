import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center justify-center gap-4 px-8 w-full max-w-7xl mx-auto">
        <div className="flex gap-6 mb-4">
          <a className="text-slate-500 hover:text-primary hover:underline font-['Pretendard'] text-xs transition-colors" href="#">이용약관</a>
          <a className="text-slate-500 hover:text-primary hover:underline font-['Pretendard'] text-xs transition-colors" href="#">개인정보처리방침</a>
        </div>
        <p className="text-slate-400 dark:text-slate-600 font-['Pretendard'] text-xs opacity-80">
          © 2024 CloudNote. 모든 권리 보유.
        </p>
      </div>
    </footer>
  );
}
