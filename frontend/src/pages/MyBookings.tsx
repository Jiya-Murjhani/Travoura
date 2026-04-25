import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMyBookings, deleteBooking, getAlerts, deleteAlert } from '@/api/bookings';
import { toast } from 'sonner';

export default function MyBookings() {
  const { session } = useAuth();
  const token = session?.access_token ?? '';
  const [bookings, setBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [tab, setTab] = useState<'all' | 'flights' | 'hotels' | 'activities' | 'alerts'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyBookings(token), getAlerts(token)]).then(([b, a]) => {
      setBookings(b.bookings || []);
      setAlerts(a.alerts || []);
      setLoading(false);
    });
  }, [token]);

  const handleDelete = async (id: string) => {
    await deleteBooking(id, token);
    setBookings(prev => prev.filter(b => b.id !== id));
    toast.success('Booking removed');
  };

  const handleDeleteAlert = async (id: string) => {
    await deleteAlert(id, token);
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alert removed');
  };

  const filtered = tab === 'all' ? bookings : tab === 'alerts' ? [] : bookings.filter(b => b.type === tab.slice(0, -1));

  const typeIcon = (type: string) => ({ flight: '✈️', hotel: '🏨', activity: '🎭' }[type] ?? '📌');

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'all', label: `All (${bookings.length})` },
    { key: 'flights', label: `Flights (${bookings.filter(b => b.type === 'flight').length})` },
    { key: 'hotels', label: `Hotels (${bookings.filter(b => b.type === 'hotel').length})` },
    { key: 'activities', label: `Activities (${bookings.filter(b => b.type === 'activity').length})` },
    { key: 'alerts', label: `Price Alerts (${alerts.length})` },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">My Bookings</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${tab === t.key ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-secondary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}</div>}

      {/* Bookings */}
      {tab !== 'alerts' && (
        <div className="space-y-3">
          {filtered.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="font-medium">No bookings saved yet</p>
              <p className="text-sm mt-1">Search hotels, flights or activities and save them here</p>
            </div>
          )}
          {filtered.map(booking => (
            <div key={booking.id} className="bg-card border rounded-xl p-4 flex items-center gap-4">
              <div className="text-2xl">{typeIcon(booking.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{booking.item_name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {booking.price_amount && `$${parseFloat(booking.price_amount).toFixed(0)} · `}
                  {booking.check_in && `${booking.check_in} → ${booking.check_out} · `}
                  {new Date(booking.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-secondary text-muted-foreground'}`}>
                {booking.status}
              </span>
              {booking.item_data?.url && <a href={booking.item_data.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline whitespace-nowrap">View</a>}
              <button onClick={() => handleDelete(booking.id)} className="text-xs text-destructive hover:underline ml-1">Remove</button>
            </div>
          ))}
        </div>
      )}

      {/* Alerts */}
      {tab === 'alerts' && (
        <div className="space-y-3">
          {alerts.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-3">🔕</div>
              <p className="font-medium">No price alerts set</p>
              <p className="text-sm mt-1">Click the bell icon on any hotel or flight to watch its price</p>
            </div>
          )}
          {alerts.map(alert => (
            <div key={alert.id} className="bg-card border rounded-xl p-4 flex items-center gap-4">
              <div className="text-2xl">{typeIcon(alert.type)}</div>
              <div className="flex-1">
                <div className="font-medium text-sm">{alert.item_name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Current: ${parseFloat(alert.current_price).toFixed(0)} · Target: ${parseFloat(alert.target_price).toFixed(0)}
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">Watching</span>
              <button onClick={() => handleDeleteAlert(alert.id)} className="text-xs text-destructive hover:underline">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
