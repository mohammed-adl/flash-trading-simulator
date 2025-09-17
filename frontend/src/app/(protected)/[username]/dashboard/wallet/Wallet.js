import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import TransactionsModal from "./TransactionsModal";
import StatCard from "./StatCard";
import Tooltips from "./ToolTips";

import { useUser, useStock } from "@/contexts";
import { formatCurrency, calcPortfolioValue } from "@/utils";
import { handleGetPortfolio } from "@/fetchers";

export default function Wallet() {
  const { user } = useUser();
  const { stocksPrices } = useStock();
  const [modalType, setModalType] = useState(null);
  const [showLoading, setShowLoading] = useState(true);

  const { balance } = user;
  const portfolioValue = calcPortfolioValue(balance, stocksPrices);

  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      try {
        return await handleGetPortfolio();
      } catch (err) {
        throw err;
      }
    },
    retry: 1,
  });

  useEffect(() => {
    let timeout;
    if (!isLoading) {
      timeout = setTimeout(() => setShowLoading(false), 1000);
    } else {
      setShowLoading(true);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const stats = data?.stats || {};

  return (
    <div className="relative bg-card rounded-xl p-4 mb-4 lg:mb-18 border border-border flex flex-col h-[600px] md:h-[600px] lg:h-auto">
      <div>
        <h2 className="text-lg font-semibold max-lg:text-base max-md:text-sm flex items-center gap-1">
          Wallet
        </h2>

        <div className="flex items-center gap-2 mt-2">
          <p className="text-2xl sm:text-3xl font-bold max-md:text-xl">
            {formatCurrency(portfolioValue)}
          </p>
          <Tooltips content="Total portfolio value including positions and available balance" />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs md:text-sm text-primary">
            {formatCurrency(balance)}
          </span>
          <Tooltips content="Available balance for trading" size="w-56" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 flex-1">
        <StatCard
          label="Total Deposits"
          value={
            stats.totalDeposits ? formatCurrency(stats.totalDeposits) : "$0"
          }
          loading={showLoading || error}
        />
        <StatCard
          label="Total Withdrawals"
          value={
            stats.totalWithdrawals
              ? formatCurrency(stats.totalWithdrawals)
              : "$0"
          }
          loading={showLoading || error}
        />
        <StatCard
          label="Shares Sold"
          value={stats.totalSharesTraded || "0"}
          loading={showLoading || error}
        />
        <StatCard
          label="Biggest Win"
          value={stats.largestWin ? formatCurrency(stats.largestWin) : "$0"}
          loading={showLoading || error}
        />
      </div>

      <div className="mb-4 mt-5 flex gap-3 mb-6">
        <button
          onClick={() => setModalType("deposit")}
          className="flex-1 bg-up hover:bg-green-600 text-white py-2 rounded-lg cursor-pointer transition"
        >
          Deposit
        </button>
        <button
          onClick={() => setModalType("withdraw")}
          className="flex-1 bg-down hover:bg-red-600 text-white py-2 rounded-lg cursor-pointer transition"
        >
          Withdraw
        </button>
      </div>

      <TransactionsModal
        type={modalType}
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
