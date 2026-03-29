export interface ISparklineData {
  price: number[];
}

export interface ICoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: ISparklineData;
}

export interface ICoinImage {
  thumb: string;
  small: string;
  large: string;
}

export interface ICoinMarketData {
  current_price: { usd: number };
  ath: { usd: number };
  ath_date: { usd: string };
  atl: { usd: number };
  atl_date: { usd: string };
}

export interface ICoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: ICoinImage;
  description: { en: string };
  market_data: ICoinMarketData;
}

export interface IMarketChartData {
  prices: [number, number][];
}

export type SortField =
  | 'market_cap_rank'
  | 'name'
  | 'current_price'
  | 'price_change_percentage_24h'
  | 'market_cap';

export type SortDirection = 'asc' | 'desc';

export interface ISortConfig {
  field: SortField;
  direction: SortDirection;
}
