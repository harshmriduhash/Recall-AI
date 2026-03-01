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
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between border-b border-border px-3 md:px-4 py-2.5 shrink-0"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-sm hidden sm:block">Recall</span>
          </Link>
          <DemoDataLoader />
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowHelp(true)} title="Help">
            <HelpCircle className="h-4 w-4" />
          </Button>
          {!isMobile && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowLeft(!showLeft)}>
                {showLeft ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowRight(!showRight)}>
                {showRight ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
              </Button>
            </>
          )}
          <span className="text-xs text-muted-foreground hidden md:block truncate max-w-[120px]">{user?.email}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </motion.header>

      {/* Mobile bottom nav */}
      {isMobile && (
        <div className="order-last border-t border-border bg-card/80 backdrop-blur-sm flex shrink-0">
          {[
            { id: "timeline" as const, icon: Clock, label: "Timeline" },
            { id: "main" as const, icon: MessageSquare, label: "Chat" },
            { id: "insights" as const, icon: BarChart3, label: "Insights" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
                mobileTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Three-panel layout (desktop) / Single panel (mobile) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Timeline */}
        <AnimatePresence>
          {(isMobile ? mobileTab === "timeline" : showLeft) && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`${isMobile ? "w-full" : "w-72"} shrink-0 border-r border-border bg-card/30`}
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
          <main className="flex-1 flex flex-col min-w-0">
            <Tabs defaultValue="chat" className="flex flex-1 flex-col">
              <div className="border-b border-border px-3 md:px-4">
                <TabsList className="bg-transparent h-10">
                  <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-secondary text-xs md:text-sm">
                    <MessageSquare className="h-3.5 w-3.5" /> Chat
                  </TabsTrigger>
                  <TabsTrigger value="add" className="gap-2 data-[state=active]:bg-secondary text-xs md:text-sm">
                    <Plus className="h-3.5 w-3.5" /> Add Memory
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="chat" className="flex-1 m-0">
                <ChatPanel onInspectorUpdate={setInspectorData} />
              </TabsContent>
              <TabsContent value="add" className="flex-1 m-0 p-3 md:p-4">
                <div className="mx-auto max-w-lg">
                  <h2 className="text-lg font-semibold mb-4">Add New Memory</h2>
                  <AddMemoryForm
                    onSubmit={(data) => addMemory.mutate(data)}
                    isSubmitting={addMemory.isPending}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </main>
        )}

        {/* Right: Insights */}
        <AnimatePresence>
          {(isMobile ? mobileTab === "insights" : showRight) && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={`${isMobile ? "w-full" : "w-72"} shrink-0 border-l border-border bg-card/30`}
            >
              <div className="border-b border-border p-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Insights</h2>
              </div>
              <InsightsPanel memories={memories} inspectorData={inspectorData} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Memory detail drawer */}
      <Sheet open={!!selectedMemory && !isEditing} onOpenChange={(open) => { if (!open) { setSelectedMemory(null); setIsEditing(false); } }}>
        <SheetContent className="sm:max-w-lg w-[90vw]">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle>{selectedMemory?.title}</SheetTitle>
                <SheetDescription>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="outline">{selectedMemory?.type}</Badge>
                    <Badge variant="outline">{selectedMemory?.memory_layer}</Badge>
                    {selectedMemory && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(selectedMemory.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </SheetDescription>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          <ScrollArea className="mt-4 h-[calc(100vh-140px)]">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
              {selectedMemory?.content}
            </div>
            {selectedMemory?.tags && selectedMemory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {selectedMemory.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Edit memory dialog */}
      <Dialog open={isEditing && !!selectedMemory} onOpenChange={(open) => { if (!open) setIsEditing(false); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle>Edit Memory</DialogTitle>
            <DialogDescription>Update your memory details</DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

      {/* Help dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-lg w-[95vw]">
          <DialogHeader>
            <DialogTitle>How to use Recall</DialogTitle>
            <DialogDescription>Your second brain for developers</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Adding Memories</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Click "Add Memory" tab to create a new memory</li>
                  <li>Use voice input (mic icon) - works in Chrome/Edge on HTTPS</li>
                  <li>Upload .md or .txt files using the upload icon</li>
                  <li>Choose type and layer, then add tags</li>
                  <li>AI will auto-suggest tags based on your content</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Chat with Your Memories</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ask questions about your stored memories</li>
                  <li>The AI uses only YOUR memories as context</li>
                  <li>Check the Memory Inspector to see which memories were used</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Search & Filter</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Use the search box to find memories by title, content, or tags</li>
                  <li>Filter by type or memory layer</li>
                </ul>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Tip:</strong> Use "Load Demo Data" to try the app with example memories!
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
