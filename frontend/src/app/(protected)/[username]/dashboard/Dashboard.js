"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Wallet from "./wallet/Wallet";
import StockView from "./stockView/StockView";
import WatchList from "./watchList/WatchList";
import {
  Bell,
  CircleUserRound,
  Settings,
  LogOut,
  ChartNoAxesColumnIncreasing,
  DollarSign,
  BriefcaseBusiness,
  Wallet as WalletIcon,
} from "lucide-react";

import { useUser } from "@/contexts";
import { authService } from "@/services";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setShowUserMenu(!showUserMenu);

  const scrollToWallet = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToStock = () => {
    const main = document.querySelector("main");
    if (!main) return;
    const stock = main.children[1];
    if (stock) {
      const offset = 80;
      const y = stock.offsetTop - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToWatchlist = () => {
    const main = document.querySelector("main");
    if (!main) return;
    const watchlist = main.children[2];
    if (watchlist) {
      const offset = 80;
      const y = watchlist.offsetTop - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="h-screen flex max-lg:h-auto">
      <aside className="hidden max-lg:flex flex-col items-center gap-6 p-3 pt-4 border-r bg-background fixed top-14 bottom-0 z-50">
        <div
          onClick={toggleMenu}
          className={`cursor-pointer rounded-full transition-colors duration-200 ${
            showUserMenu ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          <CircleUserRound className="w-7 h-7 text-white" />
        </div>

        {!showUserMenu && (
          <>
            {isMobile && (
              <>
                <WalletIcon
                  className="w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={scrollToWallet}
                />
                <ChartNoAxesColumnIncreasing
                  className="w-9 h-9 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={scrollToStock}
                />
                <DollarSign
                  className="w-9 h-9 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={scrollToWatchlist}
                />
              </>
            )}
            <Bell
              className="w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => router.push(`/${user?.username}/notifications`)}
            />
          </>
        )}

        {showUserMenu && (
          <div className="flex flex-col gap-2 animate-slide-down ">
            <BriefcaseBusiness
              className="w-8 h-8 cursor-pointer mb-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => router.push(`/${user?.username}/portfolio`)}
            />
            <Settings
              className="w-8 h-8 cursor-pointer mb-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => router.push(`/${user?.username}/settings`)}
            />
            <LogOut
              className="w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
              onClick={() => authService.logout()}
            />
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-hidden lg:overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 pt-20 pl-20 lg:pt-6 lg:pl-6 bg-background">
        <Wallet />
        <StockView />
        <WatchList />
      </main>
    </div>
  );
}
