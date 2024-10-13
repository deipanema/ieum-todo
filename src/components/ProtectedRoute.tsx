"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { checkAuth } from "@/utils/authUtils";
import { useAuthStore } from "@/store/authStore";

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
