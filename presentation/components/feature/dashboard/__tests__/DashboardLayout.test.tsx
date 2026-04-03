import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '../DashboardLayout';

describe('DashboardLayout Component', () => {
  const mockData = {
    stats: {
      plan: 'pro' as const,
      status: 'Active' as const,
      nextBillingDate: '2024-11-15T00:00:00.000Z',
      price: 10,
      notesCount: 428,
      notesLimit: 1000,
      storageUsed: 2.4,
      storageLimit: 10,
      aiSummariesUsed: 15,
      aiSummariesLimit: 50,
    },
    activities: [
      {
        id: '1',
        type: 'note_create' as const,
        message: "새로운 노트 '주간 회의록'이 생성되었습니다.",
        createdAt: '2024-10-24T10:00:00.000Z'
      }
    ]
  };

  it('renders correctly with given dashboard data', () => {
    render(<DashboardLayout data={mockData} userName="홍길동" />);
    
    // Welcome message
    expect(screen.getByText('안녕하세요, 홍길동님!')).toBeInTheDocument();
    
    // Subscription Info
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.getByText(/Active/)).toBeInTheDocument();
    
    // Data Usage
    expect(screen.getByText('428 / 1,000')).toBeInTheDocument();
    
    // Activities
    expect(screen.getByText("새로운 노트 '주간 회의록'이 생성되었습니다.")).toBeInTheDocument();
  });
});
