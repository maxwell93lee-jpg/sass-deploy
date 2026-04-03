import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentDoneLayout from '../PaymentDoneLayout';
import { Payment } from '../../../../../core/entities/payment.entity';

const mockPayment: Payment = {
  id: 'CN-2024-0522-X9',
  userId: 'user-1',
  planId: 'pro' as 'pro' | 'enterprise',
  amount: 10,
  method: 'card', 
  status: 'completed',
  createdAt: '2024-05-22T14:30:00Z',
};

describe('PaymentDoneLayout', () => {
  it('renders payment success details correctly', () => {
    render(<PaymentDoneLayout payment={mockPayment} />);

    expect(screen.getByText('결제가 완료되었습니다!')).toBeInTheDocument();
    expect(screen.getByText('Pro 플랜이 활성화되었습니다')).toBeInTheDocument();
    expect(screen.getByText('CN-2024-0522-X9')).toBeInTheDocument();
    expect(screen.getByText('₩10 / 월')).toBeInTheDocument();
    expect(screen.getAllByText(/card/i).length).toBeGreaterThan(0);
  });
});
