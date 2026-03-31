import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button, Skeleton } from '../ui';
import { useDrawerBehavior } from '../hooks';
import type { IDrawerControllerState } from '../hooks';
import { formatCoinPrice, formatCoinDate } from '../domain';
import { truncateText } from '../utils';

const DESCRIPTION_LIMIT = 300;

interface IAssetDrawerProps {
  drawer: IDrawerControllerState;
}

/**
 * Side drawer that displays detailed asset information and a 7-day price chart.
 * Purely presentational — receives all data via the drawer prop.
 * Composes {@link useDrawerBehavior} for UI-only behaviour (focus, keyboard, description toggle).
 */
export function AssetDrawer({ drawer }: IAssetDrawerProps) {
  const { isOpen, coinDetail, priceChartData, isLoading, hasError, isRateLimit, refetch, close } =
    drawer;
  const { isDescriptionExpanded, closeButtonRef, toggleDescription } = useDrawerBehavior({
    isOpen,
    onClose: close,
  });

  const onRetry = refetch;
  const onToggleDescription = toggleDescription;
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={handleBackdropClick}
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label={coinDetail ? `${coinDetail.name} details` : 'Asset details'}
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-900 sm:w-120 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asset Details</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-800"
            aria-label="Close asset details"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <DrawerSkeleton />
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                {isRateLimit ? 'Rate limit reached' : 'Failed to load details'}
              </p>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                {isRateLimit
                  ? 'Please wait a moment before retrying.'
                  : 'An error occurred while loading asset details.'}
              </p>
              <Button onClick={onRetry}>Retry</Button>
            </div>
          ) : coinDetail ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={coinDetail.imageUrl}
                  alt={`${coinDetail.name} logo`}
                  className="h-16 w-16 rounded-full object-contain"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {coinDetail.name}
                  </h3>
                  <p className="text-sm uppercase text-gray-500 dark:text-gray-400">
                    {coinDetail.symbol}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                  {formatCoinPrice(coinDetail.price)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">All-Time High</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatCoinPrice(coinDetail.allTimeHigh)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatCoinDate(coinDetail.allTimeHighDate)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">All-Time Low</p>
                  <p className="mt-1 text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums">
                    {formatCoinPrice(coinDetail.allTimeLow)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatCoinDate(coinDetail.allTimeLowDate)}
                  </p>
                </div>
              </div>

              {coinDetail.description && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    About
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {isDescriptionExpanded
                      ? coinDetail.description
                      : truncateText(coinDetail.description, DESCRIPTION_LIMIT)}
                  </p>
                  {coinDetail.description.length > DESCRIPTION_LIMIT && (
                    <button
                      type="button"
                      onClick={onToggleDescription}
                      className="mt-1 text-sm font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
                    >
                      {isDescriptionExpanded ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              {priceChartData && priceChartData.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Price History (7 days)
                  </h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                      data={priceChartData}
                      margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value: number) =>
                          value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value.toFixed(2)}`
                        }
                        width={72}
                      />
                      <Tooltip
                        formatter={(value) =>
                          typeof value === 'number'
                            ? [formatCoinPrice(value), 'Price']
                            : [String(value), 'Price']
                        }
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          fontSize: '0.8rem',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading asset details" role="status">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-52 w-full rounded-lg" />
    </div>
  );
}
