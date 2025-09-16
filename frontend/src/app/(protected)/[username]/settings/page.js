"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useUser, useStock, usePortfolio } from "@/contexts";
import { ConfirmModal, Logo } from "@/components/ui";
import { handleResetProfile, handleUpdatePassword } from "@/fetchers";

export default function SettingsPage() {
  const router = useRouter();
  const { username } = useParams();
  const { setUser, user } = useUser();
  const { setSelectedSymbol } = useStock();
  const { watchlistDisplay, setWatchlistDisplay } = usePortfolio();

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { email } = user;

  async function resetProfile() {
    try {
      setIsLoading(true);
      const body = await handleResetProfile();
      setUser(body.user);
      setSelectedSymbol(null);
      router.push(`/${username}`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError("");
    setSuccessMessage("");
    const passwordRegex = /^(?=.*[A-Z]).+$/;

    if (!passwordRegex.test(newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await handleUpdatePassword({ email, newPassword });
      setSuccessMessage("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center gap-2 border-b px-6 py-5">
        <Logo
          className="w-8 h-8 cursor-pointer"
          onClick={() => router.push(`/${username}`)}
        />
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your account and simulator preferences.
          </p>
        </div>
      </header>

      <main className="flex-1 px-10 py-8">
        <div className="max-w-3xl space-y-16">
          <section>
            <h2 className="text-base font-medium mb-5">Preferences</h2>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
                <label className="text-[0.95rem] font-medium text-primary">
                  Watchlist
                </label>
                <div className="flex flex-wrap gap-2 justify-start sm:flex-nowrap sm:justify-end">
                  {["recentTrades", "topMovers"].map((mode) => (
                    <button
                      key={mode}
                      className={`rounded-md border text-[0.85rem] sm:text-[0.8rem] font-medium px-2 py-1 sm:px-3 sm:py-1.5 cursor-pointer transition-colors ${
                        watchlistDisplay === mode
                          ? "bg-secondary text-background"
                          : "bg-card text-foreground border-border hover:bg-border hover:opacity-90"
                      }`}
                      onClick={() => setWatchlistDisplay(mode)}
                    >
                      {mode === "recentTrades" ? "Recent Trades" : "Top Movers"}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted mt-1">
                Choose how your watchlist is displayed in the simulator.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-medium mb-5">Security</h2>
            <div className="space-y-6">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.95rem] font-medium text-primary">
                      Password
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Update your account password
                    </p>
                  </div>
                  <button
                    className="text-[0.9rem] sm:text-[0.88rem] px-3 sm:px-3 py-1.5 sm:py-1.5 rounded-md border text-foreground cursor-pointer hover:opacity-90 transition-all"
                    onClick={() => {
                      setShowChangePassword((prev) => !prev);
                      setPasswordError("");
                      setSuccessMessage("");
                    }}
                  >
                    {showChangePassword ? "Cancel" : "Change"}
                  </button>
                </div>

                {showChangePassword && (
                  <div className="flex flex-col space-y-3 mt-2 w-80">
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-md border border-border bg-card text-foreground px-3 py-2 text-[0.95rem] w-full"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-md border border-border bg-card text-foreground px-3 py-2 text-[0.95rem] w-full"
                    />
                    {passwordError && (
                      <p className="text-error text-[0.95rem]">
                        {passwordError}
                      </p>
                    )}
                    {successMessage && (
                      <p className="text-up text-[0.95rem]">{successMessage}</p>
                    )}
                    <button
                      className="self-start px-4 py-2 rounded-md bg-secondary text-background text-[0.95rem] font-medium hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
                      onClick={handleChangePassword}
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-medium mb-5 text-down">
              Danger Zone
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 sm:gap-0">
                <div>
                  <p className="mb-1 text-[0.95rem] font-medium text-primary">
                    Reset Balance
                  </p>
                  <p className="text-xs text-muted">
                    Clear your portfolio and start over
                  </p>
                </div>
                <button
                  className="text-[0.9rem] sm:text-[0.88rem] px-3 sm:px-3 py-1.5 sm:py-1.5 rounded-md border border-down text-down hover:bg-border hover:opacity-90 transition-all cursor-pointer"
                  onClick={() => setShowConfirm(true)}
                  disabled={isLoading}
                >
                  Reset
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showConfirm && (
        <ConfirmModal
          title="Reset Balance"
          description="This will clear your entire portfolio. Are you sure you want to continue?"
          confirmText="Yes, Reset"
          cancelText="Cancel"
          loadingText="Resetting..."
          onConfirm={resetProfile}
          onCancel={() => setShowConfirm(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
