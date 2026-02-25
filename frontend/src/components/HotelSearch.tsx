import { Hotel, MapPin, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HotelSearch = () => {
  return (
    <section id="hotels" className="py-20 relative overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-accent/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Hotel className="h-10 w-10 text-secondary" />
            Find Your Perfect Stay
          </h2>
          <p className="text-xl text-muted-foreground">
            From luxury resorts to cozy boutique hotels
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle>Search Hotels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                Destination
              </label>
              <Input placeholder="Where are you going?" className="h-12" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  Check-in
                </label>
                <Input type="date" className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  Check-out
                </label>
                <Input type="date" className="h-12" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-secondary" />
                  Guests
                </label>
                <Input type="number" placeholder="2 guests" className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-secondary" />
                  Rooms
                </label>
                <Input type="number" placeholder="1 room" className="h-12" />
              </div>
            </div>
            
            <Button className="w-full h-12" size="lg" variant="default">
              Search Hotels
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HotelSearch;
