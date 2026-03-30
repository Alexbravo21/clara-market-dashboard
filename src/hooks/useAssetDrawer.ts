import { ApiError } from '../api';
import type { ICoinDetailView } from '../domain';
import { useCoinDetail } from './useCoinDetail';
import { useCoinMarketChart } from './useCoinMarketChart';

export interface IPriceChartPoint {
  date: string;
  price: number;
}

export interface IUseAssetDrawerResult {
  isOpen: boolean;
  coinDetail: ICoinDetailView | undefined;
  priceChartData: IPriceChartPoint[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  isRateLimit: boolean;
  refetch: () => void;
}

interface IUseAssetDrawerOptions {
  selectedCoinId: string | null;
}

/**
 * Manages data fetching and state for the asset detail drawer.
 * @param options - The currently selected coin ID.
 * @returns Drawer open state, coin detail, chart data, loading/error flags, and a refetch callback.
 */
export function useAssetDrawer({ selectedCoinId }: IUseAssetDrawerOptions): IUseAssetDrawerResult {
  const isOpen = !!selectedCoinId;

  const {
    data: coinDetail,
    isLoading: isDetailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useCoinDetail(selectedCoinId);

  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
    refetch: refetchChart,
  } = useCoinMarketChart(selectedCoinId);

  const priceChartData = chartData?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price,
  }));

  const activeError = detailError ?? chartError;
  const isRateLimit = activeError instanceof ApiError ? activeError.isRateLimit : false;

  const refetch = () => {
    refetchDetail();
    refetchChart();
  };

  return {
    isOpen,
    coinDetail,
    priceChartData,
    isLoading: isDetailLoading || isChartLoading,
    hasError: !!(detailError || chartError),
    isRateLimit,
    refetch,
  };
}
