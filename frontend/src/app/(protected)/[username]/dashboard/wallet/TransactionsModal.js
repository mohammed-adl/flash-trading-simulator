"use client";
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import { Logo } from "@/components/ui";
import { useUser, useAsset } from "@/contexts";
import { formatCurrency, calcPortfolioValue } from "@/utils";
import { handleDeposit, handleWithdrawal } from "@/fetchers";

import TransactionSuccess from "./TransactionSuccess";
import { ServerError } from "@/components/ui";

export default function WalletModal({ type = "deposit", isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { user, setUser } = useUser();
  const { assetsPrices } = useAsset();
  const portfolioValue = calcPortfolioValue(user?.balance, assetsPrices);
  const [status, setStatus] = useState("form");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const predefined = [10000, 25000, 50000, 100000];

  const transactionHandler = {
    limits: type === "deposit" ? 1_000_000 : portfolioValue,
    fetcher: type === "deposit" ? handleDeposit : handleWithdrawal,

    quickSelect: (val) => {
      const newAmount = amount + val;
      if (newAmount <= transactionHandler.limits) setAmount(newAmount);
    },

    change: (e) => {
      const value = e.target.value.replace(/\D/g, "");
      const numeric = Number(value);
      if (numeric <= transactionHandler.limits) {
        setAmount(numeric);
        setStatus("form");
      } else {
        setStatus("error");
      }
    },

    submit: async () => {
      if (amount > 0) {
        setLoading(true);
        try {
          const result = await transactionHandler.fetcher(amount);
          const newBalance = result.user.balance;

          setUser((prev) => ({
            ...prev,
            balance: newBalance,
          }));
          setStatus("success");
          queryClient.invalidateQueries(["portfolio"]);
        } catch (err) {
          setStatus("error");
        } finally {
          setLoading(false);
        }
      }
    },
  };

  const isDeposit = type === "deposit";
  const handler = transactionHandler;

  const handleClose = () => {
    setAmount(0);
    if (inputRef.current) inputRef.current.value = "";
    setStatus("form");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border p-6 relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted hover:text-foreground cursor-pointer"
          disabled={loading}
        >
          <X size={20} />
        </button>

        {status === "form" && (
          <>
            <div className="flex justify-center mb-4">
              <Logo />
            </div>

            <h2
              className={`text-2xl font-semibold text-center ${
                isDeposit ? "text-up" : "text-down"
              }`}
            >
              {isDeposit ? "Deposit Funds" : "Withdraw Funds"}
            </h2>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {predefined.map((val) => (
                <button
                  key={val}
                  onClick={() => handler.quickSelect(val)}
                  className="bg-[var(--secondary)] hover:bg-yellow-500 text-black rounded-lg py-2 font-medium cursor-pointer transition"
                  disabled={loading}
                >
                  + ${val.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <input
                ref={inputRef}
                type="text"
                value={amount || ""}
                onChange={handler.change}
                placeholder={`Current Balance: ${formatCurrency(
                  portfolioValue
                )}`}
                className="w-full border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary bg-background"
                disabled={loading}
              />
              {isDeposit ? (
                <p className="text-xs text-muted mt-1">
                  Max deposit allowed: $
                  {transactionHandler.limits.toLocaleString()}
                </p>
              ) : (
                <p className="text-xs text-muted mt-1">
                  You can only withdraw what’s available after your open trades.
                </p>
              )}
            </div>

            <button
              onClick={handler.submit}
              disabled={
                loading || amount <= 0 || amount > transactionHandler.limits
              }
              className={`w-full mt-6 py-2 rounded-lg text-white font-medium transition ${
                isDeposit
                  ? "bg-up hover:bg-green-600"
                  : "bg-down hover:bg-red-600"
              } ${
                loading || amount <= 0 || amount > transactionHandler.limits
                  ? "opacity-50 cursor-default"
                  : "cursor-pointer"
              }`}
            >
              {loading
                ? isDeposit
                  ? "Depositing..."
                  : "Withdrawing..."
                : isDeposit
                ? "Confirm Deposit"
                : "Confirm Withdrawal"}
            </button>
          </>
        )}

        {status === "success" && (
          <TransactionSuccess
            isDeposit={isDeposit}
            amount={amount}
            portfolioValue={portfolioValue}
            onClose={handleClose}
          />
        )}

        {status === "error" && (
          <ServerError
            onRetry={() => setStatus("form")}
            loading={loading}
            type={"transaction"}
          />
        )}
      </div>
    </div>
  );
}
