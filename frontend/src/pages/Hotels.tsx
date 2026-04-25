import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { searchHotels, saveBooking, createAlert } from '@/api/bookings';
import { toast } from 'sonner';

export default function Hotels() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';
  const [form, setForm] = useState({ destination: '', checkIn: '', checkOut: '', adults: 1 });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [watched, setWatched] = useState<Set<string>>(new Set());

  const search = async () => {
    if (!form.destination || !form.checkIn || !form.checkOut) {
      toast.error('Please fill in destination and dates'); return;
    }
    setLoading(true);
    const data = await searchHotels({ destination: form.destination, checkIn: form.checkIn, checkOut: form.checkOut, adults: form.adults }, token);
    setResults(data.hotels || []);
    setLoading(false);
    if (!data.hotels?.length) toast.info('No hotels found for this search');
  };

  const handleSave = async (hotel: any) => {
    await saveBooking({ type: 'hotel', itemName: hotel.name, itemData: hotel, priceAmount: hotel.price, priceCurrency: hotel.currency, checkIn: form.checkIn, checkOut: form.checkOut }, token);
    setSaved(prev => new Set([...prev, hotel.id]));
    toast.success(`${hotel.name} saved to My Bookings`);
  };

  const handleWatch = async (hotel: any) => {
    await createAlert({ type: 'hotel', itemName: hotel.name, itemSnapshot: hotel, targetPrice: hotel.price * 0.9, currentPrice: hotel.price }, token);
    setWatched(prev => new Set([...prev, hotel.id]));
    toast.success('Price alert set — we\'ll notify you if the price drops');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">Find Hotels</h1>

      {/* Search form */}
      <div className="bg-card border rounded-xl p-5 mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2 md:col-span-1">
          <label className="text-xs text-muted-foreground mb-1 block">Destination</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Paris, Tokyo..." value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Check-in</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Check-out</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Adults</label>
          <input type="number" min={1} max={10} className="w-full border rounded-lg px-3 py-2 text-sm" value={form.adults} onChange={e => setForm({ ...form, adults: parseInt(e.target.value) })} />
        </div>
        <button onClick={search} disabled={loading} className="col-span-2 md:col-span-4 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50">
          {loading ? 'Searching...' : 'Search Hotels'}
        </button>
      </div>

      {/* Results */}
      {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map(hotel => (
          <div key={hotel.id} className="bg-card border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            {hotel.image && <img src={hotel.image} alt={hotel.name} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm leading-tight flex-1 mr-2">{hotel.name}</h3>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-medium">${hotel.price?.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">total</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {hotel.stars > 0 && <span className="text-xs bg-secondary px-2 py-0.5 rounded">{hotel.stars}★</span>}
                {hotel.rating && <span className="text-xs text-muted-foreground">{hotel.rating}/10 · {hotel.reviewCount?.toLocaleString()} reviews</span>}
              </div>
              <p className="text-xs text-muted-foreground mb-3 truncate">{hotel.address}</p>
              <div className="flex gap-2">
                <a href={hotel.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-primary text-primary-foreground text-xs py-1.5 rounded-lg hover:opacity-90">View Deal</a>
                <button onClick={() => handleSave(hotel)} disabled={saved.has(hotel.id)} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-secondary disabled:opacity-50">{saved.has(hotel.id) ? '✓ Saved' : 'Save'}</button>
                <button onClick={() => handleWatch(hotel)} disabled={watched.has(hotel.id)} className="px-3 py-1.5 border rounded-lg text-xs hover:bg-secondary disabled:opacity-50">{watched.has(hotel.id) ? '🔔' : '🔕'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
