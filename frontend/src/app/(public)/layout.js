"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/contexts";
import { LoadingScreen } from "@/components/ui";

function PublicRoute({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.username) {
      router.replace(`/${user.username}`);
    }
  }, [user, router]);

  if (user) return <LoadingScreen />;

  return <>{children}</>;
}

export default PublicRoute;
