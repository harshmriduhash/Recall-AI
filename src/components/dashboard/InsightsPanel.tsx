import { Memory, MemoryInspectorData } from "@/types/memory";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Layers, BarChart3, Eye, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  memories: Memory[];
  inspectorData: MemoryInspectorData | null;
}

export function InsightsPanel({ memories, inspectorData }: Props) {
  const typeCounts = memories.reduce<Record<string, number>>((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {});

  const layerCounts = memories.reduce<Record<string, number>>((acc, m) => {
    acc[m.memory_layer] = (acc[m.memory_layer] || 0) + 1;
    return acc;
  }, {});

  const topTags = memories
    .flatMap(m => m.tags || [])
    .reduce<Record<string, number>>((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});

  const sortedTags = Object.entries(topTags).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const layerBarColors: Record<string, string> = {
    semantic: "bg-emerald-500",
    episodic: "bg-emerald-500/50",
    working: "bg-emerald-500/20",
  };

  return (
    <ScrollArea className="h-full scrollbar-thin">
      <div className="p-6 space-y-10">
        {/* Stats Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Repository Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Nodes" value={memories.length} />
            {Object.entries(typeCounts).map(([type, count]) => (
              <StatCard key={type} label={type} value={count} />
            ))}
          </div>
        </section>

        {/* Cognitive Layers */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Cognitive Layers</h3>
          </div>
          <div className="space-y-6">
            {(["semantic", "episodic", "working"] as const).map((layer, i) => {
              const count = layerCounts[layer] || 0;
              const pct = memories.length > 0 ? (count / memories.length) * 100 : 0;
              return (
                <motion.div
                  key={layer}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono uppercase tracking-wider">
                    <span className="text-white/60">{layer}</span>
                    <span className="text-emerald-500/80">{count}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${layerBarColors[layer]} shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Neural Tags */}
        {sortedTags.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Active Tag Cloud</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {sortedTags.map(([tag, count]) => (
                <Badge key={tag} className="bg-white/2 hover:bg-white/5 text-[10px] text-white/40 border border-white/5 rounded-lg px-2.5 py-1 transition-all">
                  #{tag} <span className="ml-1 text-emerald-500/50">{count}</span>
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Core Insights */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Neural Synthesis</h3>
          </div>
          {memories.length < 3 ? (
            <div className="p-4 rounded-2xl bg-white/2 border border-white/5 text-[11px] text-white/20 italic">
              Initialization insufficient. Add more fragments to generate high-fidelity insights.
            </div>
          ) : (
            <div className="space-y-3">
              <InsightCard text={`Cognitive repository contains ${memories.length} fragments across ${Object.keys(typeCounts).length} vectors.`} />
              {typeCounts.decision && typeCounts.decision > 0 && (
                <InsightCard text={`${typeCounts.decision} architectural decisions indexed. Monitor for dependency drift.`} />
              )}
              {!typeCounts.code && <InsightCard text="Source code fragments absent. Index critical logic for better technical context." />}
            </div>
          )}
        </section>

        {/* Memory Inspector - Enhanced */}
        {inspectorData && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-6 border-t border-white/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <Eye className="h-4 w-4 text-emerald-500" />
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Response Grounding</h3>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl mb-6">
              <p className="text-[11px] text-emerald-400/70 font-light leading-relaxed italic">"{inspectorData.reasoning}"</p>
            </div>
            <div className="space-y-2">
              {inspectorData.retrievedMemories.map(mem => (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl bg-white/2 border border-white/5 p-3 group hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-[11px] font-medium text-white/70 truncate">{mem.title}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] px-1.5 py-0 rounded-md uppercase font-mono">{mem.layer}</Badge>
                  </div>
                  <div className="h-0.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${mem.relevance * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </ScrollArea>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, border: "rgba(16,185,129,0.3)" }}
      className="rounded-2xl bg-white/2 border border-white/5 p-4 transition-all duration-300"
    >
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest truncate">{label}</p>
    </motion.div>
  );
}

function InsightCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/2 p-4 text-[11px] text-white/50 font-light leading-relaxed hover:bg-white/4 transition-colors group">
      <span className="text-emerald-500/50 mr-2 group-hover:text-emerald-400 transition-colors">⚡</span> {text}
    </div>
  );
}
