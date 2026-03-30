import { useCallback, useMemo, useState } from 'react';

type FilterPredicate<T> = (row: T, query: string) => boolean;

interface IUseFilteringOptions<T> {
  data: T[];
  predicate: FilterPredicate<T>;
}

interface IUseFilteringResult<T> {
  filteredData: T[];
  filterQuery: string;
  setFilterQuery: (query: string) => void;
}

/**
 * Generic hook that manages filter state and returns filtered data.
 * UI-agnostic and accepts any predicate function to determine matches.
 */
export function useFiltering<T>({
  data,
  predicate,
}: IUseFilteringOptions<T>): IUseFilteringResult<T> {
  const [filterQuery, setFilterQuery] = useState('');

  const handleSetFilterQuery = useCallback((query: string) => {
    setFilterQuery(query);
  }, []);

  const filteredData = useMemo(() => {
    if (!filterQuery.trim()) return data;
    return data.filter((row) => predicate(row, filterQuery));
  }, [data, filterQuery, predicate]);

  return { filteredData, filterQuery, setFilterQuery: handleSetFilterQuery };
}
