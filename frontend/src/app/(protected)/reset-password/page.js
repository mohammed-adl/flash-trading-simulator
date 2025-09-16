"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EmailForm from "./EmailForm";
import VerifyCodeForm from "./VerifyCodeForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPassword() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    passcode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState("enter-email");
  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      {step === "enter-email" && (
        <EmailForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
          handleChange={handleChange}
          onSuccess={() => setStep("verify-code")}
        />
      )}
      {step === "verify-code" && (
        <VerifyCodeForm
          formData={formData}
          loading={loading}
          setLoading={setLoading}
          setFormData={setFormData}
          error={error}
          setError={setError}
          handleChange={handleChange}
          onSuccess={() => setStep("reset-password")}
        />
      )}
      {step === "reset-password" && (
        <ResetPasswordForm
          formData={formData}
          loading={loading}
          setLoading={setLoading}
          setFormData={setFormData}
          error={error}
          setError={setError}
          handleChange={handleChange}
          onSuccess={() => router.replace("/login")}
        />
      )}
    </>
  );
}
