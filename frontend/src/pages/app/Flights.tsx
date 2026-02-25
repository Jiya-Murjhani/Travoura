import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Plane, MapPin, Calendar } from "lucide-react";

interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  class: string;
}

const MOCK_FLIGHTS: FlightResult[] = [
  { id: "1", airline: "SkyWings", airlineCode: "SW", from: "New York (JFK)", to: "London (LHR)", departure: "08:00", arrival: "20:30", duration: "7h 30m", stops: 0, price: 520, class: "Economy" },
  { id: "2", airline: "Ocean Air", airlineCode: "OA", from: "New York (JFK)", to: "London (LHR)", departure: "14:00", arrival: "06:00+1", duration: "7h 0m", stops: 0, price: 485, class: "Economy" },
  { id: "3", airline: "Global Express", airlineCode: "GX", from: "New York (JFK)", to: "London (LHR)", departure: "22:00", arrival: "10:30+1", duration: "7h 30m", stops: 1, price: 380, class: "Economy" },
  { id: "4", airline: "SkyWings", airlineCode: "SW", from: "New York (JFK)", to: "London (LHR)", departure: "06:30", arrival: "19:00", duration: "7h 30m", stops: 0, price: 720, class: "Business" },
];

export default function Flights() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateOut, setDateOut] = useState("");
  const [dateBack, setDateBack] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [flightClass, setFlightClass] = useState("economy");
  const [priceMax, setPriceMax] = useState(800);
  const [stopsFilter, setStopsFilter] = useState<string[]>([]);
  const [airlineFilter, setAirlineFilter] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const toggleStop = (stop: string) => {
    setStopsFilter((prev) =>
      prev.includes(stop) ? prev.filter((s) => s !== stop) : [...prev, stop]
    );
  };

  const toggleAirline = (airline: string) => {
    setAirlineFilter((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    );
  };

  const airlines = Array.from(new Set(MOCK_FLIGHTS.map((f) => f.airline)));
  const filteredFlights = MOCK_FLIGHTS.filter((f) => {
    if (f.price > priceMax) return false;
    if (stopsFilter.length && !stopsFilter.includes(f.stops === 0 ? "0" : "1+")) return false;
    if (airlineFilter.length && !airlineFilter.includes(f.airline)) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Flights</h1>

        {/* Search */}
        <Card className="rounded-2xl border-border/80 bg-card shadow-soft">
          <CardHeader>
            <h2 className="text-lg font-semibold">Search flights</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="City or airport"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="City or airport"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Departure</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateOut}
                    onChange={(e) => setDateOut(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Passengers</Label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5", "6"].map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Class</Label>
                <Select value={flightClass} onValueChange={setFlightClass}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full rounded-xl h-10">
                  Search
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters */}
          <aside className="lg:col-span-1 space-y-4">
            <Card className="rounded-2xl border-border/80 shadow-soft sticky top-24">
              <CardHeader>
                <h3 className="font-semibold">Filters</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm">Price (max)</Label>
                  <Slider
                    value={[priceMax]}
                    onValueChange={(v) => setPriceMax(v[0] ?? 800)}
                    max={800}
                    step={20}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Up to ${priceMax}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">Stops</Label>
                  <div className="mt-2 space-y-2">
                    {["0", "1+"].map((stop) => (
                      <div key={stop} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stop-${stop}`}
                          checked={stopsFilter.includes(stop)}
                          onCheckedChange={() => toggleStop(stop)}
                        />
                        <label htmlFor={`stop-${stop}`} className="text-sm cursor-pointer">
                          {stop === "0" ? "Non-stop" : "1+ stops"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Airline</Label>
                  <div className="mt-2 space-y-2">
                    {airlines.map((airline) => (
                      <div key={airline} className="flex items-center space-x-2">
                        <Checkbox
                          id={`airline-${airline}`}
                          checked={airlineFilter.includes(airline)}
                          onCheckedChange={() => toggleAirline(airline)}
                        />
                        <label htmlFor={`airline-${airline}`} className="text-sm cursor-pointer">
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {searched ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {filteredFlights.length} flight(s) found
                </p>
                <div className="grid gap-4">
                  {filteredFlights.map((flight) => (
                    <Card
                      key={flight.id}
                      className="rounded-2xl border-border/80 bg-card shadow-soft hover:shadow-elevated transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                              {flight.airlineCode}
                            </div>
                            <div>
                              <p className="font-semibold">{flight.airline}</p>
                              <p className="text-sm text-muted-foreground">
                                {flight.departure} – {flight.arrival} · {flight.duration}
                                {flight.stops > 0 && ` · ${flight.stops} stop(s)`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {flight.from} → {flight.to}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">${flight.price}</p>
                              <p className="text-xs text-muted-foreground">per person</p>
                            </div>
                            <Button className="rounded-xl shrink-0">Select</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="rounded-2xl border-border/80 shadow-soft">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your search and click Search to see flights.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
