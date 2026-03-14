import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navbar({ className }: { className?: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/20 glass-strong",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-foreground hover:opacity-90 transition-opacity group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:glow-subtle transition-all duration-300">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg tracking-tight">Recall</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild className="glow-primary font-medium">
            <Link to="/auth?signup=1">Get started free</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
