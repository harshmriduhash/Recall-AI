import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background relative">
        <AnimatedBackground />
        <div className="text-center px-4 relative z-10">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-2 text-8xl font-bold text-gradient-primary"
          >
            404
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            This page doesn't exist in your memory
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button asChild className="glow-primary font-semibold">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return home
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
