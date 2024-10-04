import ProtectedRoute from "@/components/ProtectedRoute";

import Sidebar from "./components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="lg:flex">
        <Sidebar />
        <main className="flex-1 bg-slate-100">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
