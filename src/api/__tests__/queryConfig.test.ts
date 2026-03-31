import { ApiError } from '../coingecko';
import { apiRetry, apiRetryDelay } from '../queryConfig';

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const error = new ApiError('something failed', 500, false);
    expect(error).toBeInstanceOf(Error);
  });

  it('carries the correct statusCode', () => {
    const error = new ApiError('not found', 404, false);
    expect(error.statusCode).toBe(404);
  });

  it('sets isRateLimit=true for 429 errors', () => {
    const error = new ApiError('rate limited', 429, true);
    expect(error.isRateLimit).toBe(true);
  });

  it('sets isRateLimit=false for non-rate-limit errors', () => {
    const error = new ApiError('server error', 500, false);
    expect(error.isRateLimit).toBe(false);
  });

  it('sets the error name to "ApiError"', () => {
    const error = new ApiError('oops', 503, false);
    expect(error.name).toBe('ApiError');
  });

  it('passes the message to the Error base class', () => {
    const error = new ApiError('custom message', 400, false);
    expect(error.message).toBe('custom message');
  });
});

describe('apiRetry', () => {
  describe('rate-limit (429) errors', () => {
    it('never retries on rate-limit ApiError regardless of attempt count', () => {
      const retry = apiRetry(3);
      const rateLimitError = new ApiError('rate limited', 429, true);

      expect(retry(0, rateLimitError)).toBe(false);
      expect(retry(1, rateLimitError)).toBe(false);
      expect(retry(2, rateLimitError)).toBe(false);
    });
  });

  describe('non-rate-limit ApiError (e.g. 500)', () => {
    it('retries while failureCount is less than maxAttempts', () => {
      const retry = apiRetry(3);
      const serverError = new ApiError('server error', 500, false);

      expect(retry(0, serverError)).toBe(true);
      expect(retry(1, serverError)).toBe(true);
      expect(retry(2, serverError)).toBe(true);
    });

    it('stops retrying once failureCount reaches maxAttempts', () => {
      const retry = apiRetry(3);
      const serverError = new ApiError('server error', 500, false);

      expect(retry(3, serverError)).toBe(false);
      expect(retry(4, serverError)).toBe(false);
    });
  });

  describe('generic (non-ApiError) errors', () => {
    it('retries while failureCount is less than maxAttempts', () => {
      const retry = apiRetry(2);
      const networkError = new Error('network failure');

      expect(retry(0, networkError)).toBe(true);
      expect(retry(1, networkError)).toBe(true);
    });

    it('stops retrying once failureCount reaches maxAttempts', () => {
      const retry = apiRetry(2);
      const networkError = new Error('network failure');

      expect(retry(2, networkError)).toBe(false);
    });
  });

  describe('maxAttempts boundary', () => {
    it('never retries when maxAttempts is 0', () => {
      const retry = apiRetry(0);
      const error = new Error('immediate fail');

      expect(retry(0, error)).toBe(false);
    });

    it('retries exactly once when maxAttempts is 1', () => {
      const retry = apiRetry(1);
      const error = new Error('transient error');

      expect(retry(0, error)).toBe(true);
      expect(retry(1, error)).toBe(false);
    });
  });
});

describe('apiRetryDelay', () => {
  it('returns 1000 ms on the first attempt (attempt 0)', () => {
    expect(apiRetryDelay(0)).toBe(1_000);
  });

  it('returns 2000 ms on the second attempt (attempt 1)', () => {
    expect(apiRetryDelay(1)).toBe(2_000);
  });

  it('returns 4000 ms on the third attempt (attempt 2)', () => {
    expect(apiRetryDelay(2)).toBe(4_000);
  });

  it('caps the delay at 30 000 ms regardless of attempt count', () => {
    expect(apiRetryDelay(10)).toBe(30_000);
    expect(apiRetryDelay(100)).toBe(30_000);
  });
});
