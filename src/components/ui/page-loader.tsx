import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  /** "spinner" | "pulse" | "dots" | "circular" */
  variant?: "spinner" | "pulse" | "dots" | "circular";
}

export function PageLoader({ className, variant = "circular" }: PageLoaderProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    );
  }

  // circular (default): ring + logo area
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
            <span className="text-lg font-bold text-primary">R</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 rounded-full bg-primary animate-pulse" style={{ width: "40%" }} />
          </div>
          <p className="text-xs text-muted-foreground">Loading Recall...</p>
        </div>
      </div>
    </div>
  );
}
