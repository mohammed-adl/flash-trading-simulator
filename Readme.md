# ⚡ Flash – Real-Time Trading Platform

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-D82C20?style=flat&logo=redis)
![BullMQ](https://img.shields.io/badge/BullMQ-DC382D?style=flat&logo=bull&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-28A745?style=flat&logo=socketdotio&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Browser Extension](https://img.shields.io/badge/-Browser%20Extension-4A90E2?style=flat-square&logo=google-chrome&logoColor=white)
![Stripe](https://img.shields.io/badge/-Stripe-626CD9?style=flat-square&logo=stripe&logoColor=white)

> 🚀 **Flash** is a full-stack, real-time trading simulator built for performance, scale, and clean UX.  
> Trade live market data, manage portfolios, and analyze performance with AI-powered insights — all in one seamless platform.

<p align="center">
  <img src="/frontend/public/main.gif" alt="Live Trading Demo" width="850"/>
</p>

**Live Demo:** [https://flash-sim.vercel.app](https://flash-sim.vercel.app)

---

## 🧩 Overview

Flash combines a modern, real-time frontend with a robust, scalable backend.  
It's designed to demonstrate production-ready architecture, advanced caching, and real-time synchronization — all while providing an intuitive trading experience.

**Core Highlights**

- ⚡ Real-time asset trading (stocks, crypto, forex) and portfolio updates
- 💬 AI assistant integrated with your live holdings
- 🧠 Global data caching system (Redis + Yahoo Finance API)
- 🔐 Secure authentication with JWT, Zod, bcrypt
- 📊 Clean, responsive UI with notifications and analytics
- 🧱 Modular architecture built for scalability
- 🐳 Docker support for easy deployment
- 🔧 Browser extension for quick access
- 📱 Background job processing with BullMQ

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture & Project Structure](#architecture--project-structure)
4. [Getting Started](#getting-started)
5. [System Architecture](#system-architecture)
6. [Screenshots / Demo](#screenshots--demo)
7. [Future Improvements](#future-improvements)

---

## Features

### Global Data Fetching & Caching System

- Periodically fetches global asset prices and caches them in memory to minimize API calls by 99%.
- Optimized for syncing, performance and scalable real-time delivery with sub-100ms price update latency.
- Uses symbols from each user's watchlist to determine which data to serve.
- All users get served from the same global data cache.
- Fetch new missing symbols and add them to the global data cache.
- Sends real-time updates **per user watchlist**, keeping portfolios and watchlists fresh.
- **BullMQ workers** handle scheduled price fetching jobs for reliability and scalability.

### Real-Time Trading & Portfolio Management

- Simulate buying, selling, depositing, and withdrawing funds with live prices.
- Track portfolio performance with interactive graphs, pie charts, and trade analytics.
- Maintain detailed trade history and insights to refine strategies.
- Search for assets globally or in your personal watchlist, with real-time updates.

### AI-Powered Trading Assistant

- Integrated OpenAI assistant that analyzes your current portfolio positions.
- Real-time access to your holdings and live market prices.
- Conversational interface for asking questions about your positions.
- Get insights on portfolio performance and individual holdings.

### Authentication & Security

- Secure JWT-based authentication with automatic refresh token rotation and background token refreshing.
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

- Modular React architecture with four global contexts for user, portfolio, notifications, and asset data.
- Organized fetchers, services, and utilities ensure maintainable and scalable code.

### Browser Extension

- Trade directly from your browser without opening the full app.
- Supports real-time buy and sell operations.

### 💳 Subscriptions & Payments (Stripe Integration)

- Seamless payment flow using Stripe for premium access or donation support.
- Secure card collection with **Stripe Elements** and test-mode payments.
- Fully PCI compliant — card data never touches your server.
- Real-time confirmation of payments via `PaymentIntent` API.

---

## Tech Stack

- **Frontend:** Next.js (TypeScript), Tailwind CSS
- **Backend:** Express.js (TypeScript), Prisma ORM
- **AI/ML:** OpenAI GPT-4o-mini
- **Realtime / Data:** Socket.IO, Yahoo Finance API
- **Caching:** Redis
- **Job Queue:** BullMQ
- **Authentication & Security:** JWT, bcrypt, Zod, Helmet, CORS, Rate Limiting
- **Deployment:** Render (backend), Vercel (frontend), Docker
- **Browser Extension:** Manifest V3 (Chrome/Edge)
- **Payments:** Stripe

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
│  ├─ Dockerfile      # Docker configuration for backend
│  ├─ app.js          # Express app setup
│  ├─ server.js       # Entry point for backend server
│  └─ src/
│     ├─ config/      # Backend configuration files
│     ├─ controllers/ # Express route handlers
│     ├─ jobs/        # BullMQ queues, workers, and schedulers
│     │  ├─ queues/   # Job queue definitions
│     │  ├─ workers/  # Background job processors
│     │  └─ schedulers/ # Job scheduling logic
│     ├─ lib/         # Helper libraries
│     ├─ middlewares/ # Auth, validation, rate limiting, etc.
│     ├─ routes/      # API route definitions
│     ├─ schemas/     # Validation schemas (Zod)
│     ├─ services/    # Business logic helpers
│     ├─ socket/      # Socket.IO server code
│     └─ utils/       # Utility functions
├─ extension/         # Browser extension (Manifest V3)
│  ├─ manifest.json   # Extension configuration
│  ├─ popup/          # Extension popup UI
│  ├─ background/     # Background scripts
├─ README.md
```

---

## Getting Started

### With Docker (Recommended)

#### Prerequisites

- Docker
- Docker Compose

#### Steps

1. **Clone the repository**

```bash
git clone https://github.com/flash-trading-simulator/flash.git
cd flash-trading-simulator
```

2. **Configure environment variables**

Create `.env` file in `backend/` directory.

**Backend `.env`**

```bash
NODE_ENV=production
PORT=4000
ORIGIN=http://localhost:3000

ACCESS_SECRET=your_jwt_access_secret
REFRESH_SECRET=your_jwt_refresh_secret

DATABASE_URL=postgresql://flash_user:flash_password@postgres:5432/flash_db
REDIS_URL=rediss://default:your_upstash_password@your-upstash-url.upstash.io:6379

STRIPE_SECRET_KEY=sk_test_yourSecretKey
```

3. **Start all services with Docker Compose**

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database
- Backend API server

4. **Run database migrations**

```bash
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma migrate dev
```

5. **Install and run frontend**

```bash
cd frontend
npm install
npm run dev
```

6. **Access the application**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)

7. **Stop all services**

```bash
docker-compose down
```

---

## System Architecture

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │ HTTP/WebSocket
       ↓
╔═════════════════════════════════════╗
║           Docker Container          ║
║  ┌─────────────┐  ┌──────────────┐  ║
║  │   Express   │─→│  PostgreSQL  │  ║
║  │   Backend   │  │   (Prisma)   │  ║
║  └──────┬──────┘  └──────────────┘  ║
║         │         ┌──────────────┐  ║
║         └────────→│Redis/BullMQ  │  ║
║                   │   (Cache)    │  ║
║                   └──────────────┘  ║
╚═════════╪═══════════════════════════╝
          │
          ├───→ Yahoo Finance API (Prices)
          │
          └───→ OpenAI API (AI Assistant)

┌─────────────────────┐
│ Browser Extension   │
│  (Quick Access)     │
└─────────────────────┘
       │ HTTP
       ↓
  (Connects to Backend)
```

---

## Screenshots / Demo

<p align="center">
  <img src="/frontend/public/portfolio.PNG" alt="Portfolio Screenshot" width="800"/>
</p>

---

## Future Improvements

- **Trading Features:** Implement automatic stop-loss and take-profit orders to help users manage risk.
- **Analytics & Asset Insights:** Add more detailed asset analysis with a dedicated page for each owned asset.
- **UI / UX Enhancements:** Introduce light mode support and improve overall responsiveness.
- **Resilience & Reliability:** Handle rare edge cases in critical systems to ensure smooth operation, including fallback strategies for failures.
- **Monitoring & Logging:** Implement comprehensive logging and monitoring for both backend and frontend to track errors and performance.
- **Testing:** Add unit and end-to-end tests to ensure stability and catch edge cases before they reach users.
- **Advanced AI Features:** Enhance the AI assistant with function calling to execute trades, access historical data, and provide deeper market analysis.

---

## License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.
