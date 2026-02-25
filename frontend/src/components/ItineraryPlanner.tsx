import { ListTodo, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import itineraryBg from "@/assets/itinerary-bg.jpg";

const ItineraryPlanner = () => {
  return (
    <section id="itinerary" className="relative overflow-hidden py-20">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={itineraryBg}
          alt="Itinerary planning background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 z-10 bg-dot-pattern bg-dot-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-20 left-10 z-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 z-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-white">
            <ListTodo className="h-10 w-10 text-white" />
            Plan Your Perfect Itinerary
          </h2>
          <p className="text-xl text-white/90">
            Create personalized day-by-day travel plans
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Start by adding your trip information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Trip Name</label>
                <Input placeholder="e.g., European Adventure 2024" className="h-12" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" className="h-12" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Destinations</label>
                <Input placeholder="Paris, Rome, Barcelona..." className="h-12" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Daily Activities</CardTitle>
              <CardDescription>Add activities for each day of your trip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Day 1 - Activities</label>
                <Textarea 
                  placeholder="Morning: Visit Eiffel Tower&#10;Afternoon: Louvre Museum&#10;Evening: Seine River Cruise" 
                  className="min-h-[120px]"
                />
              </div>
              
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Day
              </Button>
              
              <Button className="w-full h-12" size="lg">
                Save Itinerary
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ItineraryPlanner;
