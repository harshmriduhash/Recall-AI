import { Link } from "react-router-dom";
import { Brain, Github, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-card/10 relative z-10">
      <div className="container px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 font-semibold text-foreground group">
              <Brain className="h-5 w-5 text-primary" />
              Recall
            </Link>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Your second brain. Store, search, and reason about your knowledge with AI.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Github, label: "GitHub" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4 text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Recall. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for developers who think in layers.</p>
        </div>
      </div>
    </footer>
  );
}
