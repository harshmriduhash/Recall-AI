import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/page-loader";
import Dashboard from "./Dashboard";
import { useAuth as useClerkAuth } from "@clerk/react";

export default function DashboardGuard() {
  const { user, loading: authLoading } = useAuth();
  const { sessionId, isLoaded: clerkLoaded } = useClerkAuth();
  const location = useLocation();

  const isHandshaking = location.search.includes("__clerk_") || location.search.includes("__clerk_handshake");
  
  // 1. Wait for Clerk to load its basic state
  if (!clerkLoaded) {
    return <PageLoader variant="circular" />;
  }

  // 2. If Clerk is currently doing a handshake, stay on the loader
  if (isHandshaking) {
    return <PageLoader variant="circular" />;
  }

  // 3. Performance Optimization: If we have a sessionId, we are authenticated. 
  // RENDER the Dashboard immediately. Don't wait for 'user' profile to be 100% loaded.
  // The Dashboard itself handles loading states for its specific data.
  if (sessionId) {
    return <Dashboard />;
  }

  // 4. If we are NOT loading, have no handshake, and NO sessionId, redirect to auth.
  if (!authLoading && !sessionId) {
    return <Navigate to="/auth" replace />;
  }

  // Fallback loader
  return <PageLoader variant="circular" />;
}
