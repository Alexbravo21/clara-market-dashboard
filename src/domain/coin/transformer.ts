import type { ICoinDetail as ICoinDetailRaw, ICoinMarket, IMarketChartData } from '../../types';

import type { ICoin, ICoinDetail, IPriceChartPoint } from './types';

// --- Private safe-parsing helpers ---

function safeString(value: string | null | undefined, fallback = ''): string {
  if (typeof value === 'string' && value.length > 0) return value;
  return fallback;
}

function safeNumber(value: number | string | null | undefined, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function safeNumberOrNull(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function safeNumberArray(value: number[] | null | undefined): number[] {
  if (!value) return [];
  return value.filter((n) => Number.isFinite(n));
}

function stripHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '');
}

// --- Public transformers ---

/**
 * Transforms a raw CoinGecko market API response into the clean ICoin domain model.
 * All fields are parsed defensively — the returned object is always valid.
 * @param raw - Raw market coin object from the CoinGecko API.
 * @returns Flat ICoin domain object with normalised field names.
 */
export function mapCoin(raw: ICoinMarket): ICoin {
  return {
    id: safeString(raw.id),
    rank: safeNumber(raw.market_cap_rank, 0),
    name: safeString(raw.name, 'Unknown'),
    symbol: safeString(raw.symbol),
    imageUrl: safeString(raw.image),
    price: safeNumber(raw.current_price),
    priceChange24h: safeNumberOrNull(raw.price_change_percentage_24h),
    marketCap: safeNumber(raw.market_cap),
    sparklinePrices: safeNumberArray(raw.sparkline_in_7d?.price),
  };
}

/**
 * Transforms a raw CoinGecko detail API response into the clean ICoinDetail domain model.
 * All nested paths are accessed with optional chaining and safe-parsed.
 * @param raw - Raw coin detail object from the CoinGecko API.
 * @returns Flat ICoinDetail domain object.
 */
export function mapCoinDetail(raw: ICoinDetailRaw): ICoinDetail {
  const marketData = raw.market_data;
  return {
    id: safeString(raw.id),
    name: safeString(raw.name, 'Unknown'),
    symbol: safeString(raw.symbol),
    imageUrl: safeString(raw.image?.large),
    price: safeNumber(marketData?.current_price?.usd),
    allTimeHigh: safeNumber(marketData?.ath?.usd),
    allTimeHighDate: safeString(marketData?.ath_date?.usd),
    allTimeLow: safeNumber(marketData?.atl?.usd),
    allTimeLowDate: safeString(marketData?.atl_date?.usd),
    description: stripHtml(raw.description?.en),
  };
}

/**
 * Transforms a raw CoinGecko market chart response into an array of IPriceChartPoint.
 * Entries with invalid timestamps or prices are silently dropped.
 * @param raw - Raw market chart data from the CoinGecko API.
 * @returns Array of price chart data points ready for rendering.
 */
export function mapPriceChartPoints(raw: IMarketChartData): IPriceChartPoint[] {
  if (!Array.isArray(raw.prices)) return [];

  return raw.prices
    .filter((entry): entry is [number, number] => Array.isArray(entry) && entry.length >= 2)
    .flatMap(([timestamp, price]) => {
      const ts = Number(timestamp);
      const p = Number(price);
      if (!Number.isFinite(ts) || !Number.isFinite(p)) return [];
      return [
        {
          date: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: p,
        },
      ];
    });
}
