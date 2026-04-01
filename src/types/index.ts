export interface ISparklineData {
  price?: number[] | null;
}

export interface ICoinMarket {
  id?: string | null;
  symbol?: string | null;
  name?: string | null;
  image?: string | null;
  current_price?: number | null;
  market_cap?: number | null;
  market_cap_rank?: number | null;
  price_change_percentage_24h?: number | null;
  sparkline_in_7d?: ISparklineData | null;
}

export interface ICoinImage {
  thumb?: string | null;
  small?: string | null;
  large?: string | null;
}

export interface ICoinMarketData {
  current_price?: Record<string, number | null> | null;
  ath?: Record<string, number | null> | null;
  ath_date?: Record<string, string | null> | null;
  atl?: Record<string, number | null> | null;
  atl_date?: Record<string, string | null> | null;
}

export interface ICoinDetail {
  id?: string | null;
  symbol?: string | null;
  name?: string | null;
  image?: ICoinImage | null;
  description?: { en?: string | null } | null;
  market_data?: ICoinMarketData | null;
}

export interface IMarketChartData {
  prices?: [number, number][] | null;
}
