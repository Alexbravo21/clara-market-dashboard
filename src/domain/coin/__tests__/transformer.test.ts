import { mapCoin, mapCoinDetail, mapPriceChartPoints } from '../transformer';
import type { ICoinMarket, ICoinDetail, IMarketChartData } from '../../../types';

// --- Fixtures ---

const VALID_COIN_MARKET: ICoinMarket = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/btc.png',
  current_price: 50000,
  market_cap: 1_000_000_000_000,
  market_cap_rank: 1,
  price_change_percentage_24h: 2.5,
  sparkline_in_7d: { price: [48000, 49000, 50000] },
};

const VALID_COIN_DETAIL: ICoinDetail = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: { thumb: '', small: '', large: 'https://example.com/btc-large.png' },
  description: { en: '<p>A <b>decentralised</b> currency.</p>' },
  market_data: {
    current_price: { usd: 50000 },
    ath: { usd: 69000 },
    ath_date: { usd: '2021-11-10T00:00:00.000Z' },
    atl: { usd: 67.81 },
    atl_date: { usd: '2013-07-06T00:00:00.000Z' },
  },
};

const VALID_MARKET_CHART: IMarketChartData = {
  prices: [
    [1_700_000_000_000, 42000],
    [1_700_086_400_000, 43000],
  ],
};

// --- mapCoin ---

describe('mapCoin', () => {
  describe('happy path', () => {
    it('maps all fields correctly from a valid response', () => {
      const result = mapCoin(VALID_COIN_MARKET);

      expect(result.id).toBe('bitcoin');
      expect(result.rank).toBe(1);
      expect(result.name).toBe('Bitcoin');
      expect(result.symbol).toBe('btc');
      expect(result.imageUrl).toBe('https://example.com/btc.png');
      expect(result.price).toBe(50000);
      expect(result.priceChange24h).toBe(2.5);
      expect(result.marketCap).toBe(1_000_000_000_000);
      expect(result.sparklinePrices).toEqual([48000, 49000, 50000]);
    });
  });

  describe('missing or null fields', () => {
    it('returns empty string for missing id', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, id: null }).id).toBe('');
    });

    it('returns "Unknown" for missing name', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, name: undefined }).name).toBe('Unknown');
    });

    it('returns empty string for missing symbol', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, symbol: null }).symbol).toBe('');
    });

    it('returns empty string for missing imageUrl', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, image: null }).imageUrl).toBe('');
    });

    it('returns 0 for null current_price', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, current_price: null }).price).toBe(0);
    });

    it('returns 0 for null market_cap', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, market_cap: null }).marketCap).toBe(0);
    });

    it('returns 0 for null market_cap_rank', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, market_cap_rank: null }).rank).toBe(0);
    });

    it('returns null for null price_change_percentage_24h', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, price_change_percentage_24h: null }).priceChange24h).toBeNull();
    });

    it('returns null for undefined price_change_percentage_24h', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, price_change_percentage_24h: undefined }).priceChange24h).toBeNull();
    });

    it('returns empty array for null sparkline_in_7d', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, sparkline_in_7d: null }).sparklinePrices).toEqual([]);
    });

    it('returns empty array for missing sparkline prices array', () => {
      expect(mapCoin({ ...VALID_COIN_MARKET, sparkline_in_7d: { price: null } }).sparklinePrices).toEqual([]);
    });

    it('filters NaN values out of sparkline price array', () => {
      const result = mapCoin({
        ...VALID_COIN_MARKET,
        sparkline_in_7d: { price: [100, NaN, 200] as unknown as number[] },
      });
      expect(result.sparklinePrices).toEqual([100, 200]);
    });
  });

  describe('numeric edge cases', () => {
    it('never returns NaN for price', () => {
      const result = mapCoin({ ...VALID_COIN_MARKET, current_price: NaN as unknown as number });
      expect(result.price).toBe(0);
      expect(Number.isNaN(result.price)).toBe(false);
    });

    it('never returns NaN for marketCap', () => {
      const result = mapCoin({ ...VALID_COIN_MARKET, market_cap: undefined });
      expect(result.marketCap).toBe(0);
      expect(Number.isNaN(result.marketCap)).toBe(false);
    });
  });
});

// --- mapCoinDetail ---

