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
  note: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  code: "text-emerald-300 bg-emerald-500/5 border-emerald-500/10",
  decision: "text-emerald-500 bg-emerald-500/20 border-emerald-500/30",
  conversation: "text-white/40 bg-white/5 border-white/10",
};

const layerColors: Record<string, string> = {
  working: "border-l-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  episodic: "border-l-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.05)]",
  semantic: "border-l-emerald-500/20",
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
    <div className="flex h-full flex-col bg-[#050505]">
      <div className="p-6 space-y-6 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-10">
        <div>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-1">Neural Repository</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums">{filteredMemories.length}</span>
            <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-wider">Fragments Indexed</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Query memory banks..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="pl-9 pr-9 h-10 text-[11px] bg-white/2 border-white/5 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-xl transition-all font-light"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-white/20 hover:text-white hover:bg-white/5"
                onClick={() => { setSearchQuery(""); setPage(1); }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="h-9 text-[10px] font-mono uppercase tracking-wider bg-white/2 border-white/5 rounded-xl hover:bg-white/4 transition-all">
                <SelectValue placeholder="TYPE" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-white/10">
                <SelectItem value="all" className="text-[10px] font-mono uppercase">ALL_TYPES</SelectItem>
                <SelectItem value="note" className="text-[10px] font-mono uppercase">NOTE</SelectItem>
                <SelectItem value="code" className="text-[10px] font-mono uppercase">CODE</SelectItem>
                <SelectItem value="decision" className="text-[10px] font-mono uppercase">DECISION</SelectItem>
                <SelectItem value="conversation" className="text-[10px] font-mono uppercase">CHAT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={layerFilter} onValueChange={(v) => { setLayerFilter(v); setPage(1); }}>
              <SelectTrigger className="h-9 text-[10px] font-mono uppercase tracking-wider bg-white/2 border-white/5 rounded-xl hover:bg-white/4 transition-all">
                <SelectValue placeholder="LAYER" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-white/10">
                <SelectItem value="all" className="text-[10px] font-mono uppercase">ALL_LAYERS</SelectItem>
                <SelectItem value="working" className="text-[10px] font-mono uppercase">WORKING</SelectItem>
                <SelectItem value="episodic" className="text-[10px] font-mono uppercase">EPISODIC</SelectItem>
                <SelectItem value="semantic" className="text-[10px] font-mono uppercase">SEMANTIC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 space-y-3 opacity-50 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-lg bg-white/5" />
                    <div className="h-4 w-32 rounded bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded bg-white/5" />
                    <div className="h-2 w-2/3 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {!isLoading && paginatedMemories.map((memory, i) => {
              const Icon = typeIcons[memory.type] || Brain;
              const isSelected = selectedId === memory.id;
              
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  onClick={() => onSelect(memory)}
                  className={`group relative cursor-pointer rounded-2xl border-l-[3px] p-4 transition-all duration-300 ${layerColors[memory.memory_layer]} ${
                    isSelected 
                      ? "bg-white/5 border-emerald-500 ring-1 ring-emerald-500/20" 
                      : "bg-[#0A0A0A] border-white/5 hover:bg-white/[0.03] hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-lg border ${typeColors[memory.type]} shadow-sm`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <h3 className={`text-[13px] font-medium truncate tracking-tight transition-colors ${isSelected ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                          {memory.title}
                        </h3>
                      </div>
                      
                      <p className="text-[11px] text-white/30 line-clamp-2 leading-relaxed font-light mb-3">
                        {memory.content}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] px-2 py-0.5 rounded-md uppercase font-mono tracking-wider">
                          {memory.memory_layer}
                        </Badge>
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                          {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 text-white/20 hover:text-emerald-400 hover:bg-emerald-500/10 shrink-0"
                      onClick={(e) => { e.stopPropagation(); onDelete(memory.id); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {!isLoading && paginatedMemories.length === 0 && (
            <div className="py-12 px-6">
              <EmptyState
                icon={Brain}
                title={memories.length === 0 ? "Archive Empty" : "No Matches"}
                description={memories.length === 0 ? "Initialize repository with your first thought." : "Query returned zero fragments. Adjust vectors."}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      {!isLoading && totalPages > 1 && (
        <div className="p-4 flex items-center justify-between border-t border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/5"
          >
            &lt; Prev
          </Button>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            Block {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/5"
          >
            Next &gt;
          </Button>
        </div>
      )}
    </div>
  );
}
