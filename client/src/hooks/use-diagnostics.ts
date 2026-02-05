import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Types derived from route definitions via Zod inference would be ideal, 
// but we will stick to the manual types exported from schema for simplicity in usage
// or inference where possible.
import type { DiagnoseRequest, DiagnoseResponse, HealthResponse } from "@shared/schema";
import { z } from "zod";

export function useHealth() {
  return useQuery({
    queryKey: [api.health.check.path],
    queryFn: async () => {
      const res = await fetch(api.health.check.path);
      if (!res.ok) throw new Error("Health check failed");
      return api.health.check.responses[200].parse(await res.json());
    },
    refetchInterval: 30000, // Poll every 30s
  });
}

export function useHistory() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: [api.diagnostics.list.path, userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      const url = buildUrl(api.diagnostics.list.path, { userId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.diagnostics.list.responses[200].parse(await res.json());
    },
  });
}

export function useDiagnose() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<DiagnoseRequest, 'user_id'> | FormData) => {
      if (!userId) throw new Error("User not authenticated");

      let body: string | FormData;
      let headers: Record<string, string> = {};

      if (data instanceof FormData) {
        data.append("user_id", userId);
        if (!data.has("session_id")) {
          data.append("session_id", crypto.randomUUID());
        }
        // Do not set Content-Type for FormData, browser sets it with boundary
        body = data;
      } else {
        const payload = { ...data, session_id: data.session_id || crypto.randomUUID(), user_id: userId };
        // Validate input before sending (only for JSON)
        const validated = api.diagnostics.create.input.parse(payload);
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(validated);
      }

      const res = await fetch(api.diagnostics.create.path, {
        method: api.diagnostics.create.method,
        headers,
        body,
      });

      if (!res.ok) {
        // Try to parse error message
        try {
          const errorData = await res.json();
          throw new Error(errorData.message || "Diagnosis failed");
        } catch (e) {
          throw new Error("Failed to generate diagnosis");
        }
      }

      return api.diagnostics.create.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [api.diagnostics.list.path, userId] });
      }
      toast({
        title: "Diagnosis Complete",
        description: "Your explanation has been analyzed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Diagnosis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteDiagnostic() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      // api.diagnostics.delete.path is /api/diagnostic/:id
      const url = buildUrl(api.diagnostics.delete.path, { id });
      const res = await fetch(url, { method: api.diagnostics.delete.method });
      if (!res.ok) throw new Error("Failed to delete diagnostic");
      return res.json();
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [api.diagnostics.list.path, userId] });
      }
      toast({
        title: "Deleted",
        description: "Diagnostic removed from history.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
