"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuthStore } from "@/store/AuthStore";
import { checkAuth } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        const authCheck = await checkAuth();
        if (authCheck) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    };

    verifyAuth();
  }, [isAuthenticated, router]);

  return <LoadingSpinner />;
}
