import { CryptoName, PriceChange } from '../components';
import { SparklineChart } from '../ui';
import type { IColumn } from '../ui';
import type { ICoin } from './coin';
import { formatCoinPrice, formatMarketCap } from './coin';
import type { Currency } from './currency';

interface IStarIconProps {
  filled: boolean;
}

function StarIcon({ filled }: IStarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`h-4 w-4 transition-colors ${filled ? 'fill-yellow-400 stroke-yellow-400' : 'fill-none stroke-gray-400 hover:stroke-yellow-400'}`}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.601a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

/**
 * Factory that returns column definitions for the cryptocurrency market table.
 * The favorites column render requires live access to the toggleFavorite handler
 * and isFavorite predicate, so they are injected here instead of captured as module-level state.
 * @param toggleFavorite - Callback to add/remove a coin from favourites.
 * @param isFavorite - Predicate that returns true when a coin ID is favourited.
 * @param currency - The active currency used to format price and market cap values.
 */
export function createCoinColumns(
  toggleFavorite: (id: string) => void,
  isFavorite: (id: string) => boolean,
  currency: Currency = 'usd',
): IColumn<ICoin>[] {
  return [
    {
      key: 'favorites',
      header: '',
      sortable: false,
      headerClassName: 'w-12',
      cellClassName: 'w-12',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(row.id);
          }}
          aria-label={isFavorite(row.id) ? `Remove ${row.name} from favourites` : `Add ${row.name} to favourites`}
          className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <StarIcon filled={isFavorite(row.id)} />
        </button>
      ),
    },
  {
    key: 'rank',
    header: '#',
    sortable: true,
    headerClassName: 'w-12',
    cellClassName: 'text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums',
    render: (row) => row.rank,
  },
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (row) => <CryptoName name={row.name} symbol={row.symbol} imageUrl={row.imageUrl} />,
  },
  {
    key: 'price',
    header: 'Price',
    sortable: true,
    headerClassName: 'text-right',
    cellClassName: 'text-right text-sm font-medium text-gray-900 dark:text-gray-100 tabular-nums',
    render: (row) => formatCoinPrice(row.price, currency),
  },
  {
    key: 'priceChange24h',
    header: '24h %',
    sortable: true,
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    render: (row) => <PriceChange value={row.priceChange24h} />,
  },
  {
    key: 'marketCap',
    header: 'Market Cap',
    sortable: true,
    headerClassName: 'text-right',
    cellClassName: 'text-right text-sm text-gray-700 dark:text-gray-300 tabular-nums',
    render: (row) => formatMarketCap(row.marketCap, currency),
  },
  {
    key: 'sparklinePrices',
    header: '7d',
    headerClassName: 'text-right',
    render: (row) => (
      <div className="flex justify-end">
        <SparklineChart prices={row.sparklinePrices} positive={(row.priceChange24h ?? 0) >= 0} />
      </div>
    ),
  },
  ];
}
