import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentLayout from '../PaymentLayout';

describe('PaymentLayout', () => {
  it('renders TossPayments widget containers for Pro plan', () => {
    const handlePaymentMock = jest.fn();

    render(<PaymentLayout onPay={handlePaymentMock} />);

    // Check pricing plans
    expect(screen.getByText('구독 플랜 선택')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();

    // TossPayments widget mount points should be present
    const paymentMethodContainer = document.querySelector('#payment-method');
    const agreementContainer = document.querySelector('#agreement');

    expect(paymentMethodContainer).toBeInTheDocument();
    expect(agreementContainer).toBeInTheDocument();

    // Mock payment methods should NOT be present
    expect(screen.queryByText('카카오페이')).not.toBeInTheDocument();
    expect(screen.queryByText('네이버페이')).not.toBeInTheDocument();
  });
});
