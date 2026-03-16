import { useState, useEffect } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PageLoader } from "@/components/ui/page-loader";
import { SignIn, SignUp } from "@clerk/react";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const signupParam = searchParams.get("signup") === "1";
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(signupParam);

  useEffect(() => {
    if (signupParam) setIsSignUp(true);
    else setIsSignUp(false);
  }, [signupParam]);

  if (loading) return <PageLoader variant="circular" />;
  if (user) return <Navigate to="/dashboard" replace />;

  const clerkAppearance = {
    elements: {
      formButtonPrimary: 
        "bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      card: "bg-transparent border-none shadow-none",
      headerTitle: "text-white text-3xl font-bold",
      headerSubtitle: "text-white/40",
      socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
      socialButtonsBlockButtonText: "text-white font-medium",
      formFieldLabel: "text-white/40 font-mono text-[10px] uppercase tracking-widest",
      formFieldInput: "bg-white/5 border-white/10 text-white rounded-xl focus:border-emerald-500/50",
      footerActionText: "text-white/30",
      footerActionLink: "text-emerald-500 hover:text-emerald-400",
      dividerLine: "bg-white/10",
      dividerText: "text-white/20 font-mono text-[10px]",
      identityPreviewText: "text-white",
      identityPreviewEditButtonIcon: "text-emerald-500"
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex relative bg-[#050505] selection:bg-emerald-500/30">
        <AnimatedBackground particles={true} />

        {/* Left: Branding & Atmosphere */}
        <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505] z-10" />
          <div className="relative z-20 flex flex-col justify-between p-16 xl:p-24 h-full w-full">
            <Link to="/" className="flex items-center gap-3 font-semibold text-white w-fit group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-500">
                <Brain className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-2xl tracking-tight font-sans">Recall<span className="text-emerald-500">.ai</span></span>
            </Link>
            
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400/80 mb-8">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Secure Node Access</span>
                </div>
                <h1 className="text-5xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-8">
                  Synchronize your
                  <br />
                  <span className="text-emerald-500">neural interface.</span>
                </h1>
                <p className="text-white/40 text-xl font-light leading-relaxed mb-12">
                  Access your architecturally-aware second brain. Secure, transparent, and grounded in your technical truth.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                {[
                  { label: "Data Sovereignty", val: "100%" },
                  { label: "Memory Retrieval", val: "< 240ms" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-white/20 text-xs font-mono uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl font-semibold text-emerald-500/80">{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-white/20 text-xs font-mono">
              TERMINAL SESSION: {new Date().toISOString().split('T')[0]} // SECURE_NODE_V4
            </p>
          </div>
        </div>

        {/* Right: Interface Form */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 bg-[#050505] relative z-20">
          <div className="mx-auto w-full max-w-[440px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
                {isSignUp ? "Initialize Node" : "Access Authorized"}
              </h2>
              <p className="text-white/40 font-light">
                {isSignUp
                  ? "Welcome to the future of developer memory."
                  : "Resume your cognitive extension."}
              </p>
            </motion.div>

            <div className="clerk-container">
              {isSignUp ? (
                <SignUp 
                  appearance={clerkAppearance}
                  routing="path"
                  path="/auth"
                  signInUrl="/auth"
                  fallbackRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                />
              ) : (
                <SignIn 
                  appearance={clerkAppearance}
                  routing="path"
                  path="/auth"
                  signUpUrl="/auth?signup=1"
                  fallbackRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
