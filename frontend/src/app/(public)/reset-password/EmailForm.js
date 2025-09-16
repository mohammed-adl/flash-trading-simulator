"use client";

import { Brand } from "@/components/ui";
import { handleSendPasscode } from "@/fetchers";

export default function EmailForm({
  formData,
  setFormData,
  loading,
  setLoading,
  error,
  setError,
  onSuccess,
}) {
  async function handleSend() {
    setError("");
    setLoading(true);

    try {
      await handleSendPasscode({ email: formData.email });
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="w-full max-w-xs flex flex-col space-y-4 mt-10"
        noValidate
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Enter your email
        </h1>

        <p className="text-center text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={loading}
          className="bg-transparent border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none h-10 px-3"
          autoComplete="email"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-secondary cursor-pointer h-10 hover:bg-ring text-md text-background rounded-lg"
        >
          {loading ? "Sending..." : "Next"}
        </button>

        {error && (
          <p className="text-sm text-error text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}
