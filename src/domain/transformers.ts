import type { ICoinDetail, ICoinMarket } from '../types';
import type { ICoinDetailView, ICoinRow } from './models';

/**
 * Transforms a raw CoinGecko market API response into the clean ICoinRow domain model.
 */
export function mapCoinMarketToRow(raw: ICoinMarket): ICoinRow {
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
 * Transforms a raw CoinGecko detail API response into the clean ICoinDetailView domain model.
 */
export function mapCoinDetailToView(raw: ICoinDetail): ICoinDetailView {
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
