import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { CreateItineraryForm } from "@/components/itineraries/form/CreateItineraryForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import itineraryBg from "@/assets/itinerary-bg.jpg";

export default function CreateItinerary() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={itineraryBg} 
          alt="Travel destination background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-lg">Create a new itinerary</h1>
            <p className="mt-1 text-sm text-white/80 drop-shadow-md">A few choices now. A smoother trip later.</p>
          </div>
          <Link to="/itineraries">
            <Button variant="ghost" className="gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Button>
          </Link>
        </div>

        <CreateItineraryForm />
      </main>
    </div>
  );
}


