import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

// ─── HOTELS ───────────────────────────────────────────
router.post('/hotels/search', async (req, res) => {
  const { destination, checkIn, checkOut, adults = 1 } = req.body;
  try {
    // Step 1: get destination ID
    const locRes = await fetch(
      `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${encodeURIComponent(destination)}&locale=en-gb`,
      { headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'booking-com.p.rapidapi.com' } }
    );
    const locData = await locRes.json() as any;
    const destId = locData[0]?.dest_id;
    const destType = locData[0]?.dest_type;
    if (!destId) return res.json({ hotels: [] });

    // Step 2: search hotels
    const params = new URLSearchParams({
      dest_id: destId, dest_type: destType,
      checkin_date: checkIn, checkout_date: checkOut,
      adults_number: adults.toString(),
      order_by: 'popularity', locale: 'en-gb', filter_by_currency: 'USD',
      room_number: '1', units: 'metric'
    });
    const hotRes = await fetch(
      `https://booking-com.p.rapidapi.com/v1/hotels/search?${params}`,
      { headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'booking-com.p.rapidapi.com' } }
    );
    const hotData = await hotRes.json() as any;
    console.log("[DEBUG] hotData keys:", Object.keys(hotData));
    if (hotData.message) console.log("[DEBUG] API Message:", hotData.message);
    if (hotData.detail) console.log("[DEBUG] API Error Detail:", JSON.stringify(hotData.detail));
    console.log("[DEBUG] number of results:", hotData.result?.length);
    const hotels = (hotData.result || []).slice(0, 20).map((h: any) => ({
      id: h.hotel_id,
      name: h.hotel_name,
      stars: h.class,
      price: h.min_total_price,
      currency: h.currency_code,
      image: h.main_photo_url?.replace('square60', 'square300'),
      address: h.address,
      city: h.city,
      rating: h.review_score,
      ratingWord: h.review_score_word,
      reviewCount: h.review_nr,
      url: h.url,
    }));
    res.json({ hotels });
  } catch (err) {
    res.status(500).json({ error: 'Hotel search failed' });
  }
});

// ─── FLIGHTS ──────────────────────────────────────────
router.post('/flights/search', async (req, res) => {
  const { origin, destination, date, adults = 1 } = req.body;
  try {
    const bHeaders = { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'booking-com.p.rapidapi.com' };

    // Step 1: resolve origin airport code
    const [origRes, destRes] = await Promise.all([
      fetch(`https://booking-com.p.rapidapi.com/v1/flights/locations?name=${encodeURIComponent(origin)}&locale=en-gb`, { headers: bHeaders }),
      fetch(`https://booking-com.p.rapidapi.com/v1/flights/locations?name=${encodeURIComponent(destination)}&locale=en-gb`, { headers: bHeaders }),
    ]);
    const origData = await origRes.json() as any;
    const destData = await destRes.json() as any;

    // Prefer AIRPORT type, fall back to first result
    const pickCode = (arr: any[]) => (arr.find((x: any) => x.type === 'AIRPORT') || arr[0])?.code;
    const fromCode = pickCode(Array.isArray(origData) ? origData : []);
    const toCode   = pickCode(Array.isArray(destData)  ? destData  : []);

    if (!fromCode || !toCode) return res.json({ flights: [] });

    // Step 2: search flights
    const params = new URLSearchParams({
      locale: 'en-gb', currency: 'USD', order_by: 'BEST',
      flight_type: 'ONEWAY', cabin_class: 'ECONOMY',
      from_code: fromCode, to_code: toCode,
      depart_date: date, adults: adults.toString(),
    });
    const flightRes = await fetch(`https://booking-com.p.rapidapi.com/v1/flights/search?${params}`, { headers: bHeaders });
    const flightData = await flightRes.json() as any;

    const raw: any[] = flightData?.flightOffers || flightData?.aggregation?.stops?.flatMap((_: any) => []) || [];
    // The real shape has flightOffers array
    const offers: any[] = flightData?.flightOffers ?? [];
    const flights = offers.slice(0, 20).map((o: any) => {
      const seg = o.segments?.[0];
      const leg = seg?.legs?.[0];
      return {
        id: o.token || leg?.departureAirport?.code + leg?.arrivalAirport?.code,
        price: o.priceBreakdown?.total?.units ?? 0,
        currency: o.priceBreakdown?.total?.currencyCode ?? 'USD',
        priceFormatted: `$${o.priceBreakdown?.total?.units ?? 0}`,
        airline: leg?.carriersData?.[0]?.name ?? 'Unknown',
        airlineLogo: leg?.carriersData?.[0]?.logo ?? '',
        departure: leg?.departureTime,
        arrival: leg?.arrivalTime,
        duration: seg?.totalTime ? Math.round(seg.totalTime / 60) : 0,
        stops: (seg?.legs?.length ?? 1) - 1,
        origin: leg?.departureAirport?.code,
        destination: seg?.legs?.at(-1)?.arrivalAirport?.code,
        deepLink: `https://www.booking.com/flights`,
      };
    });
    res.json({ flights });
  } catch (err) {
    console.error('[flights]', err);
    res.status(500).json({ error: 'Flight search failed' });
  }
});

