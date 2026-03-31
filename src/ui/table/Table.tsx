import type { IColumn, ISortState } from './types';
import { SortButton } from './SortButton';

interface ITableProps<T> {
  data: T[];
  columns: IColumn<T>[];
  rowKey: (row: T) => string;
  sortState?: ISortState<string>;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  onRowHover?: (row: T) => void;
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
  onRowHover,
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
              {columns.map((column) => {
                const isSortActive = column.sortable && sortState?.field === column.key;
                const ariaSort = column.sortable
                  ? isSortActive
                    ? sortState?.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                  : undefined;

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSort}
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
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                tabIndex={onRowClick ? 0 : undefined}
                className={
                  onRowClick
                    ? 'cursor-pointer transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:hover:bg-gray-800'
                    : undefined
                }
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onMouseEnter={onRowHover ? () => onRowHover(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                aria-label={ariaRowLabel ? ariaRowLabel(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 ${column.cellClassName ?? ''}`}>
                    {column.render
                      ? column.render(row)
                      : String((row as Record<string, unknown>)[column.key] ?? '')}
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
