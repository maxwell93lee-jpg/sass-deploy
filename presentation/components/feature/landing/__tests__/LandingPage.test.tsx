import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '../LandingPage';

describe('LandingPage', () => {
  it('renders correctly with all primary sections', () => {
    render(<LandingPage />);
    // Hero
    // Hero
    expect(screen.getByText(/당신의 아이디어를/)).toBeInTheDocument();
    
    // Bento Features
    expect(screen.getByText('지능형 자동 태깅')).toBeInTheDocument();
    expect(screen.getByText('실시간 동기화')).toBeInTheDocument();
    
    // Pricing
    expect(screen.getByText('심플한 요금 체계')).toBeInTheDocument();
    
    // CTA & Footer
    expect(screen.getByText(/생각의 속도에 맞춘 메모 경험/)).toBeInTheDocument();
    expect(screen.getByText('무료로 계정 만들기')).toBeInTheDocument();
  });
});
