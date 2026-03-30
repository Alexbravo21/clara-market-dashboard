export interface ICoinRow {
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

export interface ICoinDetailView {
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
