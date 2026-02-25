import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/hero-video.mp4";
import heroImage from "@/assets/hero-beach.jpg";
import UserGreeting from "@/components/UserGreeting";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const rotatingPlaceholders = [
    "eg: japan",
    "eg: bali",
    "eg: paris",
    "eg: dubai",
    "eg: new york",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (videoRef.current) {
      // Set playback rate for slow motion (0.5 = half speed, adjust as needed)
      videoRef.current.playbackRate = 0.5;
      
      // Handle video load errors
      const handleError = () => {
        console.error("Video failed to load, falling back to image");
        setVideoError(true);
      };
      
      videoRef.current.addEventListener("error", handleError);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("error", handleError);
        }
      };
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % rotatingPlaceholders.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [rotatingPlaceholders.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={heroImage} 
            alt="Beautiful tropical beach destination" 
            className="w-full h-full object-cover"
          />
        )}
        {/* Original contrast overlay (keeps video clear) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 pt-20">
        <div className="text-center mb-12 animate-fade-in">
          <UserGreeting />
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Where do you want to disappear to?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Discover amazing destinations, book flights and hotels, create perfect itineraries
          </p>
        </div>

        {/* Search Card */}
        <div
          className="max-w-md mx-auto rounded-2xl shadow-elevated border border-white/30 p-5 md:p-6 animate-slide-up"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,200,180,0.35) 0%, rgba(230,166,179,0.35) 35%, rgba(214,201,248,0.35) 70%, rgba(199,210,254,0.35) 100%)",
          }}
        >
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="space-y-2">
              <label className="text-base md:text-lg font-semibold text-white/95 flex items-center justify-center text-center">
                Tell us your dream destination!
              </label>
              <Input
                placeholder={rotatingPlaceholders[placeholderIndex]}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 rounded-xl bg-white/15 border-white/30 text-lg text-white placeholder:text-white/60 text-center shadow-soft"
              />
            </div>
          </div>
          
          <Button
            className="w-full h-12 text-lg bg-gradient-hero text-primary-foreground hover:opacity-95"
            size="lg"
            onClick={() => {
              const value = destination.trim();
              if (!value) return;
              navigate("/startplanning", { state: { destination: value } });
            }}
          >
            Start Planning
          </Button>
        </div>
      </div>

      {/* Smooth transition into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-b from-transparent via-black/20 to-black/50"
      />
    </section>
  );
};

export default Hero;
