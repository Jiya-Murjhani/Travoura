import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ItineraryRenderer from "./GenerateItinerary/ItineraryRenderer";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getItineraryById } from "@/services/itinerary";
import { SavedItinerary } from "@/types/itinerary";

export default function ItineraryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!id) {
        setError("Itinerary ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getItineraryById(id);
        setItinerary(data);
      } catch (err: any) {
        console.error("Error fetching itinerary:", err);
        setError(err.message || "Failed to load itinerary");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-light">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button - Always Visible */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
            <p className="text-muted-foreground">Loading itinerary...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-red-200 bg-red-50 p-6">
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Error Loading Itinerary</h3>
                <p className="text-sm text-red-800 mt-1">{error}</p>
                <Button
                  onClick={() => navigate("/trips")}
                  variant="outline"
                  className="mt-4"
                >
                  Go to Trips
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Success State - Display Itinerary */}
        {!loading && !error && itinerary && itinerary.itinerary_data && (
          <div className="space-y-6">
            {/* Header with destination and back button */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {itinerary.destination}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(itinerary.start_date).toLocaleDateString()} -{" "}
                  {new Date(itinerary.end_date).toLocaleDateString()}
                </p>
              </div>
              {itinerary.trip_id && (
                <Button
                  onClick={() => navigate(`/trip/${itinerary.trip_id}`)}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Trip
                </Button>
              )}
            </div>

            {/* Render the full itinerary using ItineraryRenderer */}
            <ItineraryRenderer
              itinerary={itinerary.itinerary_data}
              onOpenRefine={() => {
                // Refinement chat can be added here if needed
              }}
            />
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && itinerary && !itinerary.itinerary_data && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No itinerary data available
            </p>
            <Button
              onClick={() => navigate("/trips")}
              variant="outline"
              className="mt-4"
            >
              Go to Trips
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
