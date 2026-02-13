import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMemories } from "@/hooks/useMemories";
import { MemoryTimeline } from "@/components/dashboard/MemoryTimeline";
import { AddMemoryForm } from "@/components/dashboard/AddMemoryForm";
import { ChatPanel } from "@/components/dashboard/ChatPanel";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { DemoDataLoader } from "@/components/dashboard/DemoDataLoader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, LogOut, MessageSquare, Plus, PanelLeftClose, PanelLeft, PanelRightClose, PanelRight } from "lucide-react";
import { Memory, MemoryInspectorData } from "@/types/memory";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { memories, isLoading, addMemory, deleteMemory } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [inspectorData, setInspectorData] = useState<MemoryInspectorData | null>(null);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">HMS</span>
          <DemoDataLoader />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowLeft(!showLeft)}>
            {showLeft ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowRight(!showRight)}>
            {showRight ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </Button>
          <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Three-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Timeline */}
        {showLeft && (
          <aside className="w-72 shrink-0 border-r border-border bg-card/30">
            <MemoryTimeline
              memories={memories}
              selectedId={selectedMemory?.id}
              onSelect={setSelectedMemory}
              onDelete={(id) => deleteMemory.mutate(id)}
            />
          </aside>
        )}

        {/* Center: Chat/Add */}
        <main className="flex-1 flex flex-col min-w-0">
          <Tabs defaultValue="chat" className="flex flex-1 flex-col">
            <div className="border-b border-border px-4">
              <TabsList className="bg-transparent h-10">
                <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-secondary">
                  <MessageSquare className="h-3.5 w-3.5" /> Chat
                </TabsTrigger>
                <TabsTrigger value="add" className="gap-2 data-[state=active]:bg-secondary">
                  <Plus className="h-3.5 w-3.5" /> Add Memory
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="chat" className="flex-1 m-0">
              <ChatPanel onInspectorUpdate={setInspectorData} />
            </TabsContent>
            <TabsContent value="add" className="flex-1 m-0 p-4">
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

        {/* Right: Insights */}
        {showRight && (
          <aside className="w-72 shrink-0 border-l border-border bg-card/30">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Insights</h2>
            </div>
            <InsightsPanel memories={memories} inspectorData={inspectorData} />
          </aside>
        )}
      </div>

      {/* Memory detail drawer */}
      <Sheet open={!!selectedMemory} onOpenChange={(open) => { if (!open) setSelectedMemory(null); }}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedMemory?.title}</SheetTitle>
            <SheetDescription>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{selectedMemory?.type}</Badge>
                <Badge variant="outline">{selectedMemory?.memory_layer}</Badge>
                {selectedMemory && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedMemory.created_at), { addSuffix: true })}
                  </span>
                )}
              </div>
            </SheetDescription>
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
    </div>
  );
}
