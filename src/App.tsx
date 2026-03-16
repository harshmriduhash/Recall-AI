import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardGuard from "./pages/DashboardGuard";
import NotFound from "./pages/NotFound";

import { ClerkProvider } from "@clerk/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardGuard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  console.log("App Mounting. Clerk Key present:", !!CLERK_PUBLISHABLE_KEY);
  console.log("Key content check (first 10 chars):", CLERK_PUBLISHABLE_KEY?.substring(0, 10));

  if (!CLERK_PUBLISHABLE_KEY) {
    console.error("VITE_CLERK_PUBLISHABLE_KEY is missing from environment variables.");
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white p-8">
        <div className="max-w-md w-full border border-red-500/50 bg-red-500/5 p-6 rounded-2xl">
          <h1 className="text-xl font-bold mb-2 text-red-500">Configuration Error</h1>
          <p className="text-white/60 mb-4">The `VITE_CLERK_PUBLISHABLE_KEY` is missing. Please ensure your `.env` file contains this key and that you have restarted your development server.</p>
          <div className="bg-black/40 p-3 rounded font-mono text-xs text-white/40">
            Check your .env file for: VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ClerkProvider>
  );
};

export default App;
