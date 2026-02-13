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
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email for password reset instructions!");
        setIsForgotPassword(false);
      }
      setSubmitting(false);
      return;
    }

    const { error } = isSignUp
      ? await signUp(email, password, displayName)
      : await signIn(email, password);

    if (error) {
      toast.error(error.message);
    } else if (isSignUp) {
      toast.success("Check your email to confirm your account!");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 border-r border-border/50">
        <div className="absolute inset-0 gradient-mesh-dark opacity-80" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-foreground w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl tracking-tight">Recall</span>
          </Link>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Your second brain
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  remembers for you.
                </span>
              </h1>
              <p className="mt-4 text-muted-foreground max-w-md text-lg">
                Store notes, decisions, and code. Chat with AI that uses only your memories—and see exactly how it reasons.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              {["Notes & code", "Voice input", "Memory Inspector"].map((item, i) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Recall. Built for developers.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-background">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2.5 font-semibold text-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl tracking-tight">Recall</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {isForgotPassword ? "Reset password" : isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isForgotPassword
                ? "We'll send you a link to reset your password."
                : isSignUp
                  ? "Start building your second brain in seconds."
                  : "Sign in to continue to Recall."}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {isSignUp && !isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Display name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex"
                  className="h-11 bg-muted/30 border-border/50 focus-visible:ring-primary"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 bg-muted/30 border-border/50 focus-visible:ring-primary"
                required
              />
            </div>
            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 bg-muted/30 border-border/50 focus-visible:ring-primary"
                  required
                  minLength={6}
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isForgotPassword ? "Send reset link" : isSignUp ? "Create account" : "Sign in"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-4 text-center text-sm"
          >
            {!isForgotPassword && (
              <p className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-medium text-primary hover:underline"
                >
                  {isSignUp ? "Sign in" : "Sign up free"}
                </button>
              </p>
            )}
            {!isSignUp && (
              <p className="text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(!isForgotPassword)}
                  className="font-medium text-primary hover:underline"
                >
                  {isForgotPassword ? "Back to sign in" : "Forgot password?"}
                </button>
              </p>
            )}
          </motion.div>

          <p className="mt-8 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
