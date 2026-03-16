import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PageLoader } from "@/components/ui/page-loader";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Layers, Sparkles, ArrowRight, Zap, Shield, Search, Eye, Mic } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "One place for all knowledge",
    description: "Notes, code snippets, decisions, and conversations—structured with types and layers so you can find and reason about them.",
  },
  {
    icon: MessageSquare,
    title: "Chat with your memories",
    description: "Ask questions in plain English. The AI uses only your stored memories and shows you exactly which ones it used.",
  },
  {
    icon: Eye,
    title: "Memory Inspector",
    description: "See which memories were retrieved for every answer. Transparent, explainable, and under your control.",
  },
  {
    icon: Mic,
    title: "Voice & file capture",
    description: "Add memories by typing, voice, or uploading files. Capture knowledge without friction.",
  },
];

const stats = [
  { value: "Recall", label: "at the speed of thought" },
  { value: "Your data", label: "never leaves your account" },
  { value: "AI", label: "grounded in your knowledge" },
];

export default function Landing() {
  const { user, loading } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);

  if (loading) return <PageLoader variant="circular" />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
        <AnimatedBackground />
        <Navbar />

        {/* Hero */}
        <section ref={heroRef} className="relative container px-4 md:px-8 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="mx-auto max-w-5xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">
                <Sparkles className="h-3 w-3" />
                <span>Cognitive Extension Engine</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl mb-12"
            >
              Reason with
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-200 bg-clip-text text-fill-transparent animate-gradient-x">Your Memories</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12 text-lg text-white/50 max-w-2xl mx-auto md:text-xl leading-relaxed font-light font-sans"
            >
              Recall is an architecturally-aware memory layer that stores, retrieves, and 
              reasons about your technical context with absolute transparency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button size="lg" className="h-14 px-10 text-base font-semibold rounded-2xl group relative overflow-hidden" asChild>
                <Link to="/auth?signup=1">
                  <span className="relative z-10 flex items-center gap-2">
                    Initialize Brain
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-base font-medium rounded-2xl hover:border-emerald-500/50 transition-all border-white/10" asChild>
                <Link to="/auth">Access Interface</Link>
              </Button>
            </motion.div>
          </div>

          {/* Floating Dashboard Preview or Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mt-20 mx-auto max-w-6xl relative"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-4 md:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none" />
              <div className="flex gap-4 mb-6">
                <div className="flex h-3 w-3 rounded-full bg-red-500/30" />
                <div className="flex h-3 w-3 rounded-full bg-yellow-500/30" />
                <div className="flex h-3 w-3 rounded-full bg-emerald-500/30" />
              </div>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3 space-y-4">
                  <MemorySkeleton />
                  <MemorySkeleton />
                </div>
                <div className="col-span-6 space-y-4 bg-black/40 rounded-2xl p-6 border border-white/5">
                  <div className="mb-8">
                    <ThinkingAnimation />
                  </div>
                  <div className="space-y-4">
                    <AISkeleton className="h-4 w-3/4" />
                    <AISkeleton className="h-4 w-1/2" />
                    <AISkeleton className="h-20 w-full" />
                  </div>
                </div>
                <div className="col-span-3 space-y-4">
                  <div className="h-40 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-end">
                    <AISkeleton className="h-4 w-1/2 bg-emerald-500/20" />
                  </div>
                  <AISkeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid with Hover Cards */}
        <section id="features" className="container px-4 md:px-8 py-24 md:py-32 relative z-10">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative h-full rounded-3xl border border-white/10 bg-white/2 p-8 transition-all hover:bg-white/5 hover:border-emerald-500/30"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
