import type { IColumn, ISortState } from './types';

interface ITableProps<T> {
  data: T[];
  columns: IColumn<T>[];
  rowKey: (row: T) => string;
  sortState?: ISortState<string>;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  onRowKeyDown?: (event: React.KeyboardEvent, row: T) => void;
  ariaRowLabel?: (row: T) => string;
  emptyState?: React.ReactNode;
}

/**
 * A generic, headless-pattern table component that renders rows and columns
 * based on a column definition schema. Contains no business logic.
 */
export function Table<T>({
  data,
  columns,
  rowKey,
  sortState,
  onSort,
  onRowClick,
  onRowKeyDown,
  ariaRowLabel,
  emptyState,
}: ITableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 select-none ${column.headerClassName ?? ''}`}
                >
                  {column.sortable && onSort ? (
                    <SortButton
                      label={column.header}
                      columnKey={column.key}
                      sortState={sortState}
                      onSort={onSort}
                    />
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                className={
                  onRowClick
                    ? 'cursor-pointer transition-colors hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800'
                    : undefined
                }
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowKeyDown ? (e) => onRowKeyDown(e, row) : undefined}
                aria-label={ariaRowLabel ? ariaRowLabel(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 ${column.cellClassName ?? ''}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ISortButtonProps {
  label: string;
  columnKey: string;
  sortState?: ISortState<string>;
  onSort: (key: string) => void;
}

function SortButton({ label, columnKey, sortState, onSort }: ISortButtonProps) {
  const isActive = sortState?.field === columnKey;
  const direction = sortState?.direction;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSort(columnKey);
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center gap-1 rounded transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-gray-100 ${
        isActive ? 'text-gray-900 dark:text-gray-100' : ''
      }`}
      aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}
      <SortIcon active={isActive} direction={direction} />
    </button>
  );
}

interface ISortIconProps {
  active: boolean;
  direction?: 'asc' | 'desc';
}

function SortIcon({ active, direction }: ISortIconProps) {
  if (!active) {
    return (
      <svg
        className="h-3.5 w-3.5 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }

  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'asc' ? <path d="M5 15l7-7 7 7" /> : <path d="M19 9l-7 7-7-7" />}
    </svg>
  );
}
