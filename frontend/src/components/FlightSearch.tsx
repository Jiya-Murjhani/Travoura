import { Plane, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FlightSearch = () => {
  return (
    <section id="flights" className="py-20 relative overflow-hidden bg-gradient-light">
      {/* Decorative mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Plane className="h-10 w-10 text-primary" />
            Book Your Flight
          </h2>
          <p className="text-xl text-muted-foreground">
            Find the best deals on flights worldwide
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-soft">
          <CardHeader>
            <CardTitle>Search Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="roundtrip" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
                <TabsTrigger value="oneway">One Way</TabsTrigger>
                <TabsTrigger value="multi">Multi-City</TabsTrigger>
              </TabsList>
              
              <TabsContent value="roundtrip" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <Input placeholder="Departure city" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Input placeholder="Arrival city" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departure</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Return</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Passengers</label>
                    <Input type="number" placeholder="1" />
                  </div>
                </div>
                
                <Button className="w-full" size="lg">
                  Search Flights
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </TabsContent>
              
              <TabsContent value="oneway" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <Input placeholder="Departure city" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Input placeholder="Arrival city" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Departure</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Passengers</label>
                    <Input type="number" placeholder="1" />
                  </div>
                </div>
                
                <Button className="w-full" size="lg">
                  Search Flights
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </TabsContent>
              
              <TabsContent value="multi">
                <p className="text-center text-muted-foreground py-8">
                  Multi-city flight search coming soon!
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FlightSearch;
