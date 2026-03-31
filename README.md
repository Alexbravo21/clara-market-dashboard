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
```

## API

Data is sourced from the [CoinGecko API](https://www.coingecko.com/en/api) (free tier). The free tier allows ~10–30 requests per minute. If you encounter rate limit errors, wait a moment and use the retry button.

## License

MIT
