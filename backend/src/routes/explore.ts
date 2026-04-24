import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../supabaseClient';

const router = Router();

// ─── Scoring helper ────────────────────────────────────────────────
function scoreDestination(
  destination: any,
  prefs: any
): number {
  const userTags: string[] = prefs.interests ?? [];
  const destTags: string[] = destination.tags ?? [];

  const tagOverlap = destTags.filter((t: string) => userTags.includes(t)).length;

  const costMatch =
    prefs.budget_daily_max == null ||
    destination.avg_cost_per_day_usd * 1.2 >= prefs.budget_daily_max;

  const currentMonth = new Date().getMonth() + 1;
  const bestMonths: number[] = destination.best_months ?? [];
  const seasonMatch = bestMonths.includes(currentMonth);

  const score =
    (tagOverlap / Math.max(userTags.length, 1)) * 60 +
    (costMatch ? 20 : 0) +
    (seasonMatch ? 20 : 0);

  return score;
}

// ─── GET /recommended ──────────────────────────────────────────────
router.get('/recommended', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    // Fetch user preferences
    const { data: prefs, error: prefsError } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Fetch all destinations
    const { data: destinations, error: destError } = await supabase
      .from('destinations')
      .select('*');

    if (destError) {
      console.error('Fetch destinations error:', destError);
      res.status(500).json({ success: false, error: 'Failed to fetch destinations' });
      return;
    }

    if (!destinations || destinations.length === 0) {
      res.status(200).json({ success: true, destinations: [] });
      return;
    }

    // No preferences row → return all sorted by rating, matchScore: null
    if (prefsError || !prefs) {
      const sorted = [...destinations]
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 12)
        .map((d) => ({ ...d, matchScore: null }));

      res.status(200).json({ success: true, destinations: sorted });
      return;
    }

    // Score, sort, take top 12
    const scored = destinations
      .map((d) => ({
        ...d,
        matchScore: Math.round(scoreDestination(d, prefs)),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);

    res.status(200).json({ success: true, destinations: scored });
    return;
  } catch (err: any) {
    console.error('Error fetching recommended destinations:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    return;
  }
});

// ─── GET /destinations ─────────────────────────────────────────────
router.get('/destinations', async (req: AuthRequest, res: Response) => {
  try {
    const tag = req.query.tag as string | undefined;

    const { data: destinations, error } = await supabase
      .from('destinations')
      .select('*');

    if (error) {
      console.error('Fetch destinations error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch destinations' });
      return;
    }

    let result = destinations || [];

    if (tag) {
      result = result.filter(
        (d: any) => Array.isArray(d.tags) && d.tags.includes(tag)
      );
    }

    res.status(200).json({ success: true, destinations: result });
    return;
  } catch (err: any) {
    console.error('Error fetching destinations:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    return;
  }
});

// ─── GET /destinations/:id/seasonal ────────────────────────────────
router.get('/destinations/:id/seasonal', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('destination_seasonal_data')
      .select('*')
      .eq('destination_id', id)
      .order('month', { ascending: true });

    if (error) {
      console.error('Fetch seasonal data error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch seasonal data' });
      return;
    }

    res.status(200).json({ success: true, seasonalData: data || [] });
    return;
  } catch (err: any) {
    console.error('Error fetching seasonal data:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    return;
  }
});

// ─── POST /wishlist ────────────────────────────────────────────────
router.post('/wishlist', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const { destinationId } = req.body;
    if (!destinationId) {
      res.status(400).json({ success: false, error: 'destinationId is required' });
      return;
    }

    const { error } = await supabase
      .from('wishlists')
      .upsert(
        { user_id: userId, destination_id: destinationId },
        { onConflict: 'user_id,destination_id' }
      );

    if (error) {
      console.error('Wishlist upsert error:', error);
      res.status(500).json({ success: false, error: 'Failed to save to wishlist' });
      return;
    }

    res.status(200).json({ success: true, saved: true });
    return;
  } catch (err: any) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    return;
  }
});

// ─── DELETE /wishlist/:destinationId ───────────────────────────────
router.delete('/wishlist/:destinationId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const { destinationId } = req.params;

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) {
      console.error('Wishlist delete error:', error);
      res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
      return;
    }

    res.status(200).json({ success: true, saved: false });
    return;
  } catch (err: any) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    return;
  }
});

// ─── GET /wishlist ─────────────────────────────────────────────────
router.get('/wishlist', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'User not authenticated' });
      return;
    }

    const { data, error } = await supabase
      .from('wishlists')
      .select('destination_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Fetch wishlist error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch wishlist' });
      return;
    }

    const ids: string[] = (data || []).map((row: any) => row.destination_id);
    res.status(200).json({ success: true, wishlist: ids });
    return;
  } catch (err: any) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    return;
  }
});

export default router;
