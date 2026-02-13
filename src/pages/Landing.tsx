import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PageLoader } from "@/components/ui/page-loader";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Layers, Sparkles, ArrowRight, Zap, Shield, Search } from "lucide-react";
import { motion } from "framer-motion";

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
    icon: Layers,
    title: "Memory Inspector",
    description: "See which memories were retrieved for every answer. Transparent, explainable, and under your control.",
  },
  {
    icon: Sparkles,
    title: "Voice & file capture",
    description: "Add memories by typing, voice (Chrome/Edge), or uploading .md and .txt files. Capture without friction.",
  },
];

const stats = [
  { value: "Recall", label: "at the speed of thought" },
  { value: "Your data", label: "never leaves your account" },
  { value: "AI", label: "grounded in your knowledge" },
];

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader variant="circular" />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-mesh-dark min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="container px-4 md:px-8 pt-28 pb-20 md:pt-36 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
              <Zap className="h-4 w-4" />
              <span>Your second brain for developers</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Remember everything.
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Recall anything.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto md:text-xl">
              Store notes, decisions, and code. Chat with an AI that uses only your memories—and shows you how it reasoned. No more scattered knowledge.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/25" asChild>
                <Link to="/auth?signup=1">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              No credit card required · Free to start
            </p>
          </motion.div>
        </section>

        {/* Stats / social proof strip */}
        <section className="border-y border-border/50 bg-card/20 py-8">
          <div className="container px-4 md:px-8">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-center">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex flex-col"
                >
                  <span className="text-lg font-semibold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container px-4 md:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Built for how you think</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Layers, types, and tags so your second brain stays organized and searchable.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works (simple 3 steps) */}
        <section id="how-it-works" className="container px-4 md:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">How it works</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Three steps to a smarter second brain.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Capture", desc: "Add memories with type (note, code, decision, conversation) and layer. Use text, voice, or files." },
              { step: "2", title: "Search & filter", desc: "Find anything with search and filters. Your timeline stays organized and fast." },
              { step: "3", title: "Chat & inspect", desc: "Ask questions. The AI uses your memories and shows you which ones in the Memory Inspector." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border/50 bg-card/50 p-6 text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="container px-4 md:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-8 md:p-12 text-center overflow-hidden"
          >
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                Start building your second brain
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                Free to start. No credit card. Capture memories, chat with AI, and see exactly how it reasons.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/25" asChild>
                  <Link to="/auth?signup=1">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                  <Link to="/auth">Log in</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
