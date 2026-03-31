import { act, renderHook } from '@testing-library/react';

import { useTable } from '../useTable';

interface IItem {
  name: string;
  value: number;
}

const ITEMS: IItem[] = [
  { name: 'Banana', value: 30 },
  { name: 'apple', value: 10 },
  { name: 'Cherry', value: 20 },
];

const namePredicate = (row: IItem, query: string) =>
  row.name.toLowerCase().includes(query.toLowerCase());

describe('useTable', () => {
  describe('sorting', () => {
    it('sorts by the initial field ascending by default', () => {
      const { result } = renderHook(() =>
        useTable({ data: ITEMS, sorting: { initialField: 'value', initialDirection: 'asc' } }),
      );

      expect(result.current.processedData.map((i) => i.value)).toEqual([10, 20, 30]);
    });

    it('sorts by the initial field descending when specified', () => {
      const { result } = renderHook(() =>
        useTable({ data: ITEMS, sorting: { initialField: 'value', initialDirection: 'desc' } }),
      );

      expect(result.current.processedData.map((i) => i.value)).toEqual([30, 20, 10]);
    });

    it('toggles sort direction on the same field', () => {
      const { result } = renderHook(() =>
        useTable({ data: ITEMS, sorting: { initialField: 'value', initialDirection: 'asc' } }),
      );

      act(() => result.current.handleSort('value'));

      expect(result.current.sortState).toEqual({ field: 'value', direction: 'desc' });
      expect(result.current.processedData.map((i) => i.value)).toEqual([30, 20, 10]);
    });

    it('resets to asc when switching to a new field', () => {
      const { result } = renderHook(() =>
        useTable({ data: ITEMS, sorting: { initialField: 'value', initialDirection: 'desc' } }),
      );

      act(() => result.current.handleSort('name'));

      expect(result.current.sortState).toEqual({ field: 'name', direction: 'asc' });
    });
  });

  describe('filtering', () => {
    it('returns all data when query is empty', () => {
      const { result } = renderHook(() =>
        useTable({ data: ITEMS, filtering: { predicate: namePredicate } }),
      );

      expect(result.current.processedData).toHaveLength(3);
    });

    it('filters rows matching the query', () => {
      const { result } = renderHook(() =>
        useTable({ data: ITEMS, filtering: { predicate: namePredicate } }),
      );

      act(() => result.current.setFilterQuery('an'));

      // 'Banana' matches 'an'
      expect(result.current.processedData).toHaveLength(1);
      expect(result.current.processedData[0].name).toBe('Banana');
    });

    it('returns an empty array when nothing matches', () => {
      const { result } = renderHook(() =>
        useTable({ data: ITEMS, filtering: { predicate: namePredicate } }),
      );

      act(() => result.current.setFilterQuery('zzz'));

      expect(result.current.processedData).toHaveLength(0);
    });
  });

  describe('filtering then sorting (pipeline)', () => {
    it('filters first then sorts the filtered result', () => {
      const { result } = renderHook(() =>
        useTable({
          data: ITEMS,
          sorting: { initialField: 'value', initialDirection: 'asc' },
          filtering: { predicate: namePredicate },
        }),
      );

      // Filter to rows containing 'a' → 'Banana'(30) and 'apple'(10) and 'Cherry'(20) — 'a' in 'Banana' and 'apple'
      act(() => result.current.setFilterQuery('a'));

      const values = result.current.processedData.map((i) => i.value);
      // 'Banana'(30) and 'apple'(10) → sorted asc by value → [10, 30]
      expect(values).toEqual([10, 30]);
    });
  });

  describe('without config', () => {
    it('returns data in original order when no sorting or filtering config is provided', () => {
      const { result } = renderHook(() => useTable({ data: ITEMS }));

      expect(result.current.processedData).toEqual(ITEMS);
    });
  });
});
