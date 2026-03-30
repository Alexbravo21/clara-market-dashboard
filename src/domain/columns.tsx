import { CryptoName, PriceChange } from '../components';
import { SparklineChart } from '../ui';
import type { IColumn } from '../ui';
import { formatCompactUSD, formatUSD } from '../utils';
import type { ICoinRow } from './models';

/**
 * Column definitions for the cryptocurrency market table.
 * Each entry describes how to render and sort a single column of ICoinRow data.
 */
export const COIN_COLUMNS: IColumn<ICoinRow>[] = [
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
    render: (row) => formatUSD(row.price),
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
    render: (row) => formatCompactUSD(row.marketCap),
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
