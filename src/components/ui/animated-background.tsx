import { cn } from "@/lib/utils";

/** Ambient animated mesh gradient background with floating particles */
export function AnimatedBackground({ className, particles = true }: { className?: string; particles?: boolean }) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)} aria-hidden>
      {/* Mesh gradient orbs */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.07] blur-[100px] animate-mesh-drift"
        style={{ background: "hsl(var(--primary))" }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[50vw] h-[50vw] rounded-full opacity-[0.05] blur-[120px]"
        style={{
          background: "hsl(var(--accent))",
          animation: "mesh-drift 20s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[30vw] h-[30vw] rounded-full opacity-[0.04] blur-[80px]"
        style={{
          background: "hsl(var(--primary))",
          animation: "mesh-drift 25s ease-in-out infinite 5s",
        }}
      />

      {/* Floating particles */}
      {particles && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? "hsl(var(--primary) / 0.4)" : "hsl(var(--muted-foreground) / 0.2)",
                animation: `float ${6 + Math.random() * 8}s ease-in-out infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Inline mesh gradient for sections */
export function MeshGradientSection({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-1/2 left-1/4 w-[40vw] h-[40vw] rounded-full opacity-[0.06] blur-[80px] animate-mesh-drift"
          style={{ background: "hsl(var(--primary))" }}
        />
        <div
          className="absolute -bottom-1/3 right-1/3 w-[35vw] h-[35vw] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: "hsl(var(--accent))", animation: "mesh-drift 18s ease-in-out infinite reverse" }}
        />
      </div>
      {children}
    </div>
  );
}
