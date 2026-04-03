import React from 'react';
import { DashboardData } from '../../../../core/entities/dashboard.entity';
import SubscriptionActions from './SubscriptionActions';

export default function DashboardLayout({
  data,
  userName,
}: {
  data: DashboardData;
  userName: string;
}) {
  const { stats, activities } = data;

  // We consider the user has a billing key if status is active for a paid plan.
  // In a real scenario, this would come from the user's entity.
  // For the mock DASHBOARD stats, let's assume if it is 'Active' and it's pro, there's a key.
  const hasBillingKey = stats.plan !== 'free' && stats.status === 'Active';

  return (
    <div className="flex-1 md:ml-64 bg-surface p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Section */}
        <section className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight whitespace-nowrap">
            안녕하세요, {userName}님!
          </h1>
          <div className="flex items-center gap-3">
            <span className="bg-primary-container/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              현재 {stats.plan === 'pro' ? 'Pro' : stats.plan === 'enterprise' ? 'Enterprise' : 'Free'} 플랜을 이용 중입니다
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
        </section>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Subscription Info Card */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-8 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-primary tracking-widest uppercase mb-4">
                  현재 구독 정보
                </h3>
                <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">
                  {stats.plan.charAt(0).toUpperCase() + stats.plan.slice(1)} Plan
                </h2>
                <p className="text-on-surface-variant">
                  구독 상태: <span className="text-green-600 font-semibold">{stats.status}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-outline font-bold uppercase mb-1">다음 결제일</p>
                <p className="text-xl font-headline font-bold">
                  {stats.nextBillingDate ? new Date(stats.nextBillingDate).toLocaleDateString() : '없음'}
                </p>
                <p className="text-on-surface-variant">₩{stats.price.toLocaleString()} / 월</p>
              </div>
            </div>
            <SubscriptionActions hasBillingKey={hasBillingKey} />
          </div>

          {/* Usage Statistics Card */}
          <div className="md:col-span-4 bg-surface-container-low rounded-2xl p-8 space-y-8">
            <h3 className="text-sm font-bold text-on-surface-variant tracking-widest uppercase">
              데이터 사용량
            </h3>
            <div className="space-y-6">
              {/* Notes Count */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">노트 수</span>
                  <span className="text-on-surface-variant">
                    {stats.notesCount.toLocaleString()} / {stats.notesLimit.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(stats.notesCount / stats.notesLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
              {/* Storage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">저장 공간</span>
                  <span className="text-on-surface-variant">
                    {stats.storageUsed}GB / {stats.storageLimit}GB
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${(stats.storageUsed / stats.storageLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
              {/* AI Summaries */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">AI 요약 횟수</span>
                  <span className="text-on-surface-variant">
                    {stats.aiSummariesUsed} / {stats.aiSummariesLimit} (이번 달)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary rounded-full"
                    style={{
                      width: `${(stats.aiSummariesUsed / stats.aiSummariesLimit) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="md:col-span-12 space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-semibold">최근 활동</h3>
              <button className="text-sm text-primary font-semibold hover:underline">
                전체 보기
              </button>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
              <ul className="divide-y divide-surface-container/50">
                {activities.map((act) => {
                  const getIconProps = (type: string) => {
                    switch(type) {
                      case 'note_create': return { icon: 'edit_note', bg: 'bg-blue-50 text-blue-600' };
                      case 'ai_summary': return { icon: 'auto_awesome', bg: 'bg-purple-50 text-purple-600' };
                      case 'sync': return { icon: 'cloud_done', bg: 'bg-green-50 text-green-600' };
                      case 'share': return { icon: 'share', bg: 'bg-amber-50 text-amber-600' };
                      case 'login': return { icon: 'login', bg: 'bg-slate-100 text-slate-600' };
                      default: return { icon: 'circle', bg: 'bg-slate-50 text-slate-400' };
                    }
                  };
                  const iconProps = getIconProps(act.type);

                  return (
                    <li
                      key={act.id}
                      className="p-4 md:p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconProps.bg}`}>
                          <span className="material-symbols-outlined text-[20px]">
                            {iconProps.icon}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-on-surface group-hover:text-primary transition-colors">
                            {act.message}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {new Date(act.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary">
                        chevron_right
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
