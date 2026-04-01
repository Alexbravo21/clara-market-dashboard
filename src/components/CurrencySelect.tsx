import { SUPPORTED_CURRENCIES } from '../domain/currency';
import type { Currency } from '../domain/currency';
import type { ICurrencyControlState } from '../hooks';

interface ICurrencySelectProps {
  currencyControl: ICurrencyControlState;
}

/**
 * Dropdown that lets the user switch between supported currencies.
 * Purely presentational — all state is managed by the parent via currencyControl.
 */
export function CurrencySelect({ currencyControl }: ICurrencySelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="currency-select"
        className="text-sm font-medium text-gray-600 dark:text-gray-400"
      >
        Currency
      </label>
      <select
        id="currency-select"
        value={currencyControl.currency}
        onChange={(e) => currencyControl.onChange(e.target.value as Currency)}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        aria-label="Select currency"
      >
        {SUPPORTED_CURRENCIES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
