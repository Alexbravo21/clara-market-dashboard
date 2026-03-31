import type { ISortState, SortDirection } from '../ui';
import { useFiltering } from './useFiltering';
import { useSorting } from './useSorting';

type FilterPredicate<T> = (row: T, query: string) => boolean;
type SortComparator<T> = (a: T, b: T, field: string, direction: SortDirection) => number;

interface ITableSortingConfig<T> {
  initialField: string;
  initialDirection?: SortDirection;
  comparator?: SortComparator<T>;
}

interface ITableFilteringConfig<T> {
  predicate: FilterPredicate<T>;
}

interface IUseTableOptions<T> {
  data: T[];
  sorting?: ITableSortingConfig<T>;
  filtering?: ITableFilteringConfig<T>;
}

interface IUseTableResult<T> {
  processedData: T[];
  sortState: ISortState<string>;
  filterQuery: string;
  handleSort: (field: string) => void;
  setFilterQuery: (query: string) => void;
}

const passThroughPredicate = () => true;

/**
 * Single orchestrator for all table behaviour: filtering then sorting.
 * Internally composes useFiltering and useSorting. UI-agnostic and fully generic.
 * @param options - Table configuration with raw data and optional sorting and filtering configs.
 * @returns Final processed data array plus unified sort/filter state and handlers.
 */
export function useTable<T>({ data, sorting, filtering }: IUseTableOptions<T>): IUseTableResult<T> {
  const { filteredData, filterQuery, setFilterQuery } = useFiltering({
    data,
    predicate: filtering?.predicate ?? passThroughPredicate,
  });

  const {
    sortedData: processedData,
    sortState,
    handleSort,
  } = useSorting({
    data: filteredData,
    initialField: sorting?.initialField ?? '',
    initialDirection: sorting?.initialDirection,
    comparator: sorting?.comparator,
  });

  return { processedData, sortState, filterQuery, handleSort, setFilterQuery };
}
