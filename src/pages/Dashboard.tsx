import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMemories } from "@/hooks/useMemories";
import { useIsMobile } from "@/hooks/use-mobile";
import { MemoryTimeline } from "@/components/dashboard/MemoryTimeline";
import { AddMemoryForm } from "@/components/dashboard/AddMemoryForm";
import { EditMemoryForm } from "@/components/dashboard/EditMemoryForm";
import { ChatPanel } from "@/components/dashboard/ChatPanel";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { DemoDataLoader } from "@/components/dashboard/DemoDataLoader";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Brain, LogOut, MessageSquare, Plus, PanelLeftClose, PanelLeft, PanelRightClose, PanelRight, Edit, HelpCircle, Clock, BarChart3 } from "lucide-react";
import { Memory, MemoryInspectorData } from "@/types/memory";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { memories, isLoading, addMemory, updateMemory, deleteMemory } = useMemories();
  const isMobile = useIsMobile();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inspectorData, setInspectorData] = useState<MemoryInspectorData | null>(null);
  const [showLeft, setShowLeft] = useState(!isMobile);
  const [showRight, setShowRight] = useState(!isMobile);
  const [showHelp, setShowHelp] = useState(false);
  const [mobileTab, setMobileTab] = useState<"timeline" | "main" | "insights">("main");

  return (
    <PageTransition className="h-screen">
      <div className="flex h-full flex-col bg-[#050505] selection:bg-emerald-500/30">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl px-4 md:px-6 py-3 shrink-0 relative z-30"
        >
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
                <Brain className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="font-semibold text-base hidden sm:block tracking-tight text-white">Recall<span className="text-emerald-500">.ai</span></span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <DemoDataLoader />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-xl text-white/40 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all" 
              onClick={() => setShowHelp(true)} 
              title="Identity Node Help"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </Button>
            
            {!isMobile && (
              <div className="flex items-center gap-1 mx-1 px-1 border-x border-white/5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-9 w-9 rounded-xl transition-all ${showLeft ? "text-emerald-500 bg-emerald-500/5" : "text-white/40 hover:text-white"}`}
                  onClick={() => setShowLeft(!showLeft)}
                >
                  {showLeft ? <PanelLeftClose className="h-4.5 w-4.5" /> : <PanelLeft className="h-4.5 w-4.5" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-9 w-9 rounded-xl transition-all ${showRight ? "text-emerald-500 bg-emerald-500/5" : "text-white/40 hover:text-white"}`}
                  onClick={() => setShowRight(!showRight)}
                >
                  {showRight ? <PanelRightClose className="h-4.5 w-4.5" /> : <PanelRight className="h-4.5 w-4.5" />}
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-3 pl-2">
              <span className="text-xs font-mono text-white/20 hidden lg:block tracking-wider uppercase">{user?.email?.split('@')[0]}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 text-white/40 transition-all" 
                onClick={signOut}
                title="Terminate Session"
              >
                <LogOut className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Mobile bottom nav */}
        {isMobile && (
          <div className="order-last border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl flex shrink-0 relative z-30">
            {[
              { id: "timeline" as const, icon: Clock, label: "Neural Flow" },
              { id: "main" as const, icon: MessageSquare, label: "Interface" },
              { id: "insights" as const, icon: BarChart3, label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${
                  mobileTab === tab.id ? "text-emerald-400" : "text-white/20 hover:text-white/40"
                }`}
              >
                <tab.icon className={`h-4.5 w-4.5 transition-transform duration-300 ${mobileTab === tab.id ? "scale-110" : ""}`} />
                <span>{tab.label}</span>
                {mobileTab === tab.id && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute top-0 h-0.5 w-12 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Three-panel layout */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Left: Timeline */}
          <AnimatePresence>
            {(isMobile ? mobileTab === "timeline" : showLeft) && (
              <motion.aside
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={`${isMobile ? "w-full" : "w-80"} shrink-0 border-r border-white/5 bg-[#080808] flex flex-col`}
              >
                <MemoryTimeline
                  memories={memories}
                  selectedId={selectedMemory?.id}
                  onSelect={(m) => { setSelectedMemory(m); if (isMobile) setMobileTab("main"); }}
                  onDelete={(id) => deleteMemory.mutate(id)}
                  isLoading={isLoading}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Center: Chat/Add */}
          {(isMobile ? mobileTab === "main" : true) && (
            <main className="flex-1 flex flex-col min-w-0 bg-[#050505]">
              <Tabs defaultValue="chat" className="flex flex-1 flex-col">
                <div className="border-b border-white/5 px-6 bg-[#050505]/50 backdrop-blur-md">
                  <TabsList className="bg-transparent h-14 w-full justify-start gap-8">
                    <TabsTrigger 
                      value="chat" 
                      className="gap-2.5 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 text-xs font-mono uppercase tracking-widest transition-all h-full"
                    >
                      <MessageSquare className="h-4 w-4" /> Neural Interface
                    </TabsTrigger>
                    <TabsTrigger 
                      value="add" 
                      className="gap-2.5 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 text-xs font-mono uppercase tracking-widest transition-all h-full"
                    >
                      <Plus className="h-4 w-4" /> Initialize Core
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="chat" className="flex-1 m-0 overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_40%)]">
                  <ChatPanel onInspectorUpdate={setInspectorData} />
                </TabsContent>
                <TabsContent value="add" className="flex-1 m-0 p-8 overflow-y-auto">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-2xl"
                  >
                    <div className="mb-10">
                      <h2 className="text-2xl font-bold text-white mb-2">Memory Initialization</h2>
                      <p className="text-white/40 font-light">Input data into your cognitive cluster.</p>
                    </div>
                    <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-2xl">
                    <AddMemoryForm
                      onSubmit={(data) => addMemory.mutate(data)}
                      isSubmitting={addMemory.isPending}
                    />
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </main>
          )}

          {/* Right: Insights */}
          <AnimatePresence>
            {(isMobile ? mobileTab === "insights" : showRight) && (
              <motion.aside
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className={`${isMobile ? "w-full" : "w-80"} shrink-0 border-l border-white/5 bg-[#080808] flex flex-col`}
              >
                <div className="border-b border-white/5 p-6 flex justify-between items-center bg-[#080808]/80 backdrop-blur-md">
                  <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">Cognitive Insights</h2>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <InsightsPanel memories={memories} inspectorData={inspectorData} />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* Memory detail drawer */}
        <Sheet open={!!selectedMemory && !isEditing} onOpenChange={(open) => { if (!open) { setSelectedMemory(null); setIsEditing(false); } }}>
          <SheetContent className="sm:max-w-2xl w-[95vw] bg-[#080808] border-white/10 p-0 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-8 border-b border-white/5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-4">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider">{selectedMemory?.type}</Badge>
                      <Badge className="bg-white/5 text-white/40 border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider">{selectedMemory?.memory_layer}</Badge>
                    </div>
                    <SheetTitle className="text-3xl font-bold text-white tracking-tight leading-tight">{selectedMemory?.title}</SheetTitle>
                    <div className="flex items-center gap-2 mt-4 text-white/20 font-mono text-[10px] uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      {selectedMemory && formatDistanceToNow(new Date(selectedMemory.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 rounded-2xl bg-white/2 border border-white/5 hover:border-emerald-500/50 hover:text-emerald-400 transition-all group" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-8">
                <div className="prose prose-sm prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-white/70 font-light text-base leading-relaxed selection:bg-emerald-500/30">
                    {selectedMemory?.content}
                  </div>
                </div>
                {selectedMemory?.tags && selectedMemory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/5">
                    {selectedMemory.tags.map(t => (
                      <Badge key={t} className="bg-white/5 hover:bg-white/10 text-white/40 rounded-lg px-3 py-1 text-xs transition-colors border-none cursor-default">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              <div className="p-8 border-t border-white/5 bg-[#050505]/50 flex justify-between items-center font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
                <span>Neural Context Loaded</span>
                <span className="text-emerald-500/50">Rec_v4.5</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit memory dialog - Similar premium treatment */}
        <Dialog open={isEditing && !!selectedMemory} onOpenChange={(open) => { if (!open) setIsEditing(false); }}>
          <DialogContent className="sm:max-w-3xl bg-[#080808] border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
            <div className="p-8 border-b border-white/5">
              <DialogTitle className="text-2xl font-bold text-white mb-2">Refine Cognitive Link</DialogTitle>
              <DialogDescription className="text-white/40 font-light">Update the parameters of this existing memory fragment.</DialogDescription>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {selectedMemory && (
                <EditMemoryForm
                  memory={selectedMemory}
                  onSubmit={(data) => {
                    updateMemory.mutate(data, {
                      onSuccess: () => { setIsEditing(false); setSelectedMemory(null); },
                    });
                  }}
                  onCancel={() => setIsEditing(false)}
                  isSubmitting={updateMemory.isPending}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Help dialog - Premium Knowledge Base treatment */}
        <Dialog open={showHelp} onOpenChange={setShowHelp}>
          <DialogContent className="sm:max-w-2xl bg-[#080808] border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
            <div className="p-8 border-b border-white/5 bg-emerald-500/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                  <HelpCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Neural Repository Protocol</DialogTitle>
                  <DialogDescription className="text-emerald-500/50 font-mono text-[10px] uppercase tracking-widest mt-1">Version 4.0.2 // Documentation</DialogDescription>
                </div>
              </div>
            </div>
            <ScrollArea className="max-h-[60vh] p-8">
              <div className="space-y-12">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-white/5" />
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-500">Core Initialization</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/2 border border-white/5 p-5 rounded-2xl">
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <Plus className="h-3.5 w-3.5 text-emerald-500" /> Addition
                      </h4>
                      <p className="text-white/40 text-xs leading-relaxed">Initialize new memory fragments via text, markdown, or secure voice uplink.</p>
                    </div>
                    <div className="bg-white/2 border border-white/5 p-5 rounded-2xl">
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <Mic className="h-3.5 w-3.5 text-emerald-500" /> Voice Sync
                      </h4>
                      <p className="text-white/40 text-xs leading-relaxed">Integrated voice-to-cognition processing for rapid thought capture.</p>
                    </div>
                  </div>
                </section>
                
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-white/5" />
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-500">Retrieval Interface</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-white/30 text-sm font-light">The neural interface allows natural language querying of your cognitive cluster. The system uses deterministic retrieval to ensure 100% accuracy from YOUR data alone.</p>
                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <p className="text-emerald-500/70 text-[11px] font-mono tracking-tight underline">PRO-TIP: Check the Brain Inspector to see exactly which fragments were retrieved to form an AI response.</p>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
            <div className="p-8 border-t border-white/5 text-center">
              <p className="text-white/10 font-mono text-[9px] uppercase tracking-[0.4em]">Recall Intelligence Systems // Void_Protocol_Active</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
