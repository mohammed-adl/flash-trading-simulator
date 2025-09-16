"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUser } from "@/contexts";
import { Brand, Logo, LoadingScreen } from "@/components/ui";

export default function HomePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`/${user.username}`);
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brand />
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-foreground hover:text-secondary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-secondary text-background hover:bg-ring rounded transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Master the Market with{" "}
            <span className="text-secondary">Risk-Free</span> Trading
          </h1>

          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Practice your trading strategies and build confidence without
            risking real money. Start with virtual cash and learn market basics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="px-6 py-3 bg-secondary text-background hover:bg-ring rounded text-lg font-semibold transition-colors"
            >
              Start Trading Now
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-border text-foreground hover:bg-card rounded text-lg font-semibold transition-colors"
            >
              Login to Continue
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-card border border-border rounded">
            <div className="text-up text-2xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3 text-secondary">
              Real Market Data
            </h3>
            <p className="text-muted leading-relaxed">
              Trade with live market data and real-time price movements.
              Experience authentic market conditions safely.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded">
            <div className="text-secondary text-2xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-3 text-secondary">
              Virtual Portfolio
            </h3>
            <p className="text-muted leading-relaxed">
              Start with virtual cash and build your portfolio. Track your
              performance and learn from your trades.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded">
            <div className="text-up text-2xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3 text-secondary">
              Simple Trading
            </h3>
            <p className="text-muted leading-relaxed">
              Easy-to-use interface for buying and selling stocks. Perfect for
              beginners learning the basics.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-12 text-secondary">
            Join Thousands of Traders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-up mb-2">50K+</div>
              <div className="text-muted">Active Traders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">
                $2.5B
              </div>
              <div className="text-muted">Virtual Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-up mb-2">99.9%</div>
              <div className="text-muted">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-muted">Market Access</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Brand />
            </div>
            <div className="text-muted text-sm">
              © 2025 Flash. Practice trading with confidence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
