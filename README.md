# Clara Market Dashboard

A responsive crypto market dashboard displaying real-time data for the top 20 cryptocurrencies by market cap.

## Features

- **Market Overview Table** — sortable and searchable table of the top 20 coins with live data that auto-refreshes every 60 seconds
- **Asset Detail Drawer** — side panel with detailed coin info, ATH/ATL stats, description, and a 7-day price history chart
- **Skeleton loaders** for all loading states
- **Rate limit handling** with user-friendly messages and retry button
- **Keyboard navigation** — all interactive elements are keyboard-accessible (WCAG AA compliant)
- **Responsive design** — works on mobile and desktop

## Tech Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Framework     | React 19 + TypeScript            |
| Styling       | Tailwind CSS v4                  |
| Build Tool    | Vite                             |
| Data Fetching | TanStack React Query             |
| Charts        | Recharts                         |
| Testing       | Jest + React Testing Library     |
| Linting       | ESLint (Airbnb-style) + Prettier |

## Technical decisions

I structured the project with a focus on keeping things clean and easy to scale. The idea was to separate responsibilities as much as possible, so UI components are mostly presentational, while logic lives in hooks. One key piece is the generic, headless table component, which is driven by a column schema and doesn’t depend on any specific data shape, making it reusable across different contexts. I also introduced a small domain layer to transform the API data into a consistent shape, so the rest of the app doesn’t depend directly on the API response. For data fetching, I used React Query and made things like caching, retries, and data transformation explicit, so the behavior is predictable. Overall, I tried to keep the code modular and reusable, while making sure external data is handled safely and doesn’t leak complexity into the UI.

## AI usage

I used AI to improve the speed of building this app. I started with a copilot-instructions file with the product requirements and coding guidelines. This along with a prompt created the first iteration of the whole project. Creating an functional MVP.
Then I started to manually refactor the code from it works to this is maintainable and scalable. Easy to read and with a file structure that makes it easier to find any concern.

While doing this manual refators I still used AI to do some of that labor and mainly to build unit tests that I specified based on how the project was growing.

As you may know now because of the intructions file name I mainly used copilot because I have a premium account but I also used free ChatGPT as an auditor for what I asked Copilot to build. To not only have my human eyes but also use another Agent to find flaws quicker.

## Getting Started

### Prerequisites

- Node.js 22.22.2+
- npm 10.9.7+

### Installation

```bash
git clone https://github.com/Alexbravo21/clara-market-dashboard.git
cd clara-market-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
npm run preview
```

### Testing

```bash

# Run all tests

npm test

# Run tests with coverage report

npm run test:coverage
```

### Linting & Formatting

```bash

# Lint

npm run lint

# Format source files

npm run format
```

## Project Structure

This project follows **Atomic Design** principles:

```
src/
├── api/                        # CoinGecko API client, query keys, retry/cache config
│   ├── coingecko.ts            # fetch functions + ApiError class
│   ├── queryConfig.ts          # apiRetry + apiRetryDelay helpers
│   ├── queryKeys.ts            # centralized QUERY_KEYS factory
│   └── index.ts
├── domain/                     # Business logic isolated from UI and infrastructure
│   └── coin/                   # Coin-specific domain module
│       ├── types.ts            # ICoin, ICoinDetail, IPriceChartPoint
│       ├── transformer.ts      # Raw API → domain mappers (mapCoin, mapCoinDetail, mapPriceChartPoints)
│       ├── utils.ts            # Domain-scoped formatters (formatCoinPrice, formatMarketCap, formatCoinDate)
│       └── index.ts
│   ├── columns.tsx             # COIN_COLUMNS table column definitions
│   └── index.ts
├── hooks/                      # All custom hooks — data fetching, table behaviour, orchestration
│   ├── useMarketController.ts  # Page-level orchestrator — composes all sub-hooks, owns selected coin state
│   ├── useMarketCoins.ts       # React Query hook for top-20 market list
│   ├── useCoinDetail.ts        # React Query hook for single coin detail
│   ├── useCoinMarketChart.ts   # React Query hook for 7-day price chart
│   ├── usePrefetchCoinDetail.ts# Prefetch callback for hover-triggered cache warming
│   ├── useAssetDrawer.ts       # Composes detail + chart queries into drawer state
│   ├── useDrawerBehavior.ts    # UI-only drawer behaviour (focus trap, keyboard, description toggle)
│   ├── useTable.ts             # Table orchestrator — composes useSorting + useFiltering
│   ├── useSorting.ts           # Column sort state machine
│   ├── useFiltering.ts         # Search filter reducer
│   └── index.ts
├── modules/                    # Feature-level organisms — purely presentational, no hook calls
│   ├── MarketTable.tsx         # Market overview table (receives table + state props)
│   ├── AssetDrawer.tsx         # Asset detail side drawer (receives drawer prop)
│   └── index.ts
├── components/                 # Composed reusable components (molecules)
│   ├── CryptoName.tsx          # Coin icon + name + symbol cell
│   ├── PriceChange.tsx         # 24h change badge with null fallback
│   ├── SearchInput.tsx         # Accessible search field
│   └── index.ts
├── ui/                         # Primitive, stateless UI atoms
│   ├── Badge.tsx               # Color-coded percentage badge
│   ├── Button.tsx              # Multi-variant button (primary / ghost / link) with forwardRef
│   ├── Skeleton.tsx            # Loading placeholder
│   ├── SparklineChart.tsx      # Inline 7-day sparkline
│   ├── table/                  # Headless generic table primitives
│   │   ├── Table.tsx           # Schema-driven, fully headless table
│   │   ├── SortButton.tsx      # Column sort toggle button
│   │   ├── SortIcon.tsx        # Sort direction indicator icon
│   │   ├── types.ts            # IColumn, ISortState
│   │   └── index.ts
│   └── index.ts
├── types/
│   └── index.ts                # Raw CoinGecko API response types (all fields nullable)
├── utils/
│   ├── formatters.ts           # Pure formatting utilities (currency, market cap, date, text)
│   └── index.ts
├── App.tsx
└── main.tsx
```

## API

Data is sourced from the [CoinGecko API](https://www.coingecko.com/en/api) (free tier). The free tier allows ~10–30 requests per minute. If you encounter rate limit errors, wait a moment and use the retry button.

## License

MIT
