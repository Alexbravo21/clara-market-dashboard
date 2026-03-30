import type { ICoinRow } from '../domain';
import { ApiError } from '../api';
import { useMarketCoins } from './useMarketCoins';
import { useTable } from './useTable';

function coinFilterPredicate(row: ICoinRow, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return (
    row.name.toLowerCase().includes(lowerQuery) || row.symbol.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Orchestrates all state and handlers needed by the MarketTable.
 * Composes useMarketCoins and useTable into a single interface.
 * @param onSelectCoin - Callback invoked when a row is clicked, receiving the coin ID.
 * @returns Processed coin rows, sort/filter state, row interaction handlers, and query status.
 */
export function useMarketController(onSelectCoin: (id: string) => void) {
  const { data: coins = [], isLoading, isFetching, error, refetch } = useMarketCoins();

  const isRateLimit = error instanceof ApiError ? error.isRateLimit : false;

  const { processedData, sortState, filterQuery, handleSort, setFilterQuery } = useTable<ICoinRow>({
    data: coins,
    initialSortField: 'rank',
    filterPredicate: coinFilterPredicate,
  });

  const handleRowClick = (row: ICoinRow) => {
    onSelectCoin(row.id);
  };

  return {
    processedCoins: processedData,
    sortState,
    filterQuery,
    handleSort,
    setFilterQuery,
    handleRowClick,
    isLoading,
    isFetching,
    hasError: !!error,
    isRateLimit,
    refetch,
  };
}
