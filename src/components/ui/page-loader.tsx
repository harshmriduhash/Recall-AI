import { cn } from "@/lib/utils";
import { AIThinking } from "./ai-thinking";

interface PageLoaderProps {
  className?: string;
  variant?: "spinner" | "pulse" | "dots" | "circular";
}

export function PageLoader({ className, variant = "circular" }: PageLoaderProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (variant === "pulse" || variant === "dots") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
        <AIThinking size="md" label="Loading" />
      </div>
    );
  }

  // circular (default) - branded AI loader
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
      <div className="relative flex flex-col items-center gap-8">
        {/* Ambient glow */}
        <div className="absolute inset-0 -m-10 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="relative">
          <AIThinking size="lg" label="" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">R</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary shimmer-bg" style={{ width: "60%" }} />
          </div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide">Loading Recall</p>
        </div>
      </div>
    </div>
  );
}
