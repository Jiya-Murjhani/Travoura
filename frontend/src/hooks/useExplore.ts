import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchRecommended,
  fetchDestinations,
  fetchSeasonalData,
  fetchWishlist,
  saveToWishlist,
  removeFromWishlist,
} from '@/api/explore';
import { toast } from 'sonner';

// ─── useRecommended ────────────────────────────────────────────────
export const useRecommended = () => {
  const { session } = useAuth();
  const token = session?.access_token;

  return useQuery({
    queryKey: ['explore', 'recommended'],
    queryFn: () => fetchRecommended(token as string),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── useDestinations ───────────────────────────────────────────────
export const useDestinations = (tag?: string) => {
  const { session } = useAuth();
  const token = session?.access_token ?? null;

  return useQuery({
    queryKey: ['explore', 'destinations', tag],
    queryFn: () => fetchDestinations(token, tag),
    staleTime: 1000 * 60 * 5,
  });
};

// ─── useSeasonalData ───────────────────────────────────────────────
export const useSeasonalData = (destinationId: string | null) => {
  return useQuery({
    queryKey: ['explore', 'seasonal', destinationId],
    queryFn: () => fetchSeasonalData(destinationId as string),
    enabled: !!destinationId,
    staleTime: 1000 * 60 * 10,
  });
};

// ─── useWishlist ───────────────────────────────────────────────────
export const useWishlist = () => {
  const { session } = useAuth();
  const token = session?.access_token;

  return useQuery({
    queryKey: ['explore', 'wishlist'],
    queryFn: () => fetchWishlist(token as string),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── useToggleWishlist ─────────────────────────────────────────────
export const useToggleWishlist = () => {
  const { session } = useAuth();
  const token = session?.access_token;
  const queryClient = useQueryClient();

  const wishlistKey = ['explore', 'wishlist'];

  return useMutation({
    mutationFn: async ({ destinationId, saved }: { destinationId: string; saved: boolean }) => {
      if (!token) throw new Error('Not authenticated');
      if (saved) {
        await removeFromWishlist(token, destinationId);
      } else {
        await saveToWishlist(token, destinationId);
      }
    },
    onMutate: async ({ destinationId, saved }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: wishlistKey });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData<string[]>(wishlistKey);

      // Optimistically update
      queryClient.setQueryData<string[]>(wishlistKey, (old) => {
        const current = old ?? [];
        if (saved) {
          return current.filter((id) => id !== destinationId);
        } else {
          return [...current, destinationId];
        }
      });

      return { previousWishlist };
    },
    onError: (error, _variables, context) => {
      toast.error(error.message || 'Failed to update wishlist');
      // Rollback
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKey, context.previousWishlist);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: wishlistKey });
    },
  });
};
