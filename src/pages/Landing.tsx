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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  if (loading) return <PageLoader variant="circular" />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative">
        <AnimatedBackground />
        <Navbar />

        {/* Hero */}
        <section ref={heroRef} className="relative container px-4 md:px-8 pt-32 pb-20 md:pt-40 md:pb-32">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="mx-auto max-w-4xl text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8 glass">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Your second brain for developers</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.95]"
            >
              Remember
              <br />
              everything.
              <br />
              <span className="text-gradient-primary">Recall anything.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto md:text-xl leading-relaxed"
            >
              Store notes, decisions, and code. Chat with an AI that uses{" "}
              <span className="text-foreground font-medium">only your memories</span>—and shows you how it reasoned.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="text-base px-8 h-13 glow-primary font-semibold" asChild>
                <Link to="/auth?signup=1">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-13 glass" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-5 text-xs text-muted-foreground flex items-center justify-center gap-2"
            >
              <Shield className="h-3.5 w-3.5" />
              No credit card required · Free to start
            </motion.p>
          </motion.div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-border/30 glass py-8 relative z-10">
          <div className="container px-4 md:px-8">
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-4 text-center">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
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
        <section id="features" className="container px-4 md:px-8 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              Built for how you <span className="text-gradient-primary">think</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Layers, types, and tags so your second brain stays organized and searchable.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-2xl glass p-6 hover:border-glow transition-all duration-300 cursor-default"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 group-hover:glow-subtle transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="container px-4 md:px-8 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">How it works</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Three steps to a smarter second brain.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Capture", desc: "Add memories with type (note, code, decision, conversation) and layer. Use text, voice, or files.", icon: Sparkles },
              { step: "2", title: "Search & filter", desc: "Find anything with search and filters. Your timeline stays organized and fast.", icon: Search },
              { step: "3", title: "Chat & inspect", desc: "Ask questions. The AI uses your memories and shows you which ones in the Memory Inspector.", icon: Layers },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                className="relative rounded-2xl glass p-8 text-center group hover:border-glow transition-all duration-300"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center glow-primary">
                  {item.step}
                </div>
                <div className="flex items-center justify-center mb-4 mt-2">
                  <item.icon className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="container px-4 md:px-8 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative mx-auto max-w-3xl rounded-3xl glass border-glow p-10 md:p-14 text-center overflow-hidden"
          >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
                Start building your
                <br />
                <span className="text-gradient-primary">second brain</span>
              </h2>
              <p className="mt-5 text-muted-foreground max-w-lg mx-auto text-lg">
                Free to start. No credit card. Capture memories, chat with AI, and see exactly how it reasons.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-base px-8 h-13 glow-primary font-semibold" asChild>
                  <Link to="/auth?signup=1">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 h-13" asChild>
                  <Link to="/auth">Log in</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
