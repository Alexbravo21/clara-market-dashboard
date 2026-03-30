import { act, renderHook } from '@testing-library/react';

import { useFiltering } from '../useFiltering';

interface ICoin {
  name: string;
  symbol: string;
}

const COINS: ICoin[] = [
  { name: 'Bitcoin', symbol: 'btc' },
  { name: 'Ethereum', symbol: 'eth' },
  { name: 'Binance Coin', symbol: 'bnb' },
];

/** Mirrors the predicate used in useMarketController */
const coinPredicate = (row: ICoin, query: string) => {
  const q = query.toLowerCase();
  return row.name.toLowerCase().includes(q) || row.symbol.toLowerCase().includes(q);
};

describe('useFiltering', () => {
  describe('initial state', () => {
    it('returns all data when query is empty', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      expect(result.current.filteredData).toEqual(COINS);
      expect(result.current.filterQuery).toBe('');
    });
  });

  describe('filtering by name', () => {
    it('filters by exact name (case-insensitive)', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('bitcoin'));

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].name).toBe('Bitcoin');
    });

    it('filters by partial name match', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      // 'binance' is a partial match for 'Binance Coin' only
      act(() => result.current.setFilterQuery('binance'));

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].name).toBe('Binance Coin');
    });

    it('filters returning multiple matches when query is shared', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      // 'coin' appears in both 'Bitcoin' (bit-c-o-i-n) and 'Binance Coin'
      act(() => result.current.setFilterQuery('coin'));

      expect(result.current.filteredData).toHaveLength(2);
      const names = result.current.filteredData.map((c) => c.name);
      expect(names).toContain('Bitcoin');
      expect(names).toContain('Binance Coin');
    });

    it('is case-insensitive for names', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('ETHER'));

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].name).toBe('Ethereum');
    });
  });

  describe('filtering by symbol', () => {
    it('filters by exact symbol', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('eth'));

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].symbol).toBe('eth');
    });

    it('is case-insensitive for symbols', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('BTC'));

      expect(result.current.filteredData).toHaveLength(1);
      expect(result.current.filteredData[0].symbol).toBe('btc');
    });
  });

  describe('no matches', () => {
    it('returns empty array when nothing matches', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('dogecoin'));

      expect(result.current.filteredData).toHaveLength(0);
    });
  });

  describe('whitespace handling', () => {
    it('treats whitespace-only query as empty (returns all rows)', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('   '));

      expect(result.current.filteredData).toEqual(COINS);
    });

    it('matches after clearing the query', () => {
      const { result } = renderHook(() => useFiltering({ data: COINS, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('bitcoin'));
      expect(result.current.filteredData).toHaveLength(1);

      act(() => result.current.setFilterQuery(''));
      expect(result.current.filteredData).toEqual(COINS);
    });
  });

  describe('predicate flexibility', () => {
    it('respects a custom predicate (filter by first letter)', () => {
      const firstLetterPredicate = (row: ICoin, query: string) =>
        row.name.toLowerCase().startsWith(query.toLowerCase());

      const { result } = renderHook(() =>
        useFiltering({ data: COINS, predicate: firstLetterPredicate }),
      );

      act(() => result.current.setFilterQuery('b'));

      const names = result.current.filteredData.map((c) => c.name);
      expect(names).toEqual(['Bitcoin', 'Binance Coin']);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when data is empty', () => {
      const { result } = renderHook(() =>
        useFiltering<ICoin>({ data: [], predicate: coinPredicate }),
      );

      act(() => result.current.setFilterQuery('bitcoin'));

      expect(result.current.filteredData).toEqual([]);
    });

    it('does not mutate the original data array', () => {
      const data = [...COINS];
      const original = [...data];

      const { result } = renderHook(() => useFiltering({ data, predicate: coinPredicate }));

      act(() => result.current.setFilterQuery('eth'));

      expect(data).toEqual(original);
    });
  });
});
