/**
 * Clean domain type representing a cryptocurrency as displayed in the market table.
 * Contains only the data needed by the UI — no raw API field names.
 */
export interface ICoin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  imageUrl: string;
  price: number;
  priceChange24h: number | null;
  marketCap: number;
  sparklinePrices: number[];
}

/**
 * Clean domain type representing detailed information about a single cryptocurrency.
 * Used by the asset detail drawer.
 */
export interface ICoinDetail {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  price: number;
  allTimeHigh: number;
  allTimeHighDate: string;
  allTimeLow: number;
  allTimeLowDate: string;
  description: string;
}

/**
 * A single data point in a coin's price history chart.
 */
export interface IPriceChartPoint {
  date: string;
  price: number;
}
