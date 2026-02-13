import { Memory } from "@/types/memory";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Code, GitBranch, MessageSquare, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const typeIcons: Record<string, React.ElementType> = {
  note: Brain,
  code: Code,
  decision: GitBranch,
  conversation: MessageSquare,
};

const typeColors: Record<string, string> = {
  note: "bg-primary/15 text-primary",
  code: "bg-accent/15 text-accent",
  decision: "bg-destructive/15 text-destructive",
  conversation: "bg-muted text-muted-foreground",
};

const layerColors: Record<string, string> = {
  working: "border-l-accent",
  episodic: "border-l-primary",
  semantic: "border-l-destructive",
};

interface Props {
  memories: Memory[];
  selectedId?: string;
  onSelect: (memory: Memory) => void;
  onDelete: (id: string) => void;
}

export function MemoryTimeline({ memories, selectedId, onSelect, onDelete }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Memory Timeline</h2>
        <p className="text-xs text-muted-foreground mt-1">{memories.length} memories</p>
      </div>
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-3 space-y-2">
          <AnimatePresence>
            {memories.map((memory, i) => {
              const Icon = typeIcons[memory.type] || Brain;
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelect(memory)}
                  className={`group cursor-pointer rounded-lg border-l-2 ${layerColors[memory.memory_layer]} p-3 transition-colors hover:bg-secondary/50 ${
                    selectedId === memory.id ? "bg-secondary" : "bg-card/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`flex h-5 w-5 items-center justify-center rounded ${typeColors[memory.type]}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium truncate">{memory.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{memory.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{memory.memory_layer}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => { e.stopPropagation(); onDelete(memory.id); }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {memories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Brain className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No memories yet</p>
              <p className="text-xs mt-1">Start by adding your first memory</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
