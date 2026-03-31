import type { ISortState } from './types';
import { SortIcon } from './SortIcon';

interface ISortButtonProps {
  label: string;
  columnKey: string;
  sortState?: ISortState<string>;
  onSort: (key: string) => void;
}

export function SortButton({ label, columnKey, sortState, onSort }: ISortButtonProps) {
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
    >
      {label}
      <SortIcon active={isActive} direction={direction} />
    </button>
  );
}
