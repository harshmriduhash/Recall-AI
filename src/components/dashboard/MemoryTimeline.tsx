import { useState, useMemo } from "react";
import { Memory } from "@/types/memory";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Code, GitBranch, MessageSquare, Trash2, Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { motion, AnimatePresence } from "framer-motion";

const typeIcons: Record<string, React.ElementType> = {
  note: Brain,
  code: Code,
  decision: GitBranch,
  conversation: MessageSquare,
};

const typeColors: Record<string, string> = {
  note: "bg-primary/15 text-primary border-primary/20",
  code: "bg-accent/15 text-accent border-accent/20",
  decision: "bg-destructive/15 text-destructive border-destructive/20",
  conversation: "bg-muted text-muted-foreground border-border/30",
};

const layerColors: Record<string, string> = {
  working: "border-l-primary",
  episodic: "border-l-accent",
  semantic: "border-l-destructive",
};

interface Props {
  memories: Memory[];
  selectedId?: string;
  onSelect: (memory: Memory) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 50;

export function MemoryTimeline({ memories, selectedId, onSelect, onDelete, isLoading }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [layerFilter, setLayerFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filteredMemories = useMemo(() => {
    let filtered = memories;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "all") filtered = filtered.filter(m => m.type === typeFilter);
    if (layerFilter !== "all") filtered = filtered.filter(m => m.memory_layer === layerFilter);
    return filtered;
  }, [memories, searchQuery, typeFilter, layerFilter]);

  const paginatedMemories = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredMemories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMemories, page]);

  const totalPages = Math.ceil(filteredMemories.length / ITEMS_PER_PAGE);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/30 p-4 space-y-3 glass-strong">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Memory Timeline</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredMemories.length} of {memories.length} memories
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-8 pr-8 h-8 text-xs bg-muted/30 border-border/50 focus-visible:ring-primary"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6 hover:bg-primary/10"
              onClick={() => { setSearchQuery(""); setPage(1); }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="h-8 text-xs flex-1 bg-muted/30 border-border/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="decision">Decision</SelectItem>
              <SelectItem value="conversation">Conversation</SelectItem>
            </SelectContent>
          </Select>
          <Select value={layerFilter} onValueChange={(v) => { setLayerFilter(v); setPage(1); }}>
            <SelectTrigger className="h-8 text-xs flex-1 bg-muted/30 border-border/50">
              <SelectValue placeholder="Layer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Layers</SelectItem>
              <SelectItem value="working">Working</SelectItem>
              <SelectItem value="episodic">Episodic</SelectItem>
              <SelectItem value="semantic">Semantic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="p-3 space-y-2">
          {/* Skeleton loaders */}
          {isLoading && (
            <div className="space-y-3 p-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-xl border border-border/20 bg-card/30 p-3 space-y-2.5" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded shimmer-bg" />
                    <div className="h-4 w-28 rounded shimmer-bg" />
                  </div>
                  <div className="h-3 w-full rounded shimmer-bg" />
                  <div className="h-3 w-3/4 rounded shimmer-bg" />
                  <div className="flex gap-2 mt-1">
                    <div className="h-5 w-14 rounded-full shimmer-bg" />
                    <div className="h-5 w-20 rounded-full shimmer-bg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {!isLoading && paginatedMemories.map((memory, i) => {
              const Icon = typeIcons[memory.type] || Brain;
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => onSelect(memory)}
                  whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                  className={`group cursor-pointer rounded-xl border-l-2 ${layerColors[memory.memory_layer]} p-3 transition-all duration-200 hover:bg-secondary/30 hover:border-glow ${
                    selectedId === memory.id ? "bg-secondary/50 border-glow" : "bg-card/20 border border-border/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`flex h-5 w-5 items-center justify-center rounded border ${typeColors[memory.type]}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium truncate">{memory.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{memory.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/30">{memory.memory_layer}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive shrink-0"
                      onClick={(e) => { e.stopPropagation(); onDelete(memory.id); }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!isLoading && paginatedMemories.length === 0 && (
            <EmptyState
              icon={Brain}
              title={memories.length === 0 ? "No memories yet" : "No memories match"}
              description={memories.length === 0 ? "Start by adding your first memory" : "Try adjusting your search or filters"}
            />
          )}
        </div>
      </ScrollArea>
      {!isLoading && totalPages > 1 && (
        <div className="border-t border-border/30 p-3 flex items-center justify-between glass-strong">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-7 text-xs"
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-7 text-xs"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
