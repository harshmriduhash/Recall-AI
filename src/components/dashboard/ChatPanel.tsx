import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Brain } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { AIThinkingInline } from "@/components/ui/ai-thinking";
import { EmptyState } from "@/components/ui/empty-state";
import { ThinkingAnimation } from "@/components/ui/ThinkingAnimation";
import type { ChatMessage, MemoryInspectorData } from "@/types/memory";
import { toast } from "sonner";
import { useAuth } from "@clerk/react";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface Props {
  onInspectorUpdate: (data: MemoryInspectorData | null) => void;
}

export function ChatPanel({ onInspectorUpdate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { getToken } = useAuth();

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    try {
      const token = await getToken();
      if (!token) {
        toast.error("AUTH_FAILURE: Session expired.");
        setIsLoading(false);
        return;
      }
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (resp.status === 429) { toast.error("RATE_LIMIT: Protocol saturated."); setIsLoading(false); return; }
      if (resp.status === 402) { toast.error("CREDIT_ERR: Node depleted."); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("STREAM_ERR: Response severed.");

      const inspectorHeader = resp.headers.get("X-Memory-Inspector");
      if (inspectorHeader) {
        try { onInspectorUpdate(JSON.parse(inspectorHeader)); } catch {}
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch (err: unknown) {
            console.error("Failed to parse stream chunk:", err);
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (err: unknown) {
      console.error("Chat send error:", err);
      let errorMessage = "UPLINK_ERR: Neural link lost.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-col bg-transparent">
      <ScrollArea className="flex-1 px-4 md:px-8 py-8 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 && (
            <EmptyState
              icon={Brain}
              title="Establish cognitive uplink"
              description="Query your neural cluster using natural language. The AI will cross-reference your memories to provide grounded insights."
            />
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Bot className="h-5 w-5 text-emerald-500" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-base transition-all duration-500 ${
                msg.role === "user"
                  ? "bg-emerald-500 text-black font-medium shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-tr-none"
                  : "bg-white/2 border border-white/5 text-white/80 leading-relaxed rounded-tl-none backdrop-blur-sm"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert prose-emerald prose-p:my-2 prose-headings:my-4 prose-code:text-emerald-400 prose-code:bg-emerald-500/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#080808] prose-pre:border prose-pre:border-white/5 max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <User className="h-5 w-5 text-white/40" />
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
                <Bot className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="rounded-[2rem] rounded-tl-none bg-white/2 border border-white/5 px-6 py-5 backdrop-blur-sm">
                <AIThinkingInline />
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>
      
      <div className="p-4 md:p-8 bg-gradient-to-t from-[#050505] to-transparent relative z-20">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
          <div className="relative flex items-center gap-3 bg-white/2 border border-white/10 focus-within:border-emerald-500/50 rounded-[2.5rem] p-2 pr-4 transition-all duration-500 backdrop-blur-xl shadow-2xl">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Query neural repository..."
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              disabled={isLoading}
              className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 h-14 px-6 text-lg font-light"
            />
            <Button
              size="icon"
              onClick={send}
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shrink-0 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
            >
              {isLoading ? <ThinkingAnimation className="scale-75" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <div className="mt-3 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/10">Neural Uplink v4.5 // End-to-End Encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
