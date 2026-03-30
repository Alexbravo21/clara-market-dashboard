import type { ISortState, SortDirection } from '../ui/table';
import { useFiltering } from './useFiltering';
import { useSorting } from './useSorting';

type FilterPredicate<T> = (row: T, query: string) => boolean;

interface IUseTableOptions<T> {
  data: T[];
  initialSortField: string;
  initialSortDirection?: SortDirection;
  filterPredicate: FilterPredicate<T>;
  comparator?: (a: T, b: T, field: string, direction: SortDirection) => number;
}

interface IUseTableResult<T> {
  processedData: T[];
  sortState: ISortState<string>;
  filterQuery: string;
  handleSort: (field: string) => void;
  setFilterQuery: (query: string) => void;
}

/**
 * Composes useSorting and useFiltering to provide a unified table state hook.
 * Filtering is applied before sorting. UI-agnostic and fully generic.
 */
export function useTable<T>({
  data,
  initialSortField,
  initialSortDirection,
  filterPredicate,
  comparator,
}: IUseTableOptions<T>): IUseTableResult<T> {
  const { filteredData, filterQuery, setFilterQuery } = useFiltering({
    data,
    predicate: filterPredicate,
  });

  const {
    sortedData: processedData,
    sortState,
    handleSort,
  } = useSorting({
    data: filteredData,
    initialField: initialSortField,
    initialDirection: initialSortDirection,
    comparator,
  });

  return { processedData, sortState, filterQuery, handleSort, setFilterQuery };
}
