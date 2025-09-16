"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "./ui";

export default function SplashWrapper({ children }) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showLoading) return <LoadingScreen />;
  return <>{children}</>;
}
