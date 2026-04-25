import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { searchActivities, saveBooking, createAlert } from '@/api/bookings';
import { toast } from 'sonner';

export default function ActivitiesAndEvents() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const search = async () => {
    if (!destination) { toast.error('Enter a destination'); return; }
    setLoading(true);
    const data = await searchActivities({ destination }, token);
    setResults(data.activities || []);
    setLoading(false);
    if (!data.activities?.length) toast.info('No activities found');
  };

  const handleSave = async (activity: any) => {
    await saveBooking({ type: 'activity', itemName: activity.name, itemData: activity, priceAmount: activity.price, priceCurrency: activity.currency }, token);
    setSaved(prev => new Set([...prev, activity.id]));
    toast.success(`${activity.name} saved to My Bookings`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">Activities & Experiences</h1>

      <div className="bg-card border rounded-xl p-5 mb-8 flex gap-3">
        <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Where are you going? (e.g. Tokyo, Rome)" value={destination} onChange={e => setDestination(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
        <button onClick={search} disabled={loading} className="bg-primary text-primary-foreground px-6 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
          {loading ? 'Searching...' : 'Explore'}
        </button>
      </div>

      {loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-56 bg-muted animate-pulse rounded-xl" />)}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map(activity => (
          <div key={activity.id} className="bg-card border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            {activity.image && <img src={activity.image} alt={activity.name} className="w-full h-36 object-cover" />}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{activity.name}</h3>
              {activity.rating && <div className="text-xs text-muted-foreground mb-2">⭐ {activity.rating?.toFixed(1)} · {activity.reviewCount?.toLocaleString()} reviews</div>}
              {activity.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{activity.description}</p>}
              {activity.price && <div className="text-sm font-medium mb-3">From ${activity.price?.toFixed(0)}</div>}
              <div className="flex gap-2 mt-auto">
                <a href={activity.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-primary text-primary-foreground text-xs py-1.5 rounded-lg hover:opacity-90">Book</a>
                <button onClick={() => handleSave(activity)} disabled={saved.has(activity.id)} className="px-3 border rounded-lg text-xs hover:bg-secondary disabled:opacity-50">{saved.has(activity.id) ? '✓' : 'Save'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
