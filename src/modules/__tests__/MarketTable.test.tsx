import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApiError } from '../../api';
import { MarketTable } from '../MarketTable';
import type { ITableControllerState, IPageState } from '../../hooks';
import type { ICoin } from '../../domain/coin';

const MOCK_COINS: ICoin[] = [
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

function makeTable(overrides: Partial<ITableControllerState> = {}): ITableControllerState {
  return {
    data: MOCK_COINS,
    sorting: { state: { field: 'rank', direction: 'asc' }, onSort: jest.fn() },
    filtering: { query: '', onChange: jest.fn() },
    onRowClick: jest.fn(),
    ...overrides,
  };
}

function makeState(overrides: Partial<IPageState> = {}): IPageState {
  return {
    isLoading: false,
    isFetching: false,
    hasError: false,
    isRateLimit: false,
    refetch: jest.fn(),
    ...overrides,
  };
}

describe('MarketTable', () => {
  it('shows a skeleton loader while fetching', () => {
    render(<MarketTable table={makeTable({ data: [] })} state={makeState({ isLoading: true })} />);
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('renders coin rows after successful fetch', async () => {
    render(<MarketTable table={makeTable()} state={makeState()} />);
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
  });

  it('shows an error message when fetch fails', () => {
    render(<MarketTable table={makeTable({ data: [] })} state={makeState({ hasError: true })} />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('shows a rate-limit message and retry button when the API returns 429', () => {
    render(
      <MarketTable
        table={makeTable({ data: [] })}
        state={makeState({ hasError: true, isRateLimit: true })}
      />,
    );
    expect(screen.getAllByText(/rate limit/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls refetch when the retry button is clicked', async () => {
    const refetch = jest.fn();
    const user = userEvent.setup();
    render(
      <MarketTable
        table={makeTable({ data: [] })}
        state={makeState({ hasError: true, refetch })}
      />,
    );
    await user.click(screen.getByRole('button', { name: /retry/i }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('filters coins by search query', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <MarketTable table={makeTable({ filtering: { query: '', onChange } })} state={makeState()} />,
    );
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    await user.type(screen.getByRole('searchbox'), 'bitcoin');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows empty state when no coins match search', () => {
    render(<MarketTable table={makeTable({ data: [] })} state={makeState()} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('shows a reset search button when query is non-empty and no results match', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <MarketTable
        table={makeTable({ data: [], filtering: { query: 'xyz', onChange } })}
        state={makeState()}
      />,
    );
    const resetButton = screen.getByRole('button', { name: /reset search/i });
    expect(resetButton).toBeInTheDocument();
    await user.click(resetButton);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('does not show reset search button when query is empty', () => {
    render(
      <MarketTable
        table={makeTable({ data: [], filtering: { query: '', onChange: jest.fn() } })}
        state={makeState()}
      />,
    );
    expect(screen.queryByRole('button', { name: /reset search/i })).not.toBeInTheDocument();
  });

  it('calls onRowClick with the correct row when a row is clicked', async () => {
    const onRowClick = jest.fn();
    const user = userEvent.setup();
    render(<MarketTable table={makeTable({ onRowClick })} state={makeState()} />);
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    await user.click(screen.getByText('Bitcoin'));
    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'bitcoin' }));
  });
});

// Silence unused import lint warning — ApiError kept for parity with prior test expectations
void ApiError;
