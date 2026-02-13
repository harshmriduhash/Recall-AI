export type MemoryType = "note" | "code" | "decision" | "conversation";
export type MemoryLayer = "working" | "episodic" | "semantic";

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  content: string;
  type: MemoryType;
  memory_layer: MemoryLayer;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface MemoryInspectorData {
  retrievedMemories: { id: string; title: string; layer: MemoryLayer; relevance: number }[];
  reasoning: string;
}
