import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface ISortState<TKey extends string> {
  field: TKey;
  direction: SortDirection;
}

/**
 * Defines how a single column in a generic table is rendered and behaved.
 * `render` is optional — when omitted, the raw value at `key` is rendered as a string.
 */
export interface IColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  render?: (row: T) => ReactNode;
}
