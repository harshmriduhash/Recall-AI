import { createContext, useContext } from "react";
import { useUser, useSignIn, useSignUp, useClerk, useAuth as useClerkAuth } from "@clerk/react";

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, signOut: clerkSignOut } = useClerkAuth();
  const signInContext = useSignIn();
  const signUpContext = useSignUp();
  const { session } = useClerk();

  // overall loading state
  const loading = !userLoaded || !authLoaded;

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const signUpResource = signUpContext.signUp;
      if (!signUpResource) throw new Error("SignUp resource not available");
      
      const { error: createError } = await signUpResource.create({
        emailAddress: email,
        unsafeMetadata: { displayName },
      });
      if (createError) throw createError;
      
      const { error: passwordError } = await signUpResource.password({
        password: password
      });
      if (passwordError) throw passwordError;
      
      const { error: finalizeError } = await signUpResource.finalize();
      if (finalizeError) throw finalizeError;

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.errors?.[0]?.message || err.message) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const signInResource = signInContext.signIn;
      if (!signInResource) throw new Error("SignIn resource not available");
      
      const { error: createError } = await signInResource.create({
        identifier: email,
      });
      if (createError) throw createError;

      const { error: passwordError } = await signInResource.password({
        identifier: email,
        password: password
      });
      if (passwordError) throw passwordError;
      
      const { error: finalizeError } = await signInResource.finalize();
      if (finalizeError) throw finalizeError;

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.errors?.[0]?.message || err.message) };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const signInResource = signInContext.signIn;
      if (!signInResource) throw new Error("SignIn resource not available");
      
      const { error } = await signInResource.create({
        strategy: "reset_password_email_code" as any,
        identifier: email,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.errors?.[0]?.message || err.message) };
    }
  };

  const signOut = async () => {
    await clerkSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
