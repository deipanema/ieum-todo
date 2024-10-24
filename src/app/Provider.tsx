"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ToastProvider from "@/components/ToastProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SpeedInsights />
      <ToastProvider />
      {children}
    </QueryClientProvider>
  );
}
