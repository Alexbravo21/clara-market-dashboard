import { ApiError } from '../api';
import type { ICoinDetail, IPriceChartPoint } from '../domain/coin';
import type { Currency } from '../domain/currency';
import { useCoinDetail } from './useCoinDetail';
import { useCoinMarketChart } from './useCoinMarketChart';

export type { IPriceChartPoint } from '../domain/coin';

export interface IUseAssetDrawerResult {
  isOpen: boolean;
  coinDetail: ICoinDetail | undefined;
  priceChartData: IPriceChartPoint[];
  isLoading: boolean;
  hasError: boolean;
  isRateLimit: boolean;
  refetch: () => void;
}

interface IUseAssetDrawerOptions {
  selectedCoinId: string | null;
  currency: Currency;
}

/**
 * Manages data fetching and state for the asset detail drawer.
 * @param options - The currently selected coin ID and active currency.
 * @returns Drawer open state, coin detail, chart data, loading/error flags, and a refetch callback.
 */
export function useAssetDrawer({ selectedCoinId, currency }: IUseAssetDrawerOptions): IUseAssetDrawerResult {
  const isOpen = !!selectedCoinId;

  const {
    data: coinDetail,
    isLoading: isDetailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useCoinDetail(selectedCoinId, currency);

  const {
    data: priceChartData = [],
    isLoading: isChartLoading,
    error: chartError,
    refetch: refetchChart,
  } = useCoinMarketChart(selectedCoinId, currency);

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
