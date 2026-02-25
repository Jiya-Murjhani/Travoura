import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import destination1 from "@/assets/destination-1.jpg";
import destination2 from "@/assets/destination-2.jpg";
import destination3 from "@/assets/destination-3.jpg";

const destinations = [
  {
    name: "Maldives",
    image: destination1,
    rating: 4.9,
    reviews: "2.3k",
    price: "$1,299",
    description: "Paradise islands with crystal clear waters"
  },
  {
    name: "Swiss Alps",
    image: destination2,
    rating: 4.8,
    reviews: "1.8k",
    price: "$1,499",
    description: "Breathtaking mountain landscapes"
  },
  {
    name: "Historic Europe",
    image: destination3,
    rating: 4.7,
    reviews: "3.1k",
    price: "$999",
    description: "Charming old-world architecture"
  }
];

const PopularDestinations = () => {
  return (
    <section id="destinations" className="py-20 relative overflow-hidden">
      {/* Stunning gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-sunset opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-hero opacity-20 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <MapPin className="h-10 w-10 text-primary" />
            Popular Destinations
          </h2>
          <p className="text-xl text-muted-foreground">
            Discover the world's most breathtaking places
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <Card 
              key={index} 
              className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-foreground hover:bg-white">
                    {destination.price}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                <p className="text-muted-foreground mb-4">{destination.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-secondary text-secondary" />
                    <span className="font-semibold">{destination.rating}</span>
                    <span className="text-sm text-muted-foreground">({destination.reviews} reviews)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
