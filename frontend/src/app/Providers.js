"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  UserProvider,
  StockProvider,
  PortfolioProvider,
  NotificationProvider,
} from "../contexts/index.js";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {children}
        {/* <NotificationProvider> */}
        {/* <StockProvider> */}
        {/* <PortfolioProvider></PortfolioProvider> */}
        {/* </StockProvider>
        </NotificationProvider> */}
      </UserProvider>
    </QueryClientProvider>
  );
}
