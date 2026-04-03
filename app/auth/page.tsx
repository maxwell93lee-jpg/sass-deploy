import { AuthContainer } from '@/presentation/components/feature/auth/AuthContainer';

export default function AuthPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left Side: Service Intro */}
      <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-primary">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-container opacity-40 blur-[120px]"></div>
          <div 
            className="absolute bottom-0 right-0 w-full h-full opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-24">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-primary text-2xl">cloud</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tighter font-headline">CloudNote</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight mb-8 font-headline">
              생각을 정리하는<br />새로운 방법
            </h1>
            <p className="text-on-primary-container text-lg leading-relaxed opacity-90 font-body">
              CloudNote는 당신의 아이디어가 숨 쉴 수 있는 디지털 안식처입니다. 
              더 깊이 생각하고, 더 명확하게 기록하세요.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="glass-panel p-8 rounded-2xl max-w-sm">
            <div className="flex -space-x-3 mb-4">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf5IXz5WrHtkX8Rxxz98gTtlH0WfZ1H0hIgxO3nxRPuANhY6w1F1b9hoiSs_7pKtDkUIuPfF7GNvVCXf1JQwMMkqJcZGGjkwH4F-UpWHcNJHeNjMgSpqlvIfKJFQwO6PanP76SKQDxM6Fa87FR4FClueTKKXk4B_W2ErkLJdyviFvO2D8aPNp7fPTvdqc4Z27g_CAjDCrPf4VzpKEQ3_dyVc_HxeojBZWSXaFEg_PZQVTBhDvEeT0AMPZbUcgrmL8xhAyigiotyP-d" alt="사용자 1" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9po-Hh-toL3rArAaeN6i3dA0gS0tPNos2AMmqGka8QjkO0kdfn4AFDbqzwk4Xr13q-zNsAtqemqC5iy0TbCGcc9_XfTHvG79vKHxoEm4CnShmC_oMNNaLeVVy1v26jAqfjaxRIW5FzDWa3pliNNUhhns7W8Anczqejb73mJBjnEfCuX953ULwp5-zy98leyphldVIm_X2FSr5PIJER_KZPRRLcdt73E6moa5b3aS1jJKfxCJIPvASKAaQcuBnrdks0UNFsCJmlMGm" alt="사용자 2" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2BdvY_ketp9hDEVhavlQ-MpWjXaOKqhCcx1CeH2jF_q2T_FLFykbVITm0OsueY7GVqZVnyO9Re6Zv_A-HjgjDOMphzUsG-P6dWO3m4HpMBCGd2upxq9u7VR1a9aDxIZmS_beUKHjMhaLnu1RK6W4qdDPj2bLHz-y0Gly-SEGYW6gpfgbbZhavRTsX0-_8w4apKhGbGtn_w71YmoyXDJl0ylapwaeH7F18c3sIUNDYlY1q284mEphlq_lt6th_3Yxb33eiAy9Qw7on" alt="사용자 3" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container">
                +10k
              </div>
            </div>
            <p className="text-white font-medium text-sm leading-snug">
              10만 명의 사용자가 선택한 지능형 노트 테이킹 플랫폼
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Auth Forms */}
      <AuthContainer />
    </main>
  );
}
