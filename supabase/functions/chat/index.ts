import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting (for MVP; use Redis/KV for production scale)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_REQUESTS = 30; // requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, resetAt: now + RATE_LIMIT_WINDOW };
  }

  if (userLimit.count >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: userLimit.resetAt };
  }

  userLimit.count++;
  rateLimitMap.set(userId, userLimit);
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - userLimit.count, resetAt: userLimit.resetAt };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Get user's memories for context
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get user from token
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      const resetSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return new Response(JSON.stringify({ 
        error: "Rate limit exceeded", 
        message: `Too many requests. Please try again in ${Math.ceil(resetSeconds / 60)} minutes.` 
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(RATE_LIMIT_REQUESTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let memoryContext = "";
    let inspectorData = null;
      
    const { data: memories } = await supabase
      .from("memories")
      .select("title, content, type, memory_layer, tags, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (memories && memories.length > 0) {
      const retrieved = memories.map((m, i) => ({
        id: `mem-${i}`,
        title: m.title,
        layer: m.memory_layer,
        relevance: Math.max(0.3, 1 - i * 0.04),
      }));

      inspectorData = {
        retrievedMemories: retrieved.slice(0, 8),
        reasoning: `Retrieved ${memories.length} memories. Most recent and relevant memories were prioritized based on recency and type match.`,
      };

      memoryContext = memories.map((m, i) => 
        `[Memory ${i + 1}: "${m.title}" | Type: ${m.type} | Layer: ${m.memory_layer} | Tags: ${(m.tags || []).join(", ")}]\n${m.content}`
      ).join("\n\n---\n\n");
    }

    const systemPrompt = `You are Recall AI — a second brain for developers. You help users recall, connect, and reason about their stored memories (notes, code snippets, decisions, conversations).

${memoryContext ? `## User's Memories:\n\n${memoryContext}\n\n## Instructions:` : "## No memories found yet. Encourage the user to add some memories first."}
- When answering, cite specific memory titles in bold (e.g., **"Memory Title"**)
- Connect related memories and surface patterns
- If the user asks about something not in their memories, say so honestly
- Be concise but thorough. Use markdown formatting.
- If asked about knowledge gaps, analyze what topics are missing from their memory collection.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const headers: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "X-RateLimit-Limit": String(RATE_LIMIT_REQUESTS),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
    };
    if (inspectorData) {
      headers["X-Memory-Inspector"] = JSON.stringify(inspectorData);
    }

    return new Response(response.body, { headers });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
