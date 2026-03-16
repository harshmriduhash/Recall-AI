import { motion } from "framer-motion";

export const ThinkingAnimation = () => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest ml-1">
        Analyzing
      </span>
    </div>
  );
};
