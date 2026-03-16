import { useState, useEffect } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PageLoader } from "@/components/ui/page-loader";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ThinkingAnimation } from "@/components/ui/ThinkingAnimation";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const signupParam = searchParams.get("signup") === "1";
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(signupParam);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  useEffect(() => {
    if (signupParam) setIsSignUp(true);
  }, [signupParam]);

  if (loading) return <PageLoader variant="circular" />;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isForgotPassword) {
      const { error } = await resetPassword(email);
      if (error) toast.error(error.message);
      else {
        toast.success("Identity verification request sent. Check your secure inbox.");
        setIsForgotPassword(false);
      }
      setSubmitting(false);
      return;
    }

    const { error } = isSignUp
      ? await signUp(email, password, displayName)
      : await signIn(email, password);

    if (error) toast.error(error.message);
    else if (isSignUp) toast.success("Initialization link sent. Verify your neural node.");
    setSubmitting(false);
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
              className="mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
                {isForgotPassword ? "Recovery protocol" : isSignUp ? "Initialize Node" : "Access Authorized"}
              </h2>
              <p className="text-white/40 font-light">
                {isForgotPassword
                  ? "Initiating identity verification sequence."
                  : isSignUp
                    ? "Welcome to the future of developer memory."
                    : "Resume your cognitive extension."}
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {isSignUp && !isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/60 text-xs uppercase tracking-widest ml-1 font-mono">Identifier</Label>
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="E.g. Nexus-Core"
                    className="h-14 bg-white/2 border-white/5 focus-visible:border-emerald-500/50 rounded-2xl text-white placeholder:text-white/20 transition-all font-sans"
                    required
                  />
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-emerald-500 transition-colors">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-white/2 border-white/5 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/30 text-white rounded-2xl transition-all"
                    />
                  </div>
                </div>
                {!isForgotPassword && (
                  <div className="space-y-2 group">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 group-focus-within:text-emerald-500 transition-colors">Password</Label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[10px] font-mono uppercase tracking-wider text-emerald-500/50 hover:text-emerald-400 transition-colors"
                      >
                        Reset Key?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 bg-white/2 border-white/5 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/30 text-white rounded-2xl transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full h-12 bg-emerald-500 text-black hover:bg-emerald-400 font-bold uppercase tracking-[0.2em] text-[12px] rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                {submitting ? (
                  <ThinkingAnimation className="scale-75" />
                ) : (
                  isForgotPassword ? "Execute Recovery" : isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-4 text-sm"
            >
              {!isForgotPassword && (
                <p className="text-white/30 font-light flex items-center justify-between">
                  {isSignUp ? "Account already mapped?" : "New node detected?"}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10"
                  >
                    {isSignUp ? "Switch to Access" : "Initialize Now"}
                  </button>
                </p>
              )}
              {!isSignUp && (
                <p className="text-white/30 font-light flex items-center justify-between">
                  Lost your cipher?
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(!isForgotPassword)}
                    className="font-medium text-white/60 hover:text-white transition-colors"
                  >
                    {isForgotPassword ? "Return via Auth" : "Recovery protocol"}
                  </button>
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
