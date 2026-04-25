import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { searchFlights, saveBooking, createAlert } from '@/api/bookings';
import { toast } from 'sonner';

export default function Flights() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';
  const [form, setForm] = useState({ origin: '', destination: '', date: '', returnDate: '', adults: 1 });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [watched, setWatched] = useState<Set<string>>(new Set());

  const search = async () => {
    if (!form.origin || !form.destination || !form.date) { toast.error('Fill in origin, destination and date'); return; }
    setLoading(true);
    const data = await searchFlights(form, token);
    setResults(data.flights || []);
    setLoading(false);
    if (!data.flights?.length) toast.info('No flights found');
  };

  const formatDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

  const handleSave = async (flight: any) => {
    await saveBooking({ type: 'flight', itemName: `${flight.origin} → ${flight.destination}`, itemData: flight, priceAmount: flight.price, priceCurrency: flight.currency }, token);
    setSaved(prev => new Set([...prev, flight.id]));
    toast.success('Flight saved to My Bookings');
  };

  const handleWatch = async (flight: any) => {
    await createAlert({ type: 'flight', itemName: `${flight.origin} → ${flight.destination}`, itemSnapshot: flight, targetPrice: flight.price * 0.9, currentPrice: flight.price }, token);
    setWatched(prev => new Set([...prev, flight.id]));
    toast.success('Price alert set for this flight');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">Search Flights</h1>

      <div className="bg-card border rounded-xl p-5 mb-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">From</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Delhi, Mumbai..." value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">To</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="London, Dubai..." value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Departure</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Return (optional)</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Passengers</label>
          <input type="number" min={1} max={9} className="w-full border rounded-lg px-3 py-2 text-sm" value={form.adults} onChange={e => setForm({ ...form, adults: parseInt(e.target.value) })} />
        </div>
        <button onClick={search} disabled={loading} className="mt-5 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50">
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>

      {loading && <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>}

      <div className="space-y-3">
        {results.map(flight => (
          <div key={flight.id} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {flight.airlineLogo && <img src={flight.airlineLogo} alt={flight.airline} className="w-8 h-8 object-contain" />}
                <div>
                  <div className="font-medium text-sm">{flight.airline}</div>
                  <div className="text-xs text-muted-foreground">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`} · {flight.duration ? formatDuration(flight.duration) : ''}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{new Date(flight.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-xs text-muted-foreground">{flight.origin}</div>
              </div>
              <div className="text-xs text-muted-foreground">→</div>
              <div className="text-center">
                <div className="text-sm font-medium">{new Date(flight.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-xs text-muted-foreground">{flight.destination}</div>
              </div>
              <div className="text-right">
                <div className="text-base font-medium">{flight.priceFormatted || `$${flight.price}`}</div>
                <div className="text-xs text-muted-foreground">per person</div>
              </div>
              <div className="flex gap-2 ml-2">
                <a href={flight.deepLink} target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-lg hover:opacity-90">Book</a>
                <button onClick={() => handleSave(flight)} disabled={saved.has(flight.id)} className="border text-xs px-2 py-1.5 rounded-lg hover:bg-secondary disabled:opacity-50">{saved.has(flight.id) ? '✓' : 'Save'}</button>
                <button onClick={() => handleWatch(flight)} disabled={watched.has(flight.id)} className="border text-xs px-2 py-1.5 rounded-lg hover:bg-secondary disabled:opacity-50">{watched.has(flight.id) ? '🔔' : '🔕'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
