"use client";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/utils";

export default function TradeSuccess({
  totalSharesTraded,
  newTotalHolding,
  totalCost,
  newBalance,
  tradeType,
  price,
  onClose,
}) {
  const isBuy = tradeType === "buy";

  return (
    <div className="flex flex-col items-center text-center py-6">
      <CheckCircle2
        size={64}
        className={`mb-4 ${isBuy ? "text-up" : "text-down"}`}
      />
      <h2
        className={`text-xl font-bold mb-2 ${isBuy ? "text-up" : "text-down"}`}
      >
        {isBuy
          ? `Successfully Bought ${totalSharesTraded} Shares`
          : `Successfully Sold ${totalSharesTraded} Shares`}
      </h2>

      <div className="text-sm mb-4 space-y-1">
        <p className="text-foreground">
          Total shares:{" "}
          <span className="font-semibold text-muted">{newTotalHolding}</span>
        </p>
        <p className="text-foreground">
          Price per share:{" "}
          <span className="font-semibold text-muted">
            {formatCurrency(price)}
          </span>
        </p>
        <p className="text-foreground">
          Total {isBuy ? "Cost" : "Proceeds"}:{" "}
          <span className="font-semibold text-muted">
            {formatCurrency(totalCost)}
          </span>
        </p>
        <p className="text-foreground">
          New Balance:{" "}
          <span className="font-semibold text-muted">
            {formatCurrency(newBalance)}
          </span>
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-lg font-medium cursor-pointer"
      >
        Close
      </button>
    </div>
  );
}
