import { act, renderHook } from '@testing-library/react';

import { useSorting } from '../useSorting';

interface IItem {
  name: string;
  value: number;
}

const ITEMS: IItem[] = [
  { name: 'Banana', value: 30 },
  { name: 'apple', value: 10 },
  { name: 'Cherry', value: 20 },
];

describe('useSorting', () => {
  describe('initial state', () => {
    it('returns the initial sort field and direction', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'value', initialDirection: 'asc' }),
      );

      expect(result.current.sortState).toEqual({ field: 'value', direction: 'asc' });
    });

    it('defaults to asc when initialDirection is omitted', () => {
      const { result } = renderHook(() => useSorting({ data: ITEMS, initialField: 'name' }));

      expect(result.current.sortState.direction).toBe('asc');
    });
  });

  describe('numeric sorting', () => {
    it('sorts numbers ascending by default', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'value', initialDirection: 'asc' }),
      );

      const values = result.current.sortedData.map((i) => i.value);
      expect(values).toEqual([10, 20, 30]);
    });

    it('sorts numbers descending when initialDirection is desc', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'value', initialDirection: 'desc' }),
      );

      const values = result.current.sortedData.map((i) => i.value);
      expect(values).toEqual([30, 20, 10]);
    });

    it('toggles from asc to desc on same field', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'value', initialDirection: 'asc' }),
      );

      act(() => result.current.handleSort('value'));

      expect(result.current.sortState).toEqual({ field: 'value', direction: 'desc' });
      expect(result.current.sortedData.map((i) => i.value)).toEqual([30, 20, 10]);
    });

    it('toggles from desc to asc on same field', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'value', initialDirection: 'desc' }),
      );

      act(() => result.current.handleSort('value'));

      expect(result.current.sortState).toEqual({ field: 'value', direction: 'asc' });
      expect(result.current.sortedData.map((i) => i.value)).toEqual([10, 20, 30]);
    });
  });

  describe('string sorting', () => {
    it('sorts strings ascending (case-insensitive locale order)', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'name', initialDirection: 'asc' }),
      );

      const names = result.current.sortedData.map((i) => i.name.toLowerCase());
      expect(names).toEqual(['apple', 'banana', 'cherry']);
    });

    it('sorts strings descending', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'name', initialDirection: 'desc' }),
      );

      const names = result.current.sortedData.map((i) => i.name.toLowerCase());
      expect(names).toEqual(['cherry', 'banana', 'apple']);
    });
  });

  describe('field switching', () => {
    it('resets to asc when switching to a different field', () => {
      const { result } = renderHook(() =>
        useSorting({ data: ITEMS, initialField: 'value', initialDirection: 'asc' }),
      );

      // Toggle current field to desc
      act(() => result.current.handleSort('value'));
      expect(result.current.sortState.direction).toBe('desc');

      // Switch to a different field → should start asc
      act(() => result.current.handleSort('name'));
      expect(result.current.sortState).toEqual({ field: 'name', direction: 'asc' });
    });
  });

  describe('custom comparator', () => {
    it('uses the provided comparator instead of the default', () => {
      // Sort by string length ascending
      const byLength = (a: IItem, b: IItem, _field: string, direction: 'asc' | 'desc') => {
        const diff = a.name.length - b.name.length;
        return direction === 'asc' ? diff : -diff;
      };

      const { result } = renderHook(() =>
        useSorting({
          data: ITEMS,
          initialField: 'name',
          initialDirection: 'asc',
          comparator: byLength,
        }),
      );

      const names = result.current.sortedData.map((i) => i.name);
      // "apple"(5), "Banana"(6), "Cherry"(6) — apple comes first
      expect(names[0]).toBe('apple');
    });
  });

  describe('edge cases', () => {
    it('returns an empty array when data is empty', () => {
      const { result } = renderHook(() => useSorting<IItem>({ data: [], initialField: 'value' }));

      expect(result.current.sortedData).toEqual([]);
    });

    it('returns a single-element array unchanged', () => {
      const single = [{ name: 'Solo', value: 42 }];
      const { result } = renderHook(() => useSorting({ data: single, initialField: 'value' }));

      expect(result.current.sortedData).toEqual(single);
    });

    it('does not mutate the original data array', () => {
      const data = [
        { name: 'Z', value: 3 },
        { name: 'A', value: 1 },
      ];
      const original = [...data];

      renderHook(() => useSorting({ data, initialField: 'value', initialDirection: 'desc' }));

      expect(data).toEqual(original);
    });

    it('handles null-like numeric values (null coerces to 0) without throwing', () => {
      const withNull = [
        { name: 'A', value: null as unknown as number },
        { name: 'B', value: 5 },
      ];

      expect(() =>
        renderHook(() =>
          useSorting({ data: withNull, initialField: 'value', initialDirection: 'asc' }),
        ),
      ).not.toThrow();
    });
  });
});
