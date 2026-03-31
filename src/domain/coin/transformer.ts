import type { ICoinDetail as ICoinDetailRaw, ICoinMarket, IMarketChartData } from '../../types';

import type { ICoin, ICoinDetail, IPriceChartPoint } from './types';

/**
 * Transforms a raw CoinGecko market API response into the clean ICoin domain model.
 * @param raw - Raw market coin object from the CoinGecko API.
 * @returns Flat ICoin domain object with normalised field names.
 */
export function mapCoin(raw: ICoinMarket): ICoin {
  return {
    id: raw.id,
    rank: raw.market_cap_rank,
    name: raw.name,
    symbol: raw.symbol,
    imageUrl: raw.image,
    price: raw.current_price,
    priceChange24h: raw.price_change_percentage_24h ?? null,
    marketCap: raw.market_cap,
    sparklinePrices: raw.sparkline_in_7d?.price ?? [],
  };
}

/**
 * Transforms a raw CoinGecko detail API response into the clean ICoinDetail domain model.
 * Strips HTML tags from the description field.
 * @param raw - Raw coin detail object from the CoinGecko API.
 * @returns Flat ICoinDetail domain object.
 */
export function mapCoinDetail(raw: ICoinDetailRaw): ICoinDetail {
  return {
    id: raw.id,
    name: raw.name,
    symbol: raw.symbol,
    imageUrl: raw.image.large,
    price: raw.market_data.current_price.usd,
    allTimeHigh: raw.market_data.ath.usd,
    allTimeHighDate: raw.market_data.ath_date.usd,
    allTimeLow: raw.market_data.atl.usd,
    allTimeLowDate: raw.market_data.atl_date.usd,
    description: raw.description.en.replace(/<[^>]*>/g, ''),
  };
}

/**
 * Transforms a raw CoinGecko market chart response into an array of IPriceChartPoint.
 * Converts Unix timestamps to localised short date strings.
 * @param raw - Raw market chart data from the CoinGecko API.
 * @returns Array of price chart data points ready for rendering.
 */
export function mapPriceChartPoints(raw: IMarketChartData): IPriceChartPoint[] {
  return raw.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price,
  }));
}
