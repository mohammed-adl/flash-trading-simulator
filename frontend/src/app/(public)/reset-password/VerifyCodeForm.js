"use client";

import { Brand } from "@/components/ui";
import { handleVerifyPasscode } from "@/fetchers/auth";

export default function VerifyCodeForm({
  formData,
  setFormData,
  loading,
  setLoading,
  error,
  setError,
  onSuccess,
}) {
  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      // Send both email and passcode
      await handleVerifyPasscode({
        email: formData.email,
        passcode: formData.passcode,
      });
      onSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 bg-background text-foreground">
      <Brand />
      <div className="w-full max-w-xs flex flex-col space-y-4 mt-10">
        <h1 className="text-2xl font-bold text-center mb-4">
          We sent you a code
        </h1>

        <p className="text-center text-sm text-muted-foreground mb-2">
          Check your email to get your confirmation code. If you need to request
          a new code, go back and reselect a confirmation.
        </p>

        <input
          type="number"
          placeholder="Enter your code"
          name="passcode"
          value={formData.passcode}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, passcode: e.target.value }))
          }
          disabled={loading}
          className="bg-transparent border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none h-10 px-3"
        />

        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-secondary cursor-pointer h-10 hover:bg-ring text-md text-background rounded-lg"
        >
          {loading ? "Verifying..." : "Next"}
        </button>

        {error && (
          <p className="text-sm text-error text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
