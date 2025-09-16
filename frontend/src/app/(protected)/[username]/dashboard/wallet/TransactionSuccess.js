"use client";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/utils";

export default function TransactionSuccess({
  isDeposit,
  amount,
  portfolioValue,
  onClose,
}) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <CheckCircle2
        size={64}
        className={`mb-4 ${isDeposit ? "text-up" : "text-down"}`}
      />
      <h2 className="text-xl font-bold mb-2">
        {isDeposit
          ? `Successfully Deposited $${amount.toLocaleString()}`
          : `Successfully Withdrew $${amount.toLocaleString()}`}
      </h2>
      <p className="text-muted mb-4">
        Your new balance is:{" "}
        <span className="font-semibold text-foreground">
          {formatCurrency(portfolioValue)}
        </span>
      </p>
      <button
        onClick={onClose}
        className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-lg font-medium cursor-pointer"
      >
        Close
      </button>
    </div>
  );
}
