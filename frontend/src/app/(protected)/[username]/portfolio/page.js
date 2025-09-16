"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PortfolioSection from "./portfolioSection/PortfolioSection";
import TradesSection from "./tradingSection/TradesSection";

import { useUser } from "@/contexts";
import { Logo } from "@/components/ui";

export default function Portfolio() {
  const router = useRouter();
  const { user } = useUser();
  const [section, setSection] = useState("portfolio");

  return (
    <div className="h-full pb-16 bg-background text-foreground">
      <header className="border-b border-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto cursor-pointer">
          <Logo onClick={() => router.push(`/${user.username}`)} />
          <nav className="flex gap-6">
            <a
              className={`font-medium transition-colors ${
                section === "portfolio"
                  ? "text-secondary"
                  : "text-foreground hover:text-secondary"
              }`}
              onClick={() => setSection("portfolio")}
            >
              Portfolio
            </a>
            <a
              className={`font-medium transition-colors ${
                section === "trades"
                  ? "text-secondary"
                  : "text-foreground hover:text-secondary"
              }`}
              onClick={() => setSection("trades")}
            >
              Trades
            </a>
          </nav>
        </div>
      </header>

      {section === "portfolio" && <PortfolioSection />}
      {section === "trades" && <TradesSection />}
    </div>
  );
}
