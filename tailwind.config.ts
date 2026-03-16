import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "slide-in-left": { from: { opacity: "0", transform: "translateX(-20px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "thinking-dots": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(0.8)", opacity: "0.5" }
        },
        "neural-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)" },
          "70%": { boxShadow: "0 0 0 10px rgba(16, 185, 129, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" }
        },
        "gradient-x": {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" }
        },
        "orbit": {
          "from": { "transform": "rotate(0deg) translateX(24px) rotate(0deg)" },
          "to": { "transform": "rotate(360deg) translateX(24px) rotate(-360deg)" }
        },
        "orbit-reverse": {
          "from": { "transform": "rotate(0deg) translateX(18px) rotate(0deg)" },
          "to": { "transform": "rotate(-360deg) translateX(18px) rotate(360deg)" }
        },
        "pulse-glow": {
          "0%, 100%": { "opacity": "0.4", "transform": "scale(1)" },
          "50%": { "opacity": "0.8", "transform": "scale(1.05)" }
        },
        "mesh-drift": {
          "0%, 100%": { "transform": "translate(0, 0) scale(1)" },
          "25%": { "transform": "translate(30px, -50px) scale(1.1)" },
          "50%": { "transform": "translate(-20px, 20px) scale(0.95)" },
          "75%": { "transform": "translate(10px, 40px) scale(1.05)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.4s ease-out",
        "thinking-dots": "thinking-dots 1.4s ease-in-out infinite",
        "neural-pulse": "neural-pulse 2s infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "gradient-x": "gradient-x 3s ease infinite",
        "orbit": "orbit 6s linear infinite",
        "orbit-reverse": "orbit-reverse 4s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "mesh-drift": "mesh-drift 15s ease-in-out infinite"
      },
      backgroundSize: {
        shimmer: "200% 100%",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
