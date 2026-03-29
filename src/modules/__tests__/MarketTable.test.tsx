import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SelectedCoinProvider } from '../../context';
import * as marketCoinsHook from '../../hooks/useMarketCoins';
import { MarketTable } from '../MarketTable';
import type { ICoinMarket } from '../../types';

jest.mock('../../hooks/useMarketCoins');

const mockUseMarketCoins = marketCoinsHook.useMarketCoins as jest.Mock;

const MOCK_COINS: ICoinMarket[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 50000,
    market_cap: 1_000_000_000_000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    sparkline_in_7d: { price: [48000, 49000, 50000, 49500, 51000, 50500, 50000] },
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://example.com/eth.png',
    current_price: 3000,
    market_cap: 400_000_000_000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.2,
    sparkline_in_7d: { price: [3100, 3050, 3000, 2950, 3000, 2900, 3000] },
  },
];

function renderWithProviders(ui: React.ReactElement) {
  return render(<SelectedCoinProvider>{ui}</SelectedCoinProvider>);
}

describe('MarketTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a skeleton loader while fetching', () => {
    mockUseMarketCoins.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      isFetching: true,
    });
    renderWithProviders(<MarketTable />);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('renders coin rows after successful fetch', async () => {
    mockUseMarketCoins.mockReturnValue({
      data: MOCK_COINS,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    });
    renderWithProviders(<MarketTable />);
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
  });

  it('shows an error message when fetch fails', async () => {
    mockUseMarketCoins.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
      refetch: jest.fn(),
      isFetching: false,
    });
    renderWithProviders(<MarketTable />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('filters coins by search query', async () => {
    const user = userEvent.setup();
    mockUseMarketCoins.mockReturnValue({
      data: MOCK_COINS,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    });
    renderWithProviders(<MarketTable />);
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    await user.type(screen.getByRole('searchbox'), 'bitcoin');
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('shows empty state when no coins match search', async () => {
    const user = userEvent.setup();
    mockUseMarketCoins.mockReturnValue({
      data: MOCK_COINS,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    });
    renderWithProviders(<MarketTable />);
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    await user.type(screen.getByRole('searchbox'), 'dogecoin');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });
});
