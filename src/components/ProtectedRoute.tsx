"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/AuthStore";
import { checkAuth } from "@/utils/authUtils";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        const authCheck = await checkAuth();
        if (!authCheck) {
          router.push("/login");
        }
      }
    };

    verifyAuth();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
