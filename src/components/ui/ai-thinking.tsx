import { cn } from "@/lib/utils";

interface AIThinkingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

/** AI thinking animation with orbiting dots and pulsing center */
export function AIThinking({ className, size = "md", label = "Thinking" }: AIThinkingProps) {
  const sizes = {
    sm: { container: "h-8 w-8", center: "h-2.5 w-2.5", dot: "h-1.5 w-1.5" },
    md: { container: "h-14 w-14", center: "h-4 w-4", dot: "h-2 w-2" },
    lg: { container: "h-20 w-20", center: "h-6 w-6", dot: "h-2.5 w-2.5" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center", s.container)}>
        {/* Center pulse */}
        <div className={cn("rounded-full bg-primary animate-pulse-glow", s.center)} />
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-orbit">
          <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-primary/80", s.dot)} />
        </div>
        <div className="absolute inset-0 animate-orbit-reverse">
          <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-accent/70", s.dot)} />
        </div>
        <div className="absolute inset-0" style={{ animation: "orbit 4s linear infinite 0.5s" }}>
          <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-primary/50", s.dot)} />
        </div>
      </div>
      {label && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">{label}</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

/** Inline AI thinking indicator for chat */
export function AIThinkingInline({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-5 w-5 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
        <div className="absolute inset-0" style={{ animation: "orbit 2s linear infinite" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary/70" />
        </div>
      </div>
      <span className="text-xs text-muted-foreground">Thinking</span>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
