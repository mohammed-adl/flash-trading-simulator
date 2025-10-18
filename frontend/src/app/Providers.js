"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  UserProvider,
  AssetProvider,
  PortfolioProvider,
  NotificationProvider,
} from "../contexts/index.js";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NotificationProvider>
          <AssetProvider>
            <PortfolioProvider> {children}</PortfolioProvider>
          </AssetProvider>
        </NotificationProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
