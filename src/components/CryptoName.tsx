interface ICryptoNameProps {
  name: string;
  symbol: string;
  imageUrl: string;
}

/**
 * Displays a cryptocurrency's icon, name, and symbol together.
 */
export function CryptoName({ name, symbol, imageUrl }: ICryptoNameProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={imageUrl}
        alt={`${name} logo`}
        className="h-8 w-8 rounded-full object-contain shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="truncate font-medium text-gray-900 dark:text-gray-100">{name}</p>
        <p className="text-xs uppercase text-gray-500 dark:text-gray-400">{symbol}</p>
      </div>
    </div>
  );
}
