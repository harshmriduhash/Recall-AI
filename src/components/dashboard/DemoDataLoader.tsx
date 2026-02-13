import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const DEMO_MEMORIES = [
  {
    title: "Microservices vs Monolith Decision",
    content: "After evaluating our team size (5 devs) and current traffic (10k DAU), we decided to go with a modular monolith. Key reasons: 1) Faster development velocity 2) Simpler deployment 3) Can extract services later. Risk: if traffic 10x, we'll need to split the API layer. Action: revisit in Q3.",
    type: "decision" as const,
    memory_layer: "semantic" as const,
    tags: ["architecture", "backend", "scaling"],
  },
  {
    title: "System Design Interview: URL Shortener",
    content: "Key components: 1) Hash function (base62 encoding of auto-increment ID) 2) Read-heavy → use cache (Redis) 3) 301 vs 302 redirects (301 for SEO, 302 for analytics) 4) Rate limiting per IP 5) Custom aliases stored in separate index. Scale: partition by first char of hash. Analytics: async event queue → analytics DB.",
    type: "note" as const,
    memory_layer: "episodic" as const,
    tags: ["interview-prep", "system-design"],
  },
  {
    title: "Production Incident: Memory Leak in Worker",
    content: "Root cause: EventEmitter listeners were never removed in the job processor. Each job added a new listener, causing memory to grow unbounded. Fix: call removeListener() in the finally block. Prevention: added max listener warning (Node default is 10), plus memory usage alerting at 80% threshold. Lesson: always clean up event listeners in long-running processes.",
    type: "conversation" as const,
    memory_layer: "episodic" as const,
    tags: ["postmortem", "nodejs", "production"],
  },
  {
    title: "Auth Pattern: JWT + Refresh Token",
    content: "Using short-lived JWTs (15min) with long-lived refresh tokens (7d) stored in httpOnly cookies. Access token in memory only (not localStorage). On 401, silently refresh. Logout = delete refresh token server-side + clear cookie. This prevents XSS token theft while maintaining good UX.",
    type: "code" as const,
    memory_layer: "semantic" as const,
    tags: ["auth", "security", "patterns"],
  },
  {
    title: "Team Standup Notes - Sprint 42",
    content: "Blockers: CI pipeline flaky on integration tests (timeout issues). Alice is migrating the payment service to Stripe v3. Bob found a race condition in the order queue — needs review. Decision: skip feature flags for MVP, add post-launch. Next: finalize API contracts for mobile team by Thursday.",
    type: "conversation" as const,
    memory_layer: "working" as const,
    tags: ["standup", "sprint", "team"],
  },
];

export function DemoDataLoader() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const loadDemo = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("memories").insert(
      DEMO_MEMORIES.map(m => ({ ...m, user_id: user.id }))
    );
    if (error) toast.error(error.message);
    else {
      toast.success("Demo memories loaded!");
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    }
    setLoading(false);
  };

  return (
    <Button variant="outline" size="sm" onClick={loadDemo} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      Load Demo Data
    </Button>
  );
}
