import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("flex flex-col items-center justify-center py-20 px-6 text-center", className)}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        {/* Glow ecosystem */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl scale-150 animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-sm">
          <Icon className="h-10 w-10 text-emerald-500/60" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#050505] border border-emerald-500/20 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-white mb-3"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/40 font-light max-w-[280px] leading-relaxed"
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
