import { render, screen } from '@testing-library/react';

import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders a positive value with green styling', () => {
    render(<Badge value={2.5} />);
    const badge = screen.getByText('+2.50%');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-emerald-100');
  });

  it('renders a negative value with red styling', () => {
    render(<Badge value={-1.23} />);
    const badge = screen.getByText('-1.23%');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
  });

  it('renders zero as positive', () => {
    render(<Badge value={0} />);
    const badge = screen.getByText('+0.00%');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-emerald-100');
  });
});
