import { Zap, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 opacity-0 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
      <div className="text-center mb-6">
        <h3 className="font-display font-semibold text-lg text-foreground mb-2">Ready to Book?</h3>
        <p className="text-sm text-muted-foreground">Let our AI help you stay within budget</p>
      </div>

      <div className="space-y-3">
        <Button variant="default" size="lg" className="w-full group bg-gradient-coral hover:opacity-90">
          <Zap className="w-5 h-5" />
          Optimize My Budget
          <ArrowRight className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1" />
        </Button>
        
        <Link to="/">
          <Button variant="default" size="lg" className="w-full group bg-gradient-ocean hover:opacity-90">
            <Calendar className="w-5 h-5" />
            Book Within Budget
            <ArrowRight className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Powered by Travoura AI • Secure & Trusted
      </p>
    </div>
  );
};

export default CTASection;

