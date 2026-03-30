import type { ICoinDetail, ICoinMarket, IMarketChartData } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const RATE_LIMIT_STATUS = 429;

/**
 * Custom error class for CoinGecko API failures.
 * Carries the HTTP status code and a flag indicating whether the failure was a rate limit.
 */
class ApiError extends Error {
  statusCode: number;
  isRateLimit: boolean;

  constructor(message: string, statusCode: number, isRateLimit: boolean) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isRateLimit = isRateLimit;
  }
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    const isRateLimit = response.status === RATE_LIMIT_STATUS;
    throw new ApiError(
      isRateLimit
        ? 'API rate limit reached. Please wait a moment before retrying.'
        : `API request failed with status ${response.status}`,
      response.status,
      isRateLimit,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches the top 20 cryptocurrencies by market cap including 7-day sparkline data.
 * @returns Array of raw market coin objects from the CoinGecko API.
 */
export async function fetchMarketCoins(): Promise<ICoinMarket[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '20',
    page: '1',
    sparkline: 'true',
  });

  return apiFetch<ICoinMarket[]>(`/coins/markets?${params.toString()}`);
}

/**
 * Fetches detailed information for a specific cryptocurrency by its ID.
 * @param id - The CoinGecko coin ID (e.g. 'bitcoin').
 * @returns Raw coin detail object from the CoinGecko API.
 */
export async function fetchCoinDetail(id: string): Promise<ICoinDetail> {
  const params = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    community_data: 'false',
    developer_data: 'false',
  });

  return apiFetch<ICoinDetail>(`/coins/${encodeURIComponent(id)}?${params.toString()}`);
}

/**
 * Fetches the 7-day price history chart data for a specific cryptocurrency.
 * @param id - The CoinGecko coin ID (e.g. 'bitcoin').
 * @returns Market chart object containing an array of [timestamp, price] pairs.
 */
export async function fetchCoinMarketChart(id: string): Promise<IMarketChartData> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: '7',
  });

  return apiFetch<IMarketChartData>(
    `/coins/${encodeURIComponent(id)}/market_chart?${params.toString()}`,
  );
}

export { ApiError };
