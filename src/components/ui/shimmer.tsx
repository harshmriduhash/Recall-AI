import { cn } from "@/lib/utils";

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export function Shimmer({ className, width = "w-full", height = "h-4", ...props }: ShimmerProps) {
  return (
    <div
      className={cn("rounded-md shimmer-bg", width, height, className)}
      {...props}
    />
  );
}

export function ShimmerBlock({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-border/30 bg-card/30 p-6", className)} {...props}>
      <Shimmer className="h-5 w-32 mb-4" />
      <Shimmer className="h-3 w-full mb-2" />
      <Shimmer className="h-3 w-full mb-2" />
      <Shimmer className="h-3 w-[80%]" />
    </div>
  );
}
