import { Plane, Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-card via-muted/20 to-card border-t border-border py-12 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Travoura
              </h3>
            </div>
            <p className="text-muted-foreground">
              Your perfect journey starts here. Discover, plan, and book your dream vacation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#flights" className="hover:text-primary transition-colors">Flights</a></li>
              <li><a href="#hotels" className="hover:text-primary transition-colors">Hotels</a></li>
              <li><a href="#itinerary" className="hover:text-primary transition-colors">Itinerary</a></li>
              <li><a href="#destinations" className="hover:text-primary transition-colors">Destinations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Travoura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
