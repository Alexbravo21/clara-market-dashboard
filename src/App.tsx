import { useState } from 'react';
import { AssetDrawer, MarketTable } from './modules';

function App() {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Clara Market Dashboard
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live crypto market data · Updates every 60s
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Market Overview</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Top 20 cryptocurrencies by market cap. Click any row for details.
          </p>
        </div>
        <MarketTable onSelectCoin={setSelectedCoinId} />
      </main>

      <AssetDrawer selectedCoinId={selectedCoinId} onClose={() => setSelectedCoinId(null)} />
    </div>
  );
}

export default App;
