import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getPreferences, updatePreferences, UserPreferences } from "@/api/preferences";
import { toast } from "sonner";

export const usePreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ["preferences", user?.id];

  const query = useQuery({
    queryKey,
    queryFn: () => getPreferences(user?.id as string),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<UserPreferences>) => updatePreferences(user?.id as string, payload),
    onMutate: async (newPreferences) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousPreferences = queryClient.getQueryData<UserPreferences>(queryKey);

      // Optimistically update
      queryClient.setQueryData<UserPreferences>(queryKey, (old) => ({
        ...old,
        ...newPreferences,
        updated_at: new Date().toISOString(),
      }));

      return { previousPreferences };
    },
    onError: (error, _, context) => {
      toast.error(error.message || "Failed to update preferences");
      // Rollback
      if (context?.previousPreferences) {
        queryClient.setQueryData(queryKey, context.previousPreferences);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    preferences: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updatePreferences: mutation.mutate,
    updatePreferencesAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
