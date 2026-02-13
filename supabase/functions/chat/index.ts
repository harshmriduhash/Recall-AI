import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Get user's memories for context
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    let memoryContext = "";
    let inspectorData = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Get user from token
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: { user } } = await anonClient.auth.getUser(token);
      
      if (user) {
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
      }
    }

    const systemPrompt = `You are the Hybrid Memory System AI — a second brain for developers. You help users recall, connect, and reason about their stored memories (notes, code snippets, decisions, conversations).

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
