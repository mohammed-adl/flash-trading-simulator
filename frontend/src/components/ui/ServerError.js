"use client";
import { XCircle } from "lucide-react";

export default function ServerError({ onRetry, loading, type }) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <XCircle size={64} className="mb-4 text-down" />
      <h2 className="text-xl font-bold mb-2 text-down">Something went wrong</h2>
      <p className="text-muted mb-4">
        Please try again. The {type} could not be processed.
      </p>
      <button
        onClick={onRetry}
        className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-lg font-medium cursor-pointer"
        disabled={loading}
      >
        Try Again
      </button>
    </div>
  );
}
