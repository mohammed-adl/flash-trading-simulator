"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Eye, EyeOff } from "lucide-react";

import { Brand, Button, Input, Logo } from "@/components/ui";

import { authService } from "@/services";
import { useUser } from "@/contexts";
import { handleSignUp } from "@/fetchers";
import { signupBodySchema } from "@/schemas";

export default function Signup() {
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupBodySchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function signup(values) {
    setServerError(null);

    try {
      const body = await handleSignUp(values);
      authService.setToken(body.token);
      setUser(body.user);

      router.push(`/${body.user.username}`);
    } catch (err) {
      setServerError(err?.message || "Something went wrong.");
    }
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full mt-6 flex justify-between">
        <Brand className="ml-50" />
        <Button
          className="h-10 px-3 text-base font-semibold bg-black border border-border text-bg mr-50 transition-colors hover:bg-border text-sm"
          onClick={() => {
            router.push("/login");
          }}
        >
          Log In
        </Button>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-start bg-background text-foreground px-4 sm:px-6 pt-20 sm:pt-22">
        <div className="w-full max-w-md p-9 sm:p-12 rounded-2xl  shadow-md">
          <div className="flex flex-col items-center space-y-1.5 mb-5 sm:mb-6 text-center">
            <Logo className="h-8 w-8 sm:h-9 sm:w-9 text-secondary" />
            <h1 className="text-xl sm:text-2xl font-bold">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-primary">
              Join us in less than a minute
            </p>
          </div>

          {serverError && (
            <p className="text-[13px]  sm:text-sm text-error mb-2 text-center -mt-2">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit(signup)} className="space-y-2">
            <div>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Username"
                    {...field}
                    className="h-10 text-base bg-card border-border focus:border-secondary"
                  />
                )}
              />
              <div className="h-5 mt-1">
                {errors.username?.message && (
                  <p className="text-[13px] sm:text-xs text-[#ff5c5c]/90">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    className="h-10 text-base bg-card border-border focus:border-secondary"
                  />
                )}
              />
              <div className="h-5 mt-1">
                {errors.email?.message && (
                  <p className="text-[11px] sm:text-[13px] text-[#ff5c5c]/90">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="h-10 text-base bg-card border-border focus:border-secondary pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center text-muted-foreground hover:text-secondary cursor-pointer"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="h-5 mt-1">
                {errors.password?.message && (
                  <p className="text-[13px] sm:text-xs text-[#ff5c5c]/90">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="h-10 text-base bg-card border-border focus:border-secondary pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 inset-y-0 flex items-center text-muted-foreground hover:text-secondary cursor-pointer"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <div className="h-5 mt-1">
                {errors.confirmPassword?.message && (
                  <p className="text-[13px] sm:text-xs text-[#ff5c5c]/90">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 text-base bg-secondary text-background hover:bg-ring cursor-pointer"
            >
              <Mail className="mr-2 h-4 w-4" />
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-[13px] sm:text-sm text-center mt-4 sm:mt-6 text-primary">
            Already have an account?
            <Link href="/login" className="text-secondary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