// ─── ACTIVITIES ───────────────────────────────────────
router.post('/activities/search', async (req, res) => {
  const { destination, checkIn, checkOut } = req.body;
  try {
    const bHeaders = { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'booking-com.p.rapidapi.com' };

    // Step 1: get destination ID (reuse hotels locations endpoint)
    const locRes = await fetch(
      `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${encodeURIComponent(destination)}&locale=en-gb`,
      { headers: bHeaders }
    );
    const locData = await locRes.json() as any;
    const destId = locData[0]?.dest_id;
    if (!destId) return res.json({ activities: [] });

    // Step 2: search attractions using v2 endpoint
    const startDate = checkIn || new Date().toISOString().split('T')[0];
    const endDate   = checkOut || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const params = new URLSearchParams({
      dest_id: destId,
      locale: 'en-gb',
      currency: 'USD',
      order_by: 'SCORE',
      start_date: startDate,
      end_date: endDate,
    });
    const attRes = await fetch(
      `https://booking-com.p.rapidapi.com/v2/attractions/search?${params}`,
      { headers: bHeaders }
    );
    const attData = await attRes.json() as any;
    console.log('[DEBUG] attractions keys:', Object.keys(attData));

    const rawActs: any[] = attData?.products ?? attData?.attractions ?? attData?.data ?? [];
    const activities = rawActs.slice(0, 20).map((a: any) => ({
      id: a.id ?? a.productId,
      name: a.name ?? a.title,
      description: a.shortDescription ?? a.description ?? '',
      price: a.representativePrice?.chargeAmount ?? a.price?.value ?? 0,
      currency: a.representativePrice?.currency ?? a.price?.currency ?? 'USD',
      image: a.primaryPhoto?.small ?? a.photos?.[0]?.small ?? '',
      rating: a.reviewsStats?.combinedNumericStats?.average ?? a.rating ?? 0,
      reviewCount: a.reviewsStats?.allReviewsCount ?? a.reviewCount ?? 0,
      duration: a.durationRange?.upperDuration ? `${a.durationRange.upperDuration} min` : '',
      url: `https://www.booking.com/attractions`,
    }));
    res.json({ activities });
  } catch (err) {
    console.error('[activities]', err);
    res.status(500).json({ error: 'Activity search failed' });
  }
});

// ─── SAVE BOOKING ─────────────────────────────────────
router.post('/save', async (req, res) => {
  const { type, tripId, itemName, itemData, priceAmount, priceCurrency, checkIn, checkOut } = req.body;
  const userId = (req as any).user.id;
  const { data, error } = await supabase.from('bookings').insert({
    user_id: userId, trip_id: tripId || null,
    type, item_name: itemName, item_data: itemData,
    price_amount: priceAmount, price_currency: priceCurrency || 'USD',
    check_in: checkIn || null, check_out: checkOut || null,
    status: 'saved'
  }).select().single();
  if (error) return res.status(500).json({ error });
  res.json({ booking: data });
});

// ─── GET MY BOOKINGS ──────────────────────────────────
router.get('/', async (req, res) => {
  const userId = (req as any).user.id;
  const { data, error } = await supabase.from('bookings')
    .select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error });
  res.json({ bookings: data });
});

// ─── DELETE BOOKING ───────────────────────────────────
router.delete('/:id', async (req, res) => {
  const userId = (req as any).user.id;
  const { error } = await supabase.from('bookings')
    .delete().eq('id', req.params.id).eq('user_id', userId);
  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});

// ─── PRICE ALERTS ─────────────────────────────────────
router.post('/alerts', async (req, res) => {
  const { type, tripId, itemName, itemSnapshot, targetPrice, currentPrice } = req.body;
  const userId = (req as any).user.id;
  const { data, error } = await supabase.from('price_alerts').insert({
    user_id: userId, trip_id: tripId || null,
    type, item_name: itemName, item_snapshot: itemSnapshot,
    target_price: targetPrice, current_price: currentPrice
  }).select().single();
  if (error) return res.status(500).json({ error });
  res.json({ alert: data });
});

router.get('/alerts', async (req, res) => {
  const userId = (req as any).user.id;
  const { data, error } = await supabase.from('price_alerts')
    .select('*').eq('user_id', userId).eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error });
  res.json({ alerts: data });
});

router.delete('/alerts/:id', async (req, res) => {
  const userId = (req as any).user.id;
  const { error } = await supabase.from('price_alerts')
    .update({ is_active: false }).eq('id', req.params.id).eq('user_id', userId);
  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});

export default router;
