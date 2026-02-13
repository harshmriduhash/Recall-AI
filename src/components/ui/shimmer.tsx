import { cn } from "@/lib/utils";

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional width class (e.g. w-48) */
  width?: string;
  /** Optional height class (e.g. h-4) */
  height?: string;
}

export function Shimmer({ className, width = "w-full", height = "h-4", ...props }: ShimmerProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer",
        width,
        height,
        className
      )}
      {...props}
    />
  );
}

/** Card-style shimmer block for skeleton screens */
export function ShimmerBlock({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/50 p-6", className)} {...props}>
      <Shimmer className="h-5 w-32 mb-4" />
      <Shimmer className="h-3 w-full mb-2" />
      <Shimmer className="h-3 w-full mb-2" />
      <Shimmer className="h-3 w-[80%]" />
    </div>
  );
}
