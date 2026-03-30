import { ApiError, fetchCoinDetail, fetchCoinMarketChart, fetchMarketCoins } from '../coingecko';
import type { ICoinMarket, IMarketChartData } from '../../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

/** Creates a minimal mock Response object with the given status and body. */
function mockResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe('CoinGecko API fetch functions', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchMarketCoins', () => {
    it('calls the correct endpoint with required query params', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(200, []));

      await fetchMarketCoins();

      const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain(`${BASE_URL}/coins/markets`);
      expect(calledUrl).toContain('vs_currency=usd');
      expect(calledUrl).toContain('order=market_cap_desc');
      expect(calledUrl).toContain('per_page=20');
      expect(calledUrl).toContain('sparkline=true');
    });

    it('returns parsed data on a 200 response', async () => {
      const payload: Partial<ICoinMarket>[] = [{ id: 'bitcoin', name: 'Bitcoin' }];
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(200, payload));

      const result = await fetchMarketCoins();

      expect(result).toEqual(payload);
    });

    it('throws ApiError with isRateLimit=true on a 429 response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(429, {}));

      const error = await fetchMarketCoins().catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isRateLimit).toBe(true);
      expect((error as ApiError).statusCode).toBe(429);
    });

    it('throws ApiError with isRateLimit=false on a 500 response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(500, {}));

      const error = await fetchMarketCoins().catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isRateLimit).toBe(false);
      expect((error as ApiError).statusCode).toBe(500);
    });

    it('throws ApiError on any non-ok status', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(404, {}));

      await expect(fetchMarketCoins()).rejects.toBeInstanceOf(ApiError);
    });
  });

  describe('fetchCoinDetail', () => {
    it('calls the correct endpoint including the encoded coin ID', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(200, { id: 'bitcoin' }));

      await fetchCoinDetail('bitcoin');

      const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain(`${BASE_URL}/coins/bitcoin`);
      expect(calledUrl).toContain('localization=false');
      expect(calledUrl).toContain('tickers=false');
    });

    it('URL-encodes coin IDs that contain special characters', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(200, {}));

      await fetchCoinDetail('my coin/v2').catch(() => {});

      const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain(encodeURIComponent('my coin/v2'));
    });

    it('returns parsed detail data on a 200 response', async () => {
      const payload = { id: 'ethereum', name: 'Ethereum' };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(200, payload));

      const result = await fetchCoinDetail('ethereum');

      expect(result).toMatchObject(payload);
    });

    it('throws ApiError with isRateLimit=true on a 429 response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(429, {}));

      const error = await fetchCoinDetail('bitcoin').catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isRateLimit).toBe(true);
    });

    it('throws ApiError with isRateLimit=false on a 503 response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(503, {}));

      const error = await fetchCoinDetail('bitcoin').catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isRateLimit).toBe(false);
      expect((error as ApiError).statusCode).toBe(503);
    });
  });

  describe('fetchCoinMarketChart', () => {
    it('calls the correct endpoint for the given coin', async () => {
      const payload: IMarketChartData = { prices: [[1_700_000_000_000, 50000]] };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(200, payload));

      await fetchCoinMarketChart('bitcoin');

      const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain(`${BASE_URL}/coins/bitcoin/market_chart`);
      expect(calledUrl).toContain('vs_currency=usd');
      expect(calledUrl).toContain('days=7');
    });

    it('returns price point data on a 200 response', async () => {
      const payload: IMarketChartData = { prices: [[1_700_000_000_000, 42000]] };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(200, payload));

      const result = await fetchCoinMarketChart('bitcoin');

      expect(result).toEqual(payload);
    });

    it('throws ApiError with isRateLimit=true on a 429 response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(429, {}));

      const error = await fetchCoinMarketChart('bitcoin').catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isRateLimit).toBe(true);
    });

    it('throws ApiError on a 500 response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(500, {}));

      await expect(fetchCoinMarketChart('bitcoin')).rejects.toBeInstanceOf(ApiError);
    });
  });
});
