# Flash – Trading Simulator

<p align="center">
  <img src="/frontend/public/main.gif" alt="Main Demo GIF" width="850"/>
</p>

A full-stack, real-time trading simulator built with Next.js, Express, Prisma, Tailwind, Redis, and Socket.IO. Flash combines powerful functionality with an intuitive, user-friendly interface, letting users trade stocks, manage portfolios, and track watchlists in real time, while demonstrating scalable architecture and advanced security.

Live Demo: [https://flash-sim.vercel.app](https://flash-sim.vercel.app)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture & Project Structure](#architecture--project-structure)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Screenshots / Demo](#screenshots--demo)
7. [Future Improvements](#future-improvements)

---

## Features

### Real-Time Trading & Portfolio Management

- Simulate buying, selling, depositing, and withdrawing funds with live stock prices.
- Track portfolio performance with interactive graphs, pie charts, and trade analytics.
- Maintain detailed trade history and insights to refine strategies.
- Search for stocks globally or in your personal watchlist, with real-time updates.

### Global Data Fetching & Caching System

- Periodically fetches global stock prices and caches them in memory to minimize API calls.
- Uses symbols from each user’s watchlist to determine which data to serve.
- All users get served from the same global data cache.
- Fetch new missing symbols and add them to the global data cache.
- Sends real-time updates **per user watchlist**, keeping portfolios and watchlists fresh.
- Optimized for syncing, performance and scalable real-time delivery.

### Authentication & Security

- Secure JWT-based authentication with automatic refresh token rotation.
- Password reset/change flows with robust input validation using Zod.
- Protected routes, rate limiting, CORS, and Helmet ensure both security and reliability.

### UX / UI Enhancements

- Responsive interface with splash screens, spinners, and tooltips.
- Real-time notifications for welcome messages, successes, errors, and warnings.
- Manage user preferences, portfolio settings, and session state seamlessly.
- Graceful handling of successes, errors, and warnings across all operations.

### Backend & Scalability

- Optimized database queries and indexing for fast, reliable data access.
- Redis caching for watchlists and trade summaries to reduce load and accelerate responses.
- Axios API wrappers with interceptors for consistent and maintainable backend communication.

### Frontend Architecture

- Modular React architecture with four global contexts for user, portfolio, notifications, and stock data.
- Organized fetchers, services, and utilities ensure maintainable and scalable code.

---

## Architecture & Project Structure

```text
flash/
├─ frontend/
│  ├─ public/         # Static assets like images, fonts
│  ├─ .env            # Environment variables
│  ├─ .gitignore
│  └─ src/
│     ├─ app/         # Main app entry and routing
│     ├─ assets/      # Images, icons, and other static files
│     ├─ components/  # Reusable React components
│     ├─ contexts/    # React context for global state
│     ├─ fetchers/    # API fetcher functions
│     ├─ lib/         # Helper libraries
│     ├─ config/      # Frontend configuration files
│     ├─ schemas/     # Zod schemas
│     ├─ services/    # Frontend business logic
│     ├─ socket/      # Socket.IO client code
│     └─ utils/       # Utility functions

├─ backend/
│  ├─ prisma/         # Prisma schema & migrations
│  ├─ .env
│  ├─ .gitignore
│  ├─ app.js          # Express app setup
│  ├─ server.js       # Entry point for backend server
│  └─ src/
│     ├─ config/      # Backend configuration files
│     ├─ controllers/ # Express route handlers
│     ├─ lib/         # Helper libraries
│     ├─ middlewares/ # Auth, validation, rate limiting, etc.
│     ├─ routes/      # API route definitions
│     ├─ schemas/     # Validation schemas (Zod)
│     ├─ services/    # Business logic helpers
│     ├─ socket/      # Socket.IO server code
│     └─ utils/       # Utility functions

├─ README.md
```

---

## Getting Started

Follow these steps to run **Flash – Trading Simulator** locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (v18+ recommended)
- npm
- PostgreSQL (local or remote)
- Redis

### Clone the repository

```bash
git clone https://github.com/flash-trading-simulator/flash.git
cd flash-trading-simulator
```

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Configure environment variables

**Backend `.env`**

```bash
NODE_ENV=development
PORT=3001
ORIGIN=http://localhost:3000

ACCESS_SECRET=your_jwt_access_secret
REFRESH_SECRET=your_jwt_refresh_secret

DATABASE_URL=postgres://username:password@localhost:5432/flash
REDIS_URL=redis://username:password@host:port
```

**Frontend `.env`**

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Run the application

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000) to access the app.

### Database Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Additional Notes

- Ensure Redis and PostgreSQL are running before starting the backend.
- The frontend supports hot-reloading — changes appear instantly in the browser.
- Passwords are hashed with bcrypt, and authentication is handled via JWT.

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Express.js, Prisma ORM
- **Realtime / Data:** Socket.IO, Yahoo Finance API
- **Caching:** Redis
- **Authentication & Security:** JWT, bcrypt, Zod, Helmet, CORS, Rate Limiting
- **Deployment:** Render (backend), Vercel (frontend)

---

## Usage

1. Sign up or log in with your account — new users start with an initial deposit.
2. Search for any stock symbol (e.g. AAPL, TSLA) and add it to your watchlist.
3. Buy or sell stocks — your portfolio updates in real time.
4. Track your performance with portfolio charts, trade history, and analytics.

---

## Screenshots / Demo

<p align="center">
  <img src="/frontend/public/portfolio.PNG" alt="Portfolio Screenshot" width="750"/>
</p>

---

## Future Improvements

- **Trading Features:** Implement automatic stop-loss and take-profit orders to help users manage risk.
- **Analytics & Stock Insights:** Add more detailed stock analysis with a dedicated page for each owned stock.
- **UI / UX Enhancements:** Introduce light mode support and improve overall responsiveness.
- **Resilience & Reliability:** Handle rare edge cases in critical systems to ensure smooth operation, including fallback strategies for failures.
- **Monitoring & Logging:** Implement comprehensive logging and monitoring for both backend and frontend to track errors and performance.
- **Testing:** Add unit and end-to-end tests to ensure stability and catch edge cases before they reach users.
