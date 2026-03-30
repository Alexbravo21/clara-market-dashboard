import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as marketCoinsHook from '../../hooks/useMarketCoins';
import { MarketTable } from '../MarketTable';
import type { ICoinRow } from '../../domain';

jest.mock('../../hooks/useMarketCoins');

const mockUseMarketCoins = marketCoinsHook.useMarketCoins as jest.Mock;

const MOCK_COINS: ICoinRow[] = [
  {
    id: 'bitcoin',
    rank: 1,
    name: 'Bitcoin',
    symbol: 'btc',
    imageUrl: 'https://example.com/btc.png',
    price: 50000,
    priceChange24h: 2.5,
    marketCap: 1_000_000_000_000,
    sparklinePrices: [48000, 49000, 50000, 49500, 51000, 50500, 50000],
  },
  {
    id: 'ethereum',
    rank: 2,
    name: 'Ethereum',
    symbol: 'eth',
    imageUrl: 'https://example.com/eth.png',
    price: 3000,
    priceChange24h: -1.2,
    marketCap: 400_000_000_000,
    sparklinePrices: [3100, 3050, 3000, 2950, 3000, 2900, 3000],
  },
];

function renderMarketTable() {
  return render(<MarketTable onSelectCoin={jest.fn()} />);
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
    renderMarketTable();
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
    renderMarketTable();
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
    renderMarketTable();
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
    renderMarketTable();
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
    renderMarketTable();
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    await user.type(screen.getByRole('searchbox'), 'dogecoin');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });
});
