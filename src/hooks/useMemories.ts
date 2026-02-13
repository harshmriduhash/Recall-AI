import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Memory, MemoryType, MemoryLayer } from "@/types/memory";
import { toast } from "sonner";

export function useMemories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["memories", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Memory[];
    },
    enabled: !!user,
  });

  const addMemory = useMutation({
    mutationFn: async (memory: { title: string; content: string; type: MemoryType; memory_layer: MemoryLayer; tags: string[] }) => {
      const { error } = await supabase.from("memories").insert({ ...memory, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory saved!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMemory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("memories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { memories: query.data ?? [], isLoading: query.isLoading, addMemory, deleteMemory };
}
