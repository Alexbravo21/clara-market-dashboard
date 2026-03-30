import type { ICoinRow } from '../domain';
import { useSelectedCoin } from '../context';
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
 * Composes useMarketCoins, useTable, and useSelectedCoin into a single interface.
 */
export function useMarketController() {
  const { data: coins = [], isLoading, isFetching, error, refetch } = useMarketCoins();
  const { selectedCoinId, selectCoin } = useSelectedCoin();

  const { processedData, sortState, filterQuery, handleSort, setFilterQuery } = useTable<ICoinRow>({
    data: coins,
    initialSortField: 'rank',
    filterPredicate: coinFilterPredicate,
  });

  const handleRowClick = (row: ICoinRow) => {
    selectCoin(row.id);
  };

  return {
    processedCoins: processedData,
    sortState,
    filterQuery,
    handleSort,
    setFilterQuery,
    selectedCoinId,
    handleRowClick,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
