import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar({ className }: { className?: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-3xl",
        className
      )}
    >
      <div className="container flex h-20 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3 font-semibold text-white hover:opacity-90 transition-opacity group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all duration-500">
            <Brain className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="text-xl tracking-tight font-sans">Recall<span className="text-emerald-500">.ai</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {["Features", "How it works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm font-medium text-white/50 hover:text-emerald-400 transition-colors duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500/50 rounded-full group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/auth" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors px-2">
            Log in
          </Link>
          <Button asChild className="hidden sm:flex rounded-xl px-6 h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Link to="/auth?signup=1">Join the Beta</Link>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#050505] border-white/5 p-8 flex flex-col pt-16">
                <nav className="flex flex-col gap-8">
                  {["Features", "How it works", "Pricing"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                      className="text-lg font-medium text-white/50 hover:text-emerald-400 transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                  <div className="h-px bg-white/5 my-4" />
                  <Link to="/auth" className="text-lg font-medium text-white/70 hover:text-white">
                    Log in
                  </Link>
                  <Button asChild className="rounded-xl px-6 h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold">
                    <Link to="/auth?signup=1">Join the Beta</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
