import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="lg:flex">
        <Sidebar />
      </div>
    </ProtectedRoute>
  );
}
