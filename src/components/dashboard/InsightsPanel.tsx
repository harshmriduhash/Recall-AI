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
    semantic: "bg-destructive",
    episodic: "bg-accent",
    working: "bg-primary",
  };

  return (
    <ScrollArea className="h-full scrollbar-thin">
      <div className="p-4 space-y-6">
        {/* Stats */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5" /> Memory Stats
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Total" value={memories.length} />
            {Object.entries(typeCounts).map(([type, count]) => (
              <StatCard key={type} label={type} value={count} />
            ))}
          </div>
        </section>

        {/* Layer Visualization */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" /> Memory Layers
          </h3>
          <div className="space-y-3">
            {(["semantic", "episodic", "working"] as const).map((layer, i) => {
              const count = layerCounts[layer] || 0;
              const pct = memories.length > 0 ? (count / memories.length) * 100 : 0;
              return (
                <motion.div
                  key={layer}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="capitalize font-medium">{layer}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${layerBarColors[layer]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Tags */}
        {sortedTags.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {sortedTags.map(([tag, count]) => (
                <Badge key={tag} variant="outline" className="text-xs border-border/30 hover:border-primary/30 transition-colors cursor-default">
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* AI Insights */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5" /> AI Insights
          </h3>
          {memories.length < 3 ? (
            <p className="text-xs text-muted-foreground">Add at least 3 memories to generate insights.</p>
          ) : (
            <div className="space-y-2">
              <InsightCard text={`You have ${memories.length} memories across ${Object.keys(typeCounts).length} categories.`} />
              {typeCounts.decision && typeCounts.decision > 0 && (
                <InsightCard text={`${typeCounts.decision} decisions documented. Consider adding outcomes for each.`} />
              )}
              {!typeCounts.code && <InsightCard text="No code snippets yet. Try saving important code patterns." />}
            </div>
          )}
        </section>

        {/* Memory Inspector */}
        {inspectorData && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-primary" /> Memory Inspector
            </h3>
            <p className="text-xs text-muted-foreground mb-2">{inspectorData.reasoning}</p>
            <div className="space-y-1.5">
              {inspectorData.retrievedMemories.map(mem => (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg bg-secondary/30 border border-border/20 p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{mem.title}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">{mem.layer}</Badge>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${mem.relevance * 100}%` }}
                      transition={{ duration: 0.5 }}
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-secondary/30 border border-border/20 p-3 hover:border-primary/20 transition-colors duration-200"
    >
      <p className="text-lg font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground capitalize">{label}</p>
    </motion.div>
  );
}

function InsightCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border/20 bg-card/30 p-3 text-xs text-muted-foreground hover:border-primary/20 transition-colors duration-200">
      <span className="text-primary mr-1">💡</span> {text}
    </div>
  );
}
