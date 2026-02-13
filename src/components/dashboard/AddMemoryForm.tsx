import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Upload, Plus, X, Loader2 } from "lucide-react";
import type { MemoryType, MemoryLayer } from "@/types/memory";
import { toast } from "sonner";

interface Props {
  onSubmit: (data: { title: string; content: string; type: MemoryType; memory_layer: MemoryLayer; tags: string[] }) => void;
  isSubmitting: boolean;
}

export function AddMemoryForm({ onSubmit, isSubmitting }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<MemoryType>("note");
  const [layer, setLayer] = useState<MemoryLayer>("working");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>(""); // accumulated final transcript
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, type, memory_layer: layer, tags });
    setTitle(""); setContent(""); setTags([]); setTagInput("");
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
  };

  const toggleVoice = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    if (!window.isSecureContext) {
      toast.error("Voice input requires HTTPS or localhost for security.");
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice not supported in this browser. Try Chrome or Edge.");
      return;
    }
    transcriptRef.current = content; // start from current content so we append
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const transcript = e.results[i][0]?.transcript ?? "";
        if (e.results[i].isFinal) {
          transcriptRef.current += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      setContent((transcriptRef.current + interim).trim());
    };
    recognition.onerror = (e: any) => {
      setIsRecording(false);
      if (e.error === "not-allowed") toast.error("Microphone access denied.");
      else toast.error("Voice recognition error. Try again.");
    };
    recognition.onend = () => {
      setIsRecording(false);
      setContent(transcriptRef.current.trim());
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext && !["md", "txt", "markdown"].includes(ext)) {
      toast.error("Only .md and .txt files are supported.");
      return;
    }
    try {
      const text = await file.text();
      setContent(text);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
      toast.success("File content loaded");
    } catch {
      toast.error("Could not read file. Use .md or .txt.");
    }
    e.target.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Memory title..." value={title} onChange={e => setTitle(e.target.value)} required />
      <div className="relative">
        <Textarea placeholder="Write your memory, paste content, or use voice..." value={content} onChange={e => setContent(e.target.value)} className="min-h-[140px] pr-20" required />
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <Button type="button" size="icon" variant={isRecording ? "destructive" : "ghost"} className="h-8 w-8" onClick={toggleVoice}>
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept=".md,.txt,text/plain,text/markdown" className="hidden" onChange={handleFile} />
      </div>
      <div className="flex gap-3">
        <Select value={type} onValueChange={(v) => setType(v as MemoryType)}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="decision">Decision</SelectItem>
            <SelectItem value="conversation">Conversation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={layer} onValueChange={(v) => setLayer(v as MemoryLayer)}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="working">Working</SelectItem>
            <SelectItem value="episodic">Episodic</SelectItem>
            <SelectItem value="semantic">Semantic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="flex-1" />
          <Button type="button" size="icon" variant="outline" onClick={addTag}><Plus className="h-4 w-4" /></Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <Badge key={t} variant="secondary" className="gap-1 text-xs">
                {t}
                <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X className="h-3 w-3" /></button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save Memory
      </Button>
    </form>
  );
}