describe('mapCoinDetail', () => {
  describe('happy path', () => {
    it('maps all fields correctly from a valid response', () => {
      const result = mapCoinDetail(VALID_COIN_DETAIL);

      expect(result.id).toBe('bitcoin');
      expect(result.name).toBe('Bitcoin');
      expect(result.symbol).toBe('btc');
      expect(result.imageUrl).toBe('https://example.com/btc-large.png');
      expect(result.price).toBe(50000);
      expect(result.allTimeHigh).toBe(69000);
      expect(result.allTimeHighDate).toBe('2021-11-10T00:00:00.000Z');
      expect(result.allTimeLow).toBe(67.81);
      expect(result.allTimeLowDate).toBe('2013-07-06T00:00:00.000Z');
    });

    it('strips HTML tags from description', () => {
      const result = mapCoinDetail(VALID_COIN_DETAIL);
      expect(result.description).toBe('A decentralised currency.');
    });
  });

  describe('missing or null fields', () => {
    it('returns "Unknown" for missing name', () => {
      expect(mapCoinDetail({ ...VALID_COIN_DETAIL, name: null }).name).toBe('Unknown');
    });

    it('returns empty string for missing imageUrl (large)', () => {
      expect(
        mapCoinDetail({ ...VALID_COIN_DETAIL, image: { large: null } }).imageUrl,
      ).toBe('');
    });

    it('returns empty string when image is null', () => {
      expect(mapCoinDetail({ ...VALID_COIN_DETAIL, image: null }).imageUrl).toBe('');
    });

    it('returns empty string for missing description', () => {
      expect(mapCoinDetail({ ...VALID_COIN_DETAIL, description: null }).description).toBe('');
    });

    it('returns empty string when description.en is missing', () => {
      expect(mapCoinDetail({ ...VALID_COIN_DETAIL, description: { en: null } }).description).toBe('');
    });

    it('returns 0 for null current price', () => {
      const raw = {
        ...VALID_COIN_DETAIL,
        market_data: { ...VALID_COIN_DETAIL.market_data, current_price: { usd: null } },
      };
      expect(mapCoinDetail(raw).price).toBe(0);
    });

    it('returns 0 for null ATH', () => {
      const raw = {
        ...VALID_COIN_DETAIL,
        market_data: { ...VALID_COIN_DETAIL.market_data, ath: { usd: null } },
      };
      expect(mapCoinDetail(raw).allTimeHigh).toBe(0);
    });

    it('returns empty string for null ATH date', () => {
      const raw = {
        ...VALID_COIN_DETAIL,
        market_data: { ...VALID_COIN_DETAIL.market_data, ath_date: { usd: null } },
      };
      expect(mapCoinDetail(raw).allTimeHighDate).toBe('');
    });

    it('does not throw when market_data is entirely null', () => {
      expect(() => mapCoinDetail({ ...VALID_COIN_DETAIL, market_data: null })).not.toThrow();
      const result = mapCoinDetail({ ...VALID_COIN_DETAIL, market_data: null });
      expect(result.price).toBe(0);
      expect(result.allTimeHigh).toBe(0);
      expect(result.allTimeHighDate).toBe('');
    });
  });
});

// --- mapPriceChartPoints ---

describe('mapPriceChartPoints', () => {
  describe('happy path', () => {
    it('maps valid price entries to chart points', () => {
      const result = mapPriceChartPoints(VALID_MARKET_CHART);

      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(42000);
      expect(result[1].price).toBe(43000);
      expect(typeof result[0].date).toBe('string');
      expect(result[0].date.length).toBeGreaterThan(0);
    });
  });

  describe('missing or null fields', () => {
    it('returns empty array when prices is null', () => {
      expect(mapPriceChartPoints({ prices: null })).toEqual([]);
    });

    it('returns empty array when prices is undefined', () => {
      expect(mapPriceChartPoints({ prices: undefined })).toEqual([]);
    });

    it('returns empty array when prices is empty', () => {
      expect(mapPriceChartPoints({ prices: [] })).toEqual([]);
    });
  });

  describe('invalid entries', () => {
    it('drops entries with invalid timestamp', () => {
      const raw: IMarketChartData = {
        prices: [
          [NaN as unknown as number, 42000],
          [1_700_000_000_000, 43000],
        ],
      };
      const result = mapPriceChartPoints(raw);
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(43000);
    });

    it('drops entries with invalid price', () => {
      const raw: IMarketChartData = {
        prices: [
          [1_700_000_000_000, NaN as unknown as number],
          [1_700_086_400_000, 43000],
        ],
      };
      const result = mapPriceChartPoints(raw);
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(43000);
    });

    it('does not mutate the source array', () => {
      const prices: [number, number][] = [[1_700_000_000_000, 42000]];
      mapPriceChartPoints({ prices });
      expect(prices).toHaveLength(1);
    });
  });
});
