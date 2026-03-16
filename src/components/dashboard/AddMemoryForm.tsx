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
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 1000) { toast.error("Recording too short. Try again."); return; }
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
        } catch { toast.error("Transcription failed. Try again."); }
        setIsTranscribing(false);
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      toast.info("Recording... Click mic again to stop.");
    } catch (err: unknown) {
      const error = err as { name?: string };
      if (error.name === "NotAllowedError") toast.error("Microphone access denied.");
      else if (error.name === "NotFoundError") toast.error("No microphone found.");
      else toast.error("Could not access microphone.");
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext && !["md", "txt", "markdown"].includes(ext)) { toast.error("Only .md and .txt files are supported."); return; }
    try {
      const text = await file.text();
      setContent(text);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
      toast.success("File content loaded");
    } catch { toast.error("Could not read file."); }
    e.target.value = "";
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="group">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mb-2 block ml-1">Memory Title</label>
          <Input
            placeholder="Enter title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="h-12 bg-white/2 border-white/5 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/30 text-white rounded-2xl transition-all"
          />
        </div>

        <div className="group relative">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mb-2 block ml-1">Content</label>
          <Textarea
            placeholder="Write your memory here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="min-h-[180px] pr-14 bg-white/2 border-white/5 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/30 text-white rounded-2xl transition-all leading-relaxed resize-none"
            required
          />
          <div className="absolute right-3 top-10 flex flex-col gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={`h-9 w-9 rounded-xl transition-all duration-300 ${isRecording ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse" : "bg-white/5 text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10"}`}
              onClick={toggleVoice}
              disabled={isTranscribing}
            >
              {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-xl bg-white/5 text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <input ref={fileInputRef} type="file" accept=".md,.txt,text/plain,text/markdown" className="hidden" onChange={handleFile} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 ml-1">Classification</label>
          <Select value={type} onValueChange={(v) => setType(v as MemoryType)}>
            <SelectTrigger className="h-11 bg-white/2 border-white/5 rounded-xl text-[11px] font-mono uppercase tracking-wider text-white/60 hover:bg-white/4 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-white/10">
              <SelectItem value="note" className="text-[10px] font-mono uppercase">NOTE</SelectItem>
              <SelectItem value="code" className="text-[10px] font-mono uppercase">CODE</SelectItem>
              <SelectItem value="decision" className="text-[10px] font-mono uppercase">DECISION</SelectItem>
              <SelectItem value="conversation" className="text-[10px] font-mono uppercase">CHAT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 ml-1">Priority Layer</label>
          <Select value={layer} onValueChange={(v) => setLayer(v as MemoryLayer)}>
            <SelectTrigger className="h-11 bg-white/2 border-white/5 rounded-xl text-[11px] font-mono uppercase tracking-wider text-white/60 hover:bg-white/4 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-white/10">
              <SelectItem value="working" className="text-[10px] font-mono uppercase">WORKING</SelectItem>
              <SelectItem value="episodic" className="text-[10px] font-mono uppercase">EPISODIC</SelectItem>
              <SelectItem value="semantic" className="text-[10px] font-mono uppercase">SEMANTIC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Add tag..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              className="h-11 pl-9 bg-white/2 border-white/5 rounded-xl text-[11px] focus-visible:ring-emerald-500/50"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={suggestTags}
            disabled={suggestingTags}
            className="h-11 px-4 gap-2 bg-emerald-500/5 border-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase tracking-wider rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
          >
            {suggestingTags ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">AI Synthesis</span>
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
              <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/5">
                <span className="text-[9px] font-mono text-emerald-500/40 uppercase tracking-widest w-full mb-1">Synthesized Proposals:</span>
                {suggestedTags.map(t => (
                  <Badge
                    key={t}
                    className="cursor-pointer bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-none rounded-lg font-mono text-[10px] px-2.5 py-1 transition-all"
                    onClick={() => acceptTag(t)}
                  >
                    + {t}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <motion.div 
                  key={t} 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Badge className="bg-white/5 hover:bg-white/10 text-white/50 border-none rounded-lg px-2.5 py-1 text-[10px] font-mono flex items-center gap-2 transition-all group">
                    #{t}
                    <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="text-white/20 hover:text-emerald-400 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 bg-emerald-500 text-black hover:bg-emerald-400 font-bold uppercase tracking-[0.2em] text-[12px] rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] disabled:opacity-50" 
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Memory"}
      </Button>
    </motion.form>
  );
}
