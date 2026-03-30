import { useCallback, useMemo, useState } from 'react';

import type { ISortState, SortDirection } from '../ui';

interface IUseSortingOptions<T> {
  data: T[];
  initialField: string;
  initialDirection?: SortDirection;
  comparator?: (a: T, b: T, field: string, direction: SortDirection) => number;
}

interface IUseSortingResult<T> {
  sortedData: T[];
  sortState: ISortState<string>;
  handleSort: (field: string) => void;
}

function defaultComparator<T>(a: T, b: T, field: string, direction: SortDirection): number {
  const valueA = (a as Record<string, unknown>)[field];
  const valueB = (b as Record<string, unknown>)[field];

  if (typeof valueA === 'string' && typeof valueB === 'string') {
    const cmp = valueA.localeCompare(valueB);
    return direction === 'asc' ? cmp : -cmp;
  }

  const numA = valueA as number;
  const numB = valueB as number;
  return direction === 'asc' ? numA - numB : numB - numA;
}

/**
 * Generic hook that manages sort state and returns sorted data.
 * UI-agnostic and works with any data shape.
 * @param options - Sort configuration including data, initial field/direction, and optional comparator.
 * @returns Sorted data array, current sort state, and a handler to toggle sort by field.
 */
export function useSorting<T>({
  data,
  initialField,
  initialDirection = 'asc',
  comparator,
}: IUseSortingOptions<T>): IUseSortingResult<T> {
  const [sortState, setSortState] = useState<ISortState<string>>({
    field: initialField,
    direction: initialDirection,
  });

  const handleSort = useCallback((field: string) => {
    setSortState((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortedData = useMemo(() => {
    const compare = comparator ?? defaultComparator<T>;
    return [...data].sort((a, b) => compare(a, b, sortState.field, sortState.direction));
  }, [data, sortState, comparator]);

  return { sortedData, sortState, handleSort };
}
