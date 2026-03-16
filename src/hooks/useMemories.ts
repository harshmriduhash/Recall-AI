import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/react";
import type { Memory, MemoryType, MemoryLayer } from "@/types/memory";
import { toast } from "sonner";

export function useMemories() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["memories", user?.id],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch("/api/memories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch memories");
      return response.json() as Promise<Memory[]>;
    },
    enabled: !!user,
  });

  const addMemory = useMutation({
    mutationFn: async (memory: { title: string; content: string; type: MemoryType; memory_layer: MemoryLayer; tags: string[] }) => {
      const token = await getToken();
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memory),
      });
      if (!response.ok) throw new Error("Failed to save memory");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory saved!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMemory = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; content?: string; type?: MemoryType; memory_layer?: MemoryLayer; tags?: string[] }) => {
      const token = await getToken();
      const response = await fetch("/api/memories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error("Failed to update memory");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMemory = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const response = await fetch(`/api/memories?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete memory");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { memories: query.data ?? [], isLoading: query.isLoading, addMemory, updateMemory, deleteMemory };
}
