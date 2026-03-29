import type { SortDirection, SortField } from '../types';

interface ISortableHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}

/**
 * A table header cell that supports click-to-sort with directional indicator.
 */
export function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
  className = '',
}: ISortableHeaderProps) {
  const isActive = currentField === field;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSort(field);
    }
  };

  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center gap-1 rounded transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-gray-100 ${
          isActive ? 'text-gray-900 dark:text-gray-100' : ''
        }`}
        aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        {label}
        <SortIcon active={isActive} direction={direction} />
      </button>
    </th>
  );
}

interface ISortIconProps {
  active: boolean;
  direction: SortDirection;
}

function SortIcon({ active, direction }: ISortIconProps) {
  if (!active) {
    return (
      <svg
        className="h-3.5 w-3.5 text-gray-300"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
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
