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

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

\`\`\`bash
git clone https://github.com/your-username/clara-market-dashboard.git
cd clara-market-dashboard
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

### Testing

\`\`\`bash

# Run all tests

npm test

# Run tests with coverage report

npm run test:coverage
\`\`\`

### Linting & Formatting

\`\`\`bash

# Lint

npm run lint

# Format source files

npm run format
\`\`\`

## Project Structure

This project follows **Atomic Design** principles:

\`\`\`
src/
├── ui/ # Primitive, reusable UI components (Badge, Button, Skeleton, SparklineChart)
├── components/ # Composed components (CryptoName, PriceChange, SearchInput, SortableHeader)
├── modules/ # Feature-level components with business logic (MarketTable, AssetDrawer)
├── context/ # React Context for global client state (SelectedCoinContext)
├── hooks/ # Custom React Query hooks (useMarketCoins, useCoinDetail, useCoinMarketChart)
├── api/ # API client functions for CoinGecko
├── types/ # Shared TypeScript interfaces and types
├── utils/ # Pure utility functions (formatters)
├── App.tsx
└── main.tsx
\`\`\`

## API

Data is sourced from the [CoinGecko API](https://www.coingecko.com/en/api) (free tier). The free tier allows ~10–30 requests per minute. If you encounter rate limit errors, wait a moment and use the retry button.

## License

MIT
