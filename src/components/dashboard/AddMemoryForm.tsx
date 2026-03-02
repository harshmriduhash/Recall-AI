import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Upload, Plus, X, Loader2, Sparkles } from "lucide-react";
import type { MemoryType, MemoryLayer } from "@/types/memory";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [suggestingTags, setSuggestingTags] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, type, memory_layer: layer, tags });
    setTitle(""); setContent(""); setTags([]); setTagInput(""); setSuggestedTags([]);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
  };

  const suggestTags = async () => {
    if (!content.trim() && !title.trim()) {
      toast.error("Add some content first to get tag suggestions");
      return;
    }
    setSuggestingTags(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ title, content, type }),
      });
      const data = await resp.json();
      if (data.tags && data.tags.length > 0) {
        const newSuggestions = data.tags.filter((t: string) => !tags.includes(t));
        setSuggestedTags(newSuggestions);
        if (newSuggestions.length === 0) toast.info("No new tags to suggest");
      } else {
        toast.info("No suggestions available");
      }
    } catch {
      toast.error("Could not get suggestions");
    }
    setSuggestingTags(false);
  };

  const acceptTag = (tag: string) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setSuggestedTags(suggestedTags.filter(t => t !== tag));
  };

  const toggleVoice = async () => {
    if (isRecording) {
      // Stop recording — this triggers the onstop handler
      mediaRecorderRef.current?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release mic
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 1000) {
          toast.error("Recording too short. Try again.");
          return;
        }

        setIsTranscribing(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe`, {
            method: "POST",
            headers: { Authorization: `Bearer ${session?.access_token}` },
            body: formData,
          });

          const data = await resp.json();
          if (data.transcript) {
            setContent((prev) => (prev ? prev + " " + data.transcript : data.transcript));
            toast.success("Voice transcribed!");
          } else {
            toast.error(data.error || "Could not transcribe audio");
          }
        } catch {
          toast.error("Transcription failed. Try again.");
        }
        setIsTranscribing(false);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      toast.info("Recording... Click mic again to stop.");
    } catch (err: any) {
      console.error("Mic error:", err);
      if (err.name === "NotAllowedError") {
        toast.error("Microphone access denied. Allow it in browser settings.");
      } else if (err.name === "NotFoundError") {
        toast.error("No microphone found. Connect one and retry.");
      } else {
        toast.error("Could not access microphone.");
      }
    }
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
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input placeholder="Memory title..." value={title} onChange={e => setTitle(e.target.value)} required />
      <div className="relative">
        <Textarea placeholder="Write your memory, paste content, or use voice..." value={content} onChange={e => setContent(e.target.value)} className="min-h-[140px] pr-20" required />
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <Button type="button" size="icon" variant={isRecording ? "destructive" : "ghost"} className="h-8 w-8" onClick={toggleVoice} disabled={isTranscribing}>
            {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept=".md,.txt,text/plain,text/markdown" className="hidden" onChange={handleFile} />
      </div>
      <div className="flex gap-3 flex-wrap">
        <Select value={type} onValueChange={(v) => setType(v as MemoryType)}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="decision">Decision</SelectItem>
            <SelectItem value="conversation">Conversation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={layer} onValueChange={(v) => setLayer(v as MemoryLayer)}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
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
          <Button type="button" variant="outline" size="sm" onClick={suggestTags} disabled={suggestingTags} className="gap-1.5 shrink-0">
            {suggestingTags ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">AI Tags</span>
          </Button>
        </div>
        <AnimatePresence>
          {suggestedTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5 p-2 rounded-md bg-primary/5 border border-primary/20">
                <span className="text-[10px] text-primary font-medium w-full mb-0.5">AI Suggestions:</span>
                {suggestedTags.map(t => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="cursor-pointer text-xs border-primary/30 hover:bg-primary/10 transition-colors"
                    onClick={() => acceptTag(t)}
                  >
                    + {t}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </motion.form>
  );
}
