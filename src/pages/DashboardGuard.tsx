import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/page-loader";
import Dashboard from "./Dashboard";

export default function DashboardGuard() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader variant="circular" />;
  if (!user) return <Navigate to="/auth" replace />;

  return <Dashboard />;
}
