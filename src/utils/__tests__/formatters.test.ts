import {
  formatCompactUSD,
  formatDate,
  formatPercent,
  formatUSD,
  truncateText,
} from '../formatters';

describe('formatUSD', () => {
  it('formats a positive number as USD', () => {
    expect(formatUSD(1234.56)).toBe('$1,234.56');
  });

  it('formats zero as USD', () => {
    expect(formatUSD(0)).toBe('$0.00');
  });

  it('formats a large number with commas', () => {
    expect(formatUSD(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatCompactUSD', () => {
  it('formats trillions with T suffix', () => {
    const result = formatCompactUSD(1_200_000_000_000);
    expect(result).toMatch(/T/i);
    expect(result).toContain('$');
    expect(result).toContain('1');
  });

  it('formats billions with B suffix', () => {
    const result = formatCompactUSD(340_000_000_000);
    expect(result).toMatch(/B/i);
    expect(result).toContain('$');
  });

  it('formats millions with M suffix', () => {
    const result = formatCompactUSD(5_000_000);
    expect(result).toMatch(/M/i);
    expect(result).toContain('$');
  });
});

describe('formatPercent', () => {
  it('formats a positive value with + sign', () => {
    const result = formatPercent(2.5);
    expect(result).toContain('+');
    expect(result).toContain('2.50%');
  });

  it('formats a negative value with - sign', () => {
    const result = formatPercent(-1.23);
    expect(result).toContain('-');
    expect(result).toContain('1.23%');
  });

  it('formats zero with a sign', () => {
    const result = formatPercent(0);
    expect(result).toContain('0.00%');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string to a human-readable date', () => {
    const result = formatDate('2021-11-10T00:00:00.000Z');
    expect(result).toContain('2021');
    expect(result).toContain('Nov');
  });
});

describe('truncateText', () => {
  it('returns the original text when shorter than maxLength', () => {
    expect(truncateText('short', 10)).toBe('short');
  });

  it('returns text at exactly maxLength without truncation', () => {
    expect(truncateText('exactly10c', 10)).toBe('exactly10c');
  });

  it('truncates text longer than maxLength with ellipsis', () => {
    const result = truncateText('this is a long text', 10);
    expect(result).toBe('this is a ...');
  });
});
