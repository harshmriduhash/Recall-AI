import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/page-loader";
import Dashboard from "./Dashboard";
import { useAuth as useClerkAuth } from "@clerk/react";

export default function DashboardGuard() {
  const { user, loading } = useAuth();
  const { sessionId, isLoaded } = useClerkAuth();
  const location = useLocation();

  const isHandshaking = location.search.includes("__clerk_") || location.search.includes("__clerk_handshake");
  
  // If Clerk hasn't even loaded its basic state yet
  if (!isLoaded) {
    return <PageLoader variant="circular" />;
  }

  // If we are currently in a handshake or the custom useAuth hook is still resolving
  if (loading || isHandshaking) {
    return <PageLoader variant="circular" />;
  }

  // If we have no user and no sessionId, then we are definitely logged out
  if (!user && !sessionId) {
    return <Navigate to="/auth" replace />;
  }

  return <Dashboard />;
}
