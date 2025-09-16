"use client";
import TradeSuccess from "./TradeSuccess";
import { ServerError } from "@/components/ui";

export default function MessageModal({
  type,
  isOpen,
  onClose,
  loading,
  ...props
}) {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-foreground cursor-pointer"
        >
          ✕
        </button>

        {isSuccess ? (
          <TradeSuccess {...props} onClose={onClose} type={type} />
        ) : (
          <ServerError type="trade" onRetry={onClose} loading={loading} />
        )}
      </div>
    </div>
  );
}
