import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { AIThinkingInline } from "@/components/ui/ai-thinking";
import { EmptyState } from "@/components/ui/empty-state";
import type { ChatMessage, MemoryInspectorData } from "@/types/memory";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error("Please sign in again to use chat.");
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

      if (resp.status === 429) { toast.error("Rate limited, try again later"); setIsLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted"); setIsLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

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
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Chat error");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4 scrollbar-thin">
        <div className="space-y-4">
          {messages.length === 0 && (
            <EmptyState
              icon={Bot}
              title="Ask anything about your memories"
              description='Try: "What did I decide about auth?" or "Summarize my notes"'
            />
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm transition-all ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground glow-subtle"
                  : "bg-secondary/50 border border-border/30"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary glow-subtle">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-xl bg-secondary/50 border border-border/30 px-4 py-3">
                <AIThinkingInline />
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="border-t border-border/30 p-4 glass-strong">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your memories..."
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            disabled={isLoading}
            className="bg-muted/30 border-border/50 focus-visible:ring-primary focus-visible:border-primary/50"
          />
          <Button
            size="icon"
            onClick={send}
            disabled={isLoading || !input.trim()}
            className="glow-subtle shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
