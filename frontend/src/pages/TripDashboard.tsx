import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Wallet, 
  Users, 
  Pencil, 
  Trash2, 
  Tag,
  Plus,
  Sparkles
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Expense, getExpenses } from '../api/expenses';
import { AddExpenseForm } from '../components/expenses/AddExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { ItinerarySummaryCard } from "@/types/itinerary";
import { getItinerariesByTrip, deleteItinerary } from "@/services/itinerary";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  duration_days: number;
  total_budget: number;
  currency: string;
  travel_style: string;
  group_type: string;
  interests: string[];
  status: string;
  created_at: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bg }) => (
  <div className={`${bg} p-4 rounded-xl shadow-sm flex items-center space-x-4`}>
    <div className="p-2 bg-white/50 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const TripDashboard: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itineraries, setItineraries] = useState<ItinerarySummaryCard[]>([]);
  const [fetchingItineraries, setFetchingItineraries] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itineraryToDelete, setItineraryToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId || !session?.user) return;
    const fetchItineraries = async () => {
      try {
        setFetchingItineraries(true);
        const data = await getItinerariesByTrip(tripId);
        setItineraries(data);
      } catch (err) {
        console.error("Failed to fetch itineraries:", err);
      } finally {
        setFetchingItineraries(false);
      }
    };
    fetchItineraries();
  }, [tripId, session?.user]);

  const handleDeleteItinerary = async () => {
    if (!itineraryToDelete) return;
    try {
      await deleteItinerary(itineraryToDelete);
      setItineraries(prev => prev.filter(i => i.id !== itineraryToDelete));
      setDeleteDialogOpen(false);
      setItineraryToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete itinerary");
    }
  };

  const openDeleteDialog = (itineraryId: string) => {
    setItineraryToDelete(itineraryId);
    setDeleteDialogOpen(true);
  };

  const getBudgetBorderColor = (budgetLevel: string): string => {
    switch (budgetLevel?.toLowerCase()) {
      case 'budget':
        return 'border-l-4 border-l-green-500';
      case 'moderate':
        return 'border-l-4 border-l-blue-500';
      case 'luxury':
        return 'border-l-4 border-l-purple-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  const fetchExpenses = React.useCallback(async () => {
    if (!tripId || !session?.user) return;
    try {
      const data = await getExpenses(tripId);
      setExpenses(data);
    } catch (err: any) {
      console.error(err.message);
    }
  }, [tripId, session]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!session?.user || !tripId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from("trips")
          .select("*")
          .eq("id", tripId)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            throw new Error('Trip not found');
          }
          throw new Error(fetchError.message || 'Failed to fetch trip');
        }

        if (!data) {
          throw new Error('Trip not found');
        }

        setTrip({
          id: String(data.id || data.trip_id),
          destination: data.destination || "Unknown",
          start_date: data.start_date || "",
          duration_days: data.duration_days || 0,
          total_budget: Number(data.total_budget) || 0,
          currency: data.currency || "INR",
          travel_style: data.travel_style || "",
          group_type: data.group_type || "",
          interests: data.interests || [],
          status: data.status || "planning",
          created_at: data.created_at || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, session]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    if (!session?.user || !tripId) return;

    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from("trips")
        .delete()
        .eq("id", tripId);

      if (deleteError) {
        throw new Error(deleteError.message || 'Failed to delete trip');
      }

      navigate('/trips');
    } catch (err: any) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium text-gray-600 animate-pulse">Loading trip...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-xl font-medium text-red-600 mb-4">{error || 'Trip not found'}</p>
        <Link to="/trips" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trips
        </Link>
      </div>
    );
  }

  const startDate = new Date(trip.start_date);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (trip.duration_days || 1) - 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/trips" className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Trips
          </Link>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate(`/trip/${tripId}/edit`)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{trip.destination}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(startDate)} — {formatDate(endDate)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{trip.duration_days} Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            icon={<Wallet className="w-6 h-6 text-emerald-600" />}
            label="Total Budget"
            value={`${trip.currency} ${trip.total_budget.toLocaleString()}`}
            bg="bg-emerald-50"
          />
          <StatCard 
            icon={<Users className="w-6 h-6 text-blue-600" />}
            label="Group Type"
            value={trip.group_type || "Not set"}
            bg="bg-blue-50"
          />
          <StatCard 
            icon={<Tag className="w-6 h-6 text-purple-600" />}
            label="Travel Style"
            value={trip.travel_style || "Not set"}
            bg="bg-purple-50"
          />
        </div>

        {/* Interests Section */}
        {trip.interests && trip.interests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {trip.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium capitalize">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expense Tracker */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-emerald-600" />
              Expense Tracker
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <AddExpenseForm tripId={tripId!} onExpenseAdded={fetchExpenses} />
            </div>
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900">Recent Expenses</h3>
                <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  {expenses.length} logged
                </span>
              </div>
              <ExpenseList tripId={tripId!} expenses={expenses} onDeleted={fetchExpenses} />
            </div>
          </div>
        </div>

        {/* Itinerary Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Itinerary</h2>
            <button 
              onClick={() => navigate(`/trip/${tripId}/generate-itinerary`)}
              className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              ✨ Generate New Itinerary
            </button>
          </div>
          
          {fetchingItineraries ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 animate-pulse h-32 rounded-xl"></div>
              <div className="bg-gray-100 animate-pulse h-32 rounded-xl"></div>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="text-gray-600 font-medium mb-1">No itinerary generated yet</p>
              <p className="text-sm text-gray-400">Click the button above to let AI plan your perfect trip.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itineraries.map((itin) => (
                <div
                  key={itin.id}
                  className={`bg-white rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col ${getBudgetBorderColor(
                    itin.request_data?.budget_level
                  )}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {itin.destination || trip.destination}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          ✨ AI Generated
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(
                          new Date(itin.start_date || trip.start_date),
                          'MMM d'
                        )}
                        {' → '}
                        {format(
                          new Date(itin.end_date || trip.end_date),
                          'MMM d'
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => openDeleteDialog(itin.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Delete itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {itin.itinerary_data?.total_days || trip.duration_days} Days
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {itin.itinerary_data?.estimated_total_budget ||
                        trip.total_budget}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {itin.request_data?.num_travelers || 1}{' '}
                      {itin.request_data?.traveler_type || 'Traveler'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {itin.itinerary_data?.summary ||
                      'Custom generated itinerary for this trip.'}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      Generated on{' '}
                      {format(
                        new Date(itin.created_at),
                        'MMM d, yyyy'
                      )}
                    </span>
                    <button
                      onClick={() => navigate(`/itinerary/${itin.id}`)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      View Itinerary →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Itinerary Alert Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Itinerary?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This itinerary will be
                permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteItinerary}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default TripDashboard;
