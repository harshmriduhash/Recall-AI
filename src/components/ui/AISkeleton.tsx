import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const AISkeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-emerald-500/10 before:to-transparent",
        className
      )}
      {...props}
    />
  );
};

export const MemorySkeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div className={cn("p-4 rounded-xl border border-white/5 bg-white/2 space-y-3", className)} {...props}>
      <div className="flex justify-between items-start">
        <AISkeleton className="h-5 w-1/3" />
        <AISkeleton className="h-4 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <AISkeleton className="h-4 w-full" />
        <AISkeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-2">
        <AISkeleton className="h-4 w-12 rounded-full" />
        <AISkeleton className="h-4 w-12 rounded-full" />
      </div>
    </div>
  );
};
