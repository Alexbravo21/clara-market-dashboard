import { useState } from 'react';

import type { ISortState } from '../ui';
import type { ICoin, ICoinDetail, IPriceChartPoint } from '../domain/coin';
import { ApiError } from '../api';
import { useMarketCoins } from './useMarketCoins';
import { useTable } from './useTable';
import { useAssetDrawer } from './useAssetDrawer';
// import { usePrefetchCoinDetail } from './usePrefetchCoinDetail';

function coinFilterPredicate(row: ICoin, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return (
    row.name.toLowerCase().includes(lowerQuery) || row.symbol.toLowerCase().includes(lowerQuery)
  );
}

export interface ITableSortingState {
  state: ISortState<string>;
  onSort: (field: string) => void;
}

export interface ITableFilteringState {
  query: string;
  onChange: (query: string) => void;
}

export interface ITableControllerState {
  data: ICoin[];
  sorting: ITableSortingState;
  filtering: ITableFilteringState;
  onRowClick: (row: ICoin) => void;
  // onRowHover: (row: ICoin) => void;
}

export interface IDrawerControllerState {
  isOpen: boolean;
  coinDetail: ICoinDetail | undefined;
  priceChartData: IPriceChartPoint[];
  isLoading: boolean;
  hasError: boolean;
  isRateLimit: boolean;
  open: (id: string) => void;
  close: () => void;
  refetch: () => void;
}

export interface IPageState {
  isLoading: boolean;
  isFetching: boolean;
  hasError: boolean;
  isRateLimit: boolean;
  refetch: () => void;
}

export interface IMarketControllerResult {
  table: ITableControllerState;
  drawer: IDrawerControllerState;
  state: IPageState;
}

/**
 * Single orchestrator for the market page.
 * Composes data fetching, table behaviour, asset selection and drawer data into one unified API.
 * Contains no UI logic.
 * @returns Structured table, drawer, and page state.
 */
export function useMarketController(): IMarketControllerResult {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const { data: coins = [], isLoading, isFetching, error, refetch } = useMarketCoins();
  const isRateLimit = error instanceof ApiError ? error.isRateLimit : false;
  // const prefetchCoinDetail = usePrefetchCoinDetail();

  const { processedData, sortState, filterQuery, handleSort, setFilterQuery } = useTable<ICoin>({
    data: coins,
    sorting: { initialField: 'rank' },
    filtering: { predicate: coinFilterPredicate },
  });

  const {
    isOpen,
    coinDetail,
    priceChartData,
    isLoading: isDrawerLoading,
    hasError: drawerHasError,
    isRateLimit: drawerIsRateLimit,
    refetch: refetchDrawer,
  } = useAssetDrawer({ selectedCoinId });

  return {
    table: {
      data: processedData,
      sorting: { state: sortState, onSort: handleSort },
      filtering: { query: filterQuery, onChange: setFilterQuery },
      onRowClick: (row: ICoin) => setSelectedCoinId(row.id),
      // onRowHover: (row: ICoin) => prefetchCoinDetail(row.id),
    },
    drawer: {
      isOpen,
      coinDetail,
      priceChartData,
      isLoading: isDrawerLoading,
      hasError: drawerHasError,
      isRateLimit: drawerIsRateLimit,
      open: (id: string) => setSelectedCoinId(id),
      close: () => setSelectedCoinId(null),
      refetch: refetchDrawer,
    },
    state: {
      isLoading,
      isFetching,
      hasError: !!error,
      isRateLimit,
      refetch,
    },
  };
}
