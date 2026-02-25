import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import aboutSectionBg from "@/assets/about-section-bg.jpg";
import {
  Bot,
  CalendarCheck,
  ShieldAlert,
  MapPin,
  Users,
  Wallet,
  ArrowRight,
} from "lucide-react";

const items = [
  {
    title: "AI-Powered Itineraries",
    description:
      "Our intelligent AI crafts personalized travel plans based on your preferences, budget, and travel style. No more hours of research.",
    cta: "Generate Itinerary",
    href: "/itineraries/new",
    Icon: Bot,
    iconBg: "bg-emerald-50",
    iconFg: "text-emerald-600",
  },
  {
    title: "Seamless Bookings",
    description:
      "Book flights, hotels, and experiences all in one place. We find the best deals and handle all the logistics for you.",
    cta: "Start Booking",
    href: "#flights",
    Icon: CalendarCheck,
    iconBg: "bg-rose-50",
    iconFg: "text-rose-600",
  },
  {
    title: "Smart Budget Tracking",
    description:
      "Set your budget and watch your spending in real-time. Get alerts before you overspend and suggestions to save more.",
    cta: "Track Budget",
    href: "/budget",
    Icon: Wallet,
    iconBg: "bg-blue-50",
    iconFg: "text-blue-600",
  },
  {
    title: "Travel Alerts",
    description:
      "Stay informed with real-time notifications about flight changes, weather updates, and local events at your destination.",
    cta: "Set Alerts",
    href: "#",
    Icon: ShieldAlert,
    iconBg: "bg-amber-50",
    iconFg: "text-amber-600",
  },
  {
    title: "Local Discoveries",
    description:
      "Uncover hidden gems and local favorites that most tourists miss. Experience destinations like a true local.",
    cta: "Discover More",
    href: "#destinations",
    Icon: MapPin,
    iconBg: "bg-emerald-50",
    iconFg: "text-emerald-600",
  },
  {
    title: "Trip Collaboration",
    description:
      "Plan trips with friends and family. Share itineraries, vote on activities, and coordinate schedules effortlessly.",
    cta: "Invite Friends",
    href: "#",
    Icon: Users,
    iconBg: "bg-sky-50",
    iconFg: "text-sky-600",
  },
];

export default function TravelCompanionSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={aboutSectionBg}
          alt="About section background"
          className="h-full w-full object-cover"
        />
        {/* Keep image visible (no blur), add contrast for legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Smooth transition from the Hero section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/60 to-transparent"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs bg-white/80 border border-white/30 text-foreground"
          >
            Everything you need
          </Badge>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-white drop-shadow">
            Your Complete Travel Companion
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-sm md:text-base text-white/85 drop-shadow-sm">
            From inspiration to destination, Wanderlust handles every aspect of your journey
            with intelligence and elegance
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, description, cta, href, Icon, iconBg, iconFg }) => (
            <Card
              key={title}
              className="rounded-2xl border border-white/30 bg-white/20 shadow-soft"
            >
              <CardContent className="p-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} border border-white/40`}>
                  <Icon className={`h-5 w-5 ${iconFg}`} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white drop-shadow-sm">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{description}</p>
                <a
                  href={href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white transition-colors"
                >
                  {cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/30 bg-white/20 p-4 md:p-5 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white drop-shadow-sm">Ready to start your adventure?</p>
              <p className="mt-1 text-xs text-white/80">
                Join thousands of travelers who trust Wanderlust for their journeys
              </p>
            </div>
            <Button className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


