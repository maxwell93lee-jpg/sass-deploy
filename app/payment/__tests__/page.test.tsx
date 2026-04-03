import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentPageClientContainer from '../page';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock TossPayments SDK
jest.mock('@tosspayments/tosspayments-sdk', () => ({
  loadTossPayments: jest.fn(),
}));

describe('PaymentPageClientContainer', () => {
  it('initializes TossPayments SDK on mount', async () => {
    const mockWidgets = {
      setAmount: jest.fn(),
      renderPaymentMethods: jest.fn(),
      renderAgreement: jest.fn(),
      requestPayment: jest.fn(),
    };

    const mockTossPayments = {
      widgets: jest.fn().mockReturnValue(mockWidgets),
    };

    (loadTossPayments as jest.Mock).mockResolvedValue(mockTossPayments);

    render(<PaymentPageClientContainer />);

    // Since it's a useEffect, using setImmediate or findByText to wait for mount
    const title = await screen.findByText("구독 플랜 선택");
    expect(title).toBeInTheDocument();

    expect(loadTossPayments).toHaveBeenCalledWith(expect.any(String));
  });
});
