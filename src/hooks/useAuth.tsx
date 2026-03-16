import { createContext, useContext } from "react";
import { useUser, useSignIn, useSignUp, useClerk } from "@clerk/react";

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
  const { signIn: clerkSignIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp: clerkSignUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  const { signOut: clerkSignOut, session } = useClerk();

  const loading = !userLoaded || !signInLoaded || !signUpLoaded;

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      if (!clerkSignUp) throw new Error("SignUp not loaded");
      const result = await clerkSignUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { displayName },
      });
      
      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        return { error: null };
      }
      
      // Handle multi-step signup if needed, but for now assuming complete or error
      return { error: new Error(`Signup status: ${result.status}`) };
    } catch (err: any) {
      return { error: new Error(err.errors?.[0]?.message || err.message) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!clerkSignIn) throw new Error("SignIn not loaded");
      const result = await clerkSignIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        return { error: null };
      }
      
      return { error: new Error(`Signin status: ${result.status}`) };
    } catch (err: any) {
      return { error: new Error(err.errors?.[0]?.message || err.message) };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!clerkSignIn) throw new Error("SignIn not loaded");
      await clerkSignIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
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
