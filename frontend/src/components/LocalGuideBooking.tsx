import { Star, MapPin, Languages, Calendar, Compass, Utensils, Building2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import guide1 from "@/assets/guide-1.jpg";
import guide2 from "@/assets/guide-2.jpg";
import guide3 from "@/assets/guide-3.jpg";

const guides = [
  {
    id: 1,
    name: "Marco Rodriguez",
    rating: 4.9,
    reviews: 127,
    languages: ["English", "Spanish", "Italian"],
    location: "Barcelona, Spain",
    expertise: ["City Tours", "Food Tours", "Cultural"],
    image: guide1,
    price: "$45/hour",
    available: true
  },
  {
    id: 2,
    name: "Sarah Chen",
    rating: 5.0,
    reviews: 94,
    languages: ["English", "Mandarin", "French"],
    location: "Paris, France",
    expertise: ["Trekking", "City Tours", "Cultural"],
    image: guide2,
    price: "$55/hour",
    available: true
  },
  {
    id: 3,
    name: "Raj Patel",
    rating: 4.8,
    reviews: 156,
    languages: ["English", "Hindi", "German"],
    location: "Mumbai, India",
    expertise: ["Cultural", "Food Tours", "City Tours"],
    image: guide3,
    price: "$35/hour",
    available: false
  }
];

const expertiseIcons = {
  "City Tours": Building2,
  "Food Tours": Utensils,
  "Cultural": Heart,
  "Trekking": Compass
};

const LocalGuideBooking = () => {
  return (
    <section id="guides" className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Compass className="h-10 w-10 text-primary" />
            Book Local Guides
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with expert local guides for authentic experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {guides.map((guide, index) => (
            <Card 
              key={guide.id} 
              className="group overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 animate-slide-up border-0 bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden aspect-square">
                <img 
                  src={guide.image} 
                  alt={guide.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0">
                    {guide.price}
                  </Badge>
                </div>
                {!guide.available && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <Badge variant="secondary" className="text-sm">Not Available</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{guide.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {guide.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{guide.rating}</span>
                    <span className="text-muted-foreground text-sm">({guide.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <div className="flex gap-1 flex-wrap">
                    {guide.languages.map((lang, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {guide.expertise.map((exp, i) => {
                    const Icon = expertiseIcons[exp as keyof typeof expertiseIcons] || Compass;
                    return (
                      <Badge key={i} variant="secondary" className="gap-1">
                        <Icon className="h-3 w-3" />
                        {exp}
                      </Badge>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                    disabled={!guide.available}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalGuideBooking;
