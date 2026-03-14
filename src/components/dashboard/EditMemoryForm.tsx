import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import type { Memory, MemoryType, MemoryLayer } from "@/types/memory";
import { motion } from "framer-motion";

interface Props {
  memory: Memory;
  onSubmit: (data: { id: string; title: string; content: string; type: MemoryType; memory_layer: MemoryLayer; tags: string[] }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EditMemoryForm({ memory, onSubmit, onCancel, isSubmitting }: Props) {
  const [title, setTitle] = useState(memory.title);
  const [content, setContent] = useState(memory.content);
  const [type, setType] = useState<MemoryType>(memory.type as MemoryType);
  const [layer, setLayer] = useState<MemoryLayer>(memory.memory_layer as MemoryLayer);
  const [tags, setTags] = useState<string[]>(memory.tags || []);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setTitle(memory.title);
    setContent(memory.content);
    setType(memory.type as MemoryType);
    setLayer(memory.memory_layer as MemoryLayer);
    setTags(memory.tags || []);
  }, [memory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ id: memory.id, title, content, type, memory_layer: layer, tags });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        placeholder="Memory title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="bg-muted/30 border-border/50 focus-visible:ring-primary"
      />
      <Textarea
        placeholder="Write your memory..."
        value={content}
        onChange={e => setContent(e.target.value)}
        className="min-h-[140px] bg-muted/30 border-border/50 focus-visible:ring-primary"
        required
      />
      <div className="flex gap-3">
        <Select value={type} onValueChange={(v) => setType(v as MemoryType)}>
          <SelectTrigger className="w-[140px] bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="decision">Decision</SelectItem>
            <SelectItem value="conversation">Conversation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={layer} onValueChange={(v) => setLayer(v as MemoryLayer)}>
          <SelectTrigger className="w-[140px] bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="working">Working</SelectItem>
            <SelectItem value="episodic">Episodic</SelectItem>
            <SelectItem value="semantic">Semantic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Add tag..."
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            className="flex-1 bg-muted/30 border-border/50 focus-visible:ring-primary"
          />
          <Button type="button" size="icon" variant="outline" onClick={addTag} className="hover:bg-primary/10 hover:text-primary transition-all">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <Badge key={t} variant="secondary" className="gap-1 text-xs">
                {t}
                <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 glow-primary font-semibold" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}
