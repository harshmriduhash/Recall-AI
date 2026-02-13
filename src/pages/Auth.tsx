import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (user) return <Navigate to="/" replace />;

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 glow-primary">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Recall</CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp ? "Create your second brain" : "Welcome back to your second brain"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isForgotPassword ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center text-sm text-muted-foreground">
            {!isForgotPassword && (
              <>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </>
            )}
            {!isSignUp && (
              <div>
                <button onClick={() => setIsForgotPassword(!isForgotPassword)} className="text-primary hover:underline font-medium">
                  {isForgotPassword ? "Back to sign in" : "Forgot password?"}
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
