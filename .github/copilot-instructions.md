# Project Requirements

## Overview

Build a responsive Crypto Market Dashboard that displays real-time market data and allows basic exploration of individual assets.

## Pages

- Market Overview Table: A sortable and searchable table displaying the top 20 cryptocurrencies by market cap, with real-time data updates every 60 seconds.
- Asset Detail Modal: A side drawer that opens when a user clicks on a cryptocurrency in the table, showing detailed information and a price history chart for the last 7 days.

## Features

### Market Overview Table

Fetch and display the top 20 cryptocurrencies by market cap using:

GET <https://api.coingecko.com/api/v3/coins/markets>
?vs_currency=usd
&order=market_cap_desc
&per_page=20
&page=1
&sparkline=true

- Display the following information for each cryptocurrency:
  Rank market_cap_rank
  Name + Icon name • image
  Current Price Formatted as USD
  24h Change % Color-coded: green if positive, red if negative
  Market Cap Human-readable (e.g. $1.2T, $340B)
  7-day Sparkline Small inline chart using the sparkline_in_7d.price array

- The table must be sortable by any column (client-side).
- A search/filter input must filter rows by name or symbol in real time.
- Data must auto-refresh every 60 seconds without a full page reload.

### Asset Detail Modal

- When the user clicks a row, show a detail panel (side drawer) with:
  GET <https://api.coingecko.com/api/v3/coins/{id}>
  ?localization=false&tickers=false&community_data=false&developer_data=false
- Display the following details:
  - Name, logo, current price, all-time high + date, all-time low + date.
  - Description (first 300 chars with a "read more" toggle)
  - A price history chart for the last 7 days using:
    GET <https://api.coingecko.com/api/v3/coins/{id}/market_chart>
    ?vs_currency=usd&days=7
- Use the Recharts library to render the price history chart.

## Error and Loading States

- Show a skeleton loader while data is fetching.
- Handle API rate limit errors gracefully (CoinGecko free tier is ~10–30 req/min) — show a user-friendly message and a retry button.
- Handle empty search results with an empty state message.

# Project Coding Guidelines

## File Structure

- Base your file structure in Atomic Design principles.
- Use clear and descriptive names for files and folders.
- Keep the file structure shallow to avoid deep nesting and improve maintainability.
- Separate concerns by organizing files based on their functionality and purpose (e.g., separate folders for components, hooks, utilities, and styles).
- Use index files to re-export components and utilities for easier imports and better organization.

## Tech Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS
- State Management: Tanstack React Query and Context API
- Testing: Jest and React Testing Library
- Storybook for component testing and documentation
- Use ESLint and Prettier for code linting and formatting to maintain code quality and consistency across the project.

## Coding Standards

- Use functional components and hooks over class components.
- Follow the DRY (Don't Repeat Yourself) principle to avoid code duplication.
- Follow Airbnb JavaScript Style Guide for consistent code formatting.
- Favor composition over inheritance in React components.
- Separate concerns by keeping components focused on a single responsibility.
- Use hooks for state management and side effects in functional components.
- Use react-query for data fetching and caching to improve performance and user experience.
- Keep global state minimal. Use URL params or local state where appropriate.
- Manage server state with react-query and client state with Context API for better state management.
- Use Tailwind CSS for styling to maintain a consistent design and reduce the need for custom CSS.
- Use meaningful variable and function names that clearly indicate their purpose.
- Avoid deeply nested code and prefer early returns to reduce complexity.
- Use async/await for asynchronous code and handle errors gracefully.
- Write unit tests for critical components and functions to ensure reliability and maintainability.
- Use TypeScript for type safety and better code quality.
- Prefer `const` over `let` and avoid `var`.
- Use PascalCase for component filenames.
- Ensure that primitive components are reusable and do not contain business logic. (Atoms and Molecules)
- Ensure that container components (Organisms) handle business logic and state management, while keeping the presentation logic separate.
- Table must be keyboard-navigable. Contrast must pass WCAG AA standards.

## Testing

- Write unit tests for critical components and functions to ensure reliability and maintainability.
- Use Jest and React Testing Library for testing.
- Test primitive components (Atoms and Molecules) with Storybook to ensure they are reusable and function as expected in isolation.
- Prioritize testing of components that contain business logic and critical functionality.
- Do integration testing for components that interact with external APIs or have complex interactions with other components.
- Use mock data and mock functions to isolate components during testing.

## Naming Conventions

- Variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Interfaces: Prefix with 'I' (e.g., IUserData)
- Functions: camelCase
- Components: PascalCase
- Files: Use descriptive names that reflect their content (e.g., `UserProfile.tsx`)
- Folders: Use plural names for folders containing multiple items (e.g., `components`, `hooks`).
- Use clear and descriptive names for variables, functions, and components to enhance readability and maintainability.
- Avoid abbreviations and acronyms unless they are widely recognized and improve clarity.
- Avoid using generic names like `data`, `info`, or `temp` that do not convey the purpose of the variable or function.

## Documentation

- Always include JSDoc comments for exported functions.
- Avoid non-critial comments in the codebase (Most critical ones are JSDoc). If you find yourself writing a comment to explain what a piece of code does, consider refactoring the code to be more self-explanatory instead.
- Update documentation when code changes.
- Create a README.md file at the root of the project that provides an overview of the project, setup instructions, and any other relevant information for developers and users.
