export type Currency = 'usd' | 'eur' | 'mxn';

export interface ICurrencyOption {
  value: Currency;
  label: string;
}

export const SUPPORTED_CURRENCIES: ICurrencyOption[] = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'mxn', label: 'MXN' },
];

export const DEFAULT_CURRENCY: Currency = 'usd';
