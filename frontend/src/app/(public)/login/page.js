"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUser } from "@/contexts";
import { handleLogIn } from "@/fetchers";
import { Brand, Button, Input } from "@/components/ui";
import { loginBodySchema } from "@/schemas";
import { authService } from "@/services";

export default function Login() {
  const { setUser } = useUser();
  const router = useRouter();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function login(values) {
    setServerError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const body = await handleLogIn(values);
      console.log("body", body);
      authService.setTokens(body.token, body.refreshToken);
      setUser(body.user);

      router.push(`/${body.user.username}`);
    } catch (err) {
      setServerError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground px-4 sm:px-6">
      <div className="w-full mt-6 flex justify-between items-center px-4">
        <Brand className="ml-0 sm:ml-50" />
        <Button
          className="h-10 px-3  mr-0 sm:mr-50 text-lg font-semibold bg-background border border-border text-bg transition-colors hover:bg-border cursor-pointer rounded-lg text-sm"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </Button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-start pt-60">
        <form
          onSubmit={handleSubmit(login)}
          className="w-full max-w-xs flex flex-col space-y-4"
          noValidate
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            Login to Flash
          </h1>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Email"
                type="email"
                {...field}
                className="bg-transparent border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none h-10 px-3"
                autoComplete="email"
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-error">{errors.email.message}</p>
          )}

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Password"
                type="password"
                {...field}
                className="bg-transparent border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none h-10 px-3"
                autoComplete="current-password"
              />
            )}
          />
          {errors.password && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isSendingReset}
            className="bg-secondary cursor-pointer h-10 hover:bg-ring text-md text-background"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>

          <button
            type="button"
            onClick={() => router.push("/reset-password")}
            className="text-sm text-primary underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </form>

        {serverError && (
          <p className="text-sm sm:text-base text-error mb-2 text-center mt-3">
            {serverError}
          </p>
        )}

        {successMessage && (
          <p className="text-sm sm:text-base text-green-300 mb-2 text-center mt-3">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
}
