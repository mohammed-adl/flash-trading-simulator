"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MessageModal from "./MessageModal";

import { useUser } from "@/contexts";
import { handleBuyAsset, handleSellAsset } from "@/fetchers";

export default function TradePanel({ price, symbol }) {
  const queryClient = useQueryClient();
  const { user, setUser } = useUser();

  const [tradeType, setTradeType] = useState("buy");
  const [shares, setShares] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
  });

  const ownStock = user.holdings.find((s) => s.symbol === symbol);
  const availableBuy = Math.floor(user.balance / price) || 0;
  const availableSell = ownStock?.quantity || 0;

  const hasEnoughBalance = user.balance >= shares * price;
  const hasEnoughShares = ownStock ? ownStock.quantity >= shares : false;

  const trade = async () => {
    if (!shares) return;

    setIsLoading(true);

    try {
      const body =
        tradeType === "buy"
          ? await handleBuyAsset({ symbol, quantity: shares })
          : await handleSellAsset({ symbol, quantity: shares });

      setUser(body.user);

      setModal({
        isOpen: true,
        type: "success",
        price: Number(body.trade.price),
        totalShares:
          body.user.holdings.find((s) => s.symbol === symbol)?.quantity || 0,
        totalCost: Number(body.trade.price) * Number(shares),
        newBalance: Number(body.user.balance),
      });

      setShares(0);
      queryClient.invalidateQueries(["portfolio"]);
    } catch (err) {
      console.log(err);
      setModal({ isOpen: true, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass = (type) =>
    `flex-1 py-2 rounded-lg font-medium transition cursor-pointer ${
      tradeType === type
        ? type === "buy"
          ? "bg-up text-white"
          : "bg-down text-white"
        : "bg-card text-primary border border-border"
    }`;

  const confirmButtonClass = () => {
    const disabled =
      isLoading || (tradeType === "buy" ? !hasEnoughBalance : !hasEnoughShares);

    return `w-full py-2 rounded-lg font-semibold transition ${
      tradeType === "buy" ? "bg-up text-white" : "bg-down text-white"
    } ${
      disabled
        ? "opacity-50 cursor-default"
        : "cursor-pointer " +
          (tradeType === "buy" ? "hover:bg-green-600" : "hover:bg-red-600")
    }`;
  };

  return (
    <div className="mt-auto bg-background border border-border rounded-xl p-4">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setTradeType("buy")}
          className={buttonClass("buy")}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={buttonClass("sell")}
        >
          Sell
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm text-muted mb-2 block">Shares</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={shares || ""}
          onChange={(e) => setShares(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/70"
          placeholder={
            tradeType === "buy"
              ? `Available to buy: ${availableBuy}`
              : `Available to sell: ${availableSell}`
          }
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-between text-sm text-muted mb-2">
        <span>Price</span>
        <span>${price.toFixed(2)}</span>
      </div>

      <button
        onClick={trade}
        disabled={isLoading}
        className={confirmButtonClass()}
      >
        {isLoading
          ? tradeType === "buy"
            ? "Buying..."
            : "Selling..."
          : tradeType === "buy"
          ? "Confirm Buy"
          : "Confirm Sell"}
      </button>

      <MessageModal
        isOpen={modal.isOpen}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
        loading={isLoading}
        price={modal.price}
        totalShares={modal.totalShares}
        totalCost={modal.totalCost}
        newBalance={modal.newBalance}
      />
    </div>
  );
}
