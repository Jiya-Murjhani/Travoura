import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Star, MapPin, Calendar } from "lucide-react";

interface HotelResult {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  destination: string;
  amenities: string[];
  propertyType: string;
  pricePerNight: number;
}

const AMENITY_OPTIONS = ["Wi-Fi", "Breakfast", "Parking", "Pool", "Gym", "Spa"];
const PROPERTY_TYPES = ["Hotel", "Apartment", "Resort", "Hostel", "Villa"];

const MOCK_HOTELS: HotelResult[] = [
  { id: "1", name: "The Grand Plaza", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", rating: 4.8, reviewCount: 1240, destination: "Paris", amenities: ["Wi-Fi", "Breakfast", "Parking", "Pool"], propertyType: "Hotel", pricePerNight: 189 },
  { id: "2", name: "Seaside Resort & Spa", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800", rating: 4.6, reviewCount: 892, destination: "Bali", amenities: ["Wi-Fi", "Breakfast", "Pool", "Spa"], propertyType: "Resort", pricePerNight: 245 },
  { id: "3", name: "Urban Loft Central", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", rating: 4.5, reviewCount: 456, destination: "New York", amenities: ["Wi-Fi", "Gym"], propertyType: "Apartment", pricePerNight: 125 },
  { id: "4", name: "Mountain View Lodge", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", rating: 4.9, reviewCount: 567, destination: "Switzerland", amenities: ["Wi-Fi", "Breakfast", "Parking"], propertyType: "Hotel", pricePerNight: 320 },
  { id: "5", name: "Tokyo Central Inn", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", rating: 4.4, reviewCount: 2103, destination: "Tokyo", amenities: ["Wi-Fi", "Breakfast"], propertyType: "Hotel", pricePerNight: 98 },
];

export default function Hotels() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [priceMax, setPriceMax] = useState(400);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const toggleAmenity = (a: string) => {
    setAmenitiesFilter((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const togglePropertyType = (t: string) => {
    setPropertyTypeFilter((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const filteredHotels = MOCK_HOTELS.filter((h) => {
    if (h.pricePerNight > priceMax) return false;
    if (ratingFilter != null && h.rating < ratingFilter) return false;
    if (amenitiesFilter.length && !amenitiesFilter.every((a) => h.amenities.includes(a))) return false;
    if (propertyTypeFilter.length && !propertyTypeFilter.includes(h.propertyType)) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Hotels</h1>

        {/* Search */}
        <Card className="rounded-2xl border-border/80 bg-card shadow-soft">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="City or region"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Check-in</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Check-out</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Guests</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5", "6+"].map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
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
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm">Price per night (max)</Label>
                  <Slider
                    value={[priceMax]}
                    onValueChange={(v) => setPriceMax(v[0] ?? 400)}
                    max={400}
                    step={20}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Up to ${priceMax}
                  </p>
                </div>
                <div>
                  <Label className="text-sm">Rating</Label>
                  <div className="mt-2 space-y-2">
                    {[4.5, 4, 3.5, 3].map((r) => (
                      <div key={r} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${r}`}
                          checked={ratingFilter === r}
                          onCheckedChange={(checked) =>
                            setRatingFilter(checked ? r : null)
                          }
                        />
                        <label htmlFor={`rating-${r}`} className="text-sm cursor-pointer flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {r}+
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Amenities</Label>
                  <div className="mt-2 space-y-2">
                    {AMENITY_OPTIONS.map((a) => (
                      <div key={a} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${a}`}
                          checked={amenitiesFilter.includes(a)}
                          onCheckedChange={() => toggleAmenity(a)}
                        />
                        <label htmlFor={`amenity-${a}`} className="text-sm cursor-pointer">
                          {a}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Property type</Label>
                  <div className="mt-2 space-y-2">
                    {PROPERTY_TYPES.map((t) => (
                      <div key={t} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${t}`}
                          checked={propertyTypeFilter.includes(t)}
                          onCheckedChange={() => togglePropertyType(t)}
                        />
                        <label htmlFor={`type-${t}`} className="text-sm cursor-pointer">
                          {t}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {searched || filteredHotels.length < MOCK_HOTELS.length ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredHotels.length} hotel(s) found
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredHotels.map((hotel) => (
                    <Card
                      key={hotel.id}
                      className="rounded-2xl border-border/80 bg-card shadow-soft overflow-hidden hover:shadow-elevated transition-shadow"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{hotel.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {hotel.destination}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-sm">{hotel.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({hotel.reviewCount})
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {hotel.amenities.slice(0, 4).map((a) => (
                            <span
                              key={a}
                              className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">{hotel.propertyType}</p>
                            <p className="text-xl font-bold text-primary">
                              ${hotel.pricePerNight}
                              <span className="text-sm font-normal text-muted-foreground">
                                /night
                              </span>
                            </p>
                          </div>
                          <Button size="sm" className="rounded-xl">
                            Select
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="rounded-2xl border-border/80 shadow-soft">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter destination and dates, then click Search to see hotels.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
