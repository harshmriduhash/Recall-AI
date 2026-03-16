import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/page-loader";
import Dashboard from "./Dashboard";

export default function DashboardGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If we're in a loading state OR if there's a Clerk handshake in the URL,
  // stay on the loader. Redirecting to /auth during a handshake can cause infinite loops.
  const isHandshaking = location.search.includes("__clerk_") || location.search.includes("__clerk_handshake");
  
  if (loading || isHandshaking) {
    return <PageLoader variant="circular" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Dashboard />;
}
