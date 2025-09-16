"use client";

import { Brand } from "@/components/ui";
import { handleResetPassword } from "@/fetchers";

export default function ResetPasswordForm({
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
      await handleResetPassword({
        email: formData.email,
        passcode: formData.passcode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
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
          Enter your new password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
          }
          disabled={loading}
          className="bg-transparent border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none h-10 px-3"
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          disabled={loading}
          className="bg-transparent border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none h-10 px-3"
          autoComplete="new-password"
        />

        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-secondary cursor-pointer h-10 hover:bg-ring text-md text-background rounded-lg"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {error && (
          <p className="text-sm text-error text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
