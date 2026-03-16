import { cn } from "@/lib/utils";

/** Ambient animated mesh gradient background with floating particles */
export function AnimatedBackground({ className, particles = true }: { className?: string; particles?: boolean }) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 overflow-hidden bg-[#050505]", className)} aria-hidden>
      {/* Neural Mesh orbs */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-[0.08] blur-[120px] animate-mesh-drift"
        style={{ background: "#10b981" }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.05] blur-[150px]"
        style={{
          background: "#064e3b",
          animation: "mesh-drift 25s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full opacity-[0.03] blur-[100px]"
        style={{
          background: "#10b981",
          animation: "mesh-drift 30s ease-in-out infinite 5s",
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating particles */}
      {particles && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0], y: i % 2 === 0 ? [0, -100] : [0, 100] }}
              transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 10 }}
              className="absolute rounded-full bg-emerald-500/20"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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
