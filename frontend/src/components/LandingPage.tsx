import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImg from "@/assets/travoura-logo.png";
import ImageTrail from "@/components/home/ImageTrail";

const TRAIL_IMAGES = [
  'https://images.pexels.com/photos/4870457/pexels-photo-4870457.jpeg',
  'https://images.pexels.com/photos/12543917/pexels-photo-12543917.jpeg',
  'https://images.pexels.com/photos/29018566/pexels-photo-29018566.png',
  'https://images.pexels.com/photos/33704657/pexels-photo-33704657.jpeg',
  'https://images.pexels.com/photos/4589325/pexels-photo-4589325.jpeg',
  'https://images.pexels.com/photos/13577528/pexels-photo-13577528.jpeg',
  'https://images.pexels.com/photos/27395085/pexels-photo-27395085.jpeg',
  'https://images.pexels.com/photos/7431709/pexels-photo-7431709.jpeg',
  'https://images.pexels.com/photos/20058561/pexels-photo-20058561.jpeg',
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentActive, setCurrentActive] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sections = [
    {
      heading: "Most people plan trips.<br>Travoura plans experiences.",
      index: "",
      eyebrow: "",
      desc: "Your next adventure is one AI prompt away. Describe your trip, we handle everything else.",
      primaryCTA: "Start Planning Free",
      secondaryCTA: "See how it works",
      image: "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=900&q=90",
      alt: "Solo traveller",
    },
    {
      heading: "From one sentence to <br> a full itinerary.<br> In seconds.",
      index: "01",
      eyebrow: "AI ITINERARY GENERATION",
      desc: "Tell Travoura where you want to go, your budget, and your vibe. The AI returns a complete day-by-day plan with timings, local tips, meals, and costs — personalised to how you actually travel.",
      primaryCTA: "Try it now",
      secondaryCTA: "",
      image: "https://i.pinimg.com/originals/7a/51/cd/7a51cd1159698d6f392b4dce8f222ab0.jpg",
      alt: "Planning at night",
    },
    {
      heading: "Know exactly where<br>every penny goes.",
      index: "02",
      eyebrow: "BUDGET & EXPENSE TRACKING",
      desc: "Set your trip budget before you leave. Log expenses as you travel. Travoura shows you category breakdowns, daily averages, and whether you're on track — no spreadsheets, no stress.",
      primaryCTA: "",
      secondaryCTA: "",
      image: "https://img.freepik.com/premium-photo/top-view-tourist-counting-cash-spend-his-luxury-vacation_38391-637.jpg",
      alt: "Expense tracking",
    },
    {
      heading: "The world changes.<br>Your plan adapts.",
      index: "03",
      eyebrow: "REAL-TIME INTELLIGENCE",
      desc: "Weather shifting in Goa? You'll know before you pack. Civil unrest near your hotel? Rerouted before it matters. Flight delays, local strikes, sudden closures — Travoura monitors your destination in real time and updates your itinerary automatically. Travel confidently. Not blindly.",
      primaryCTA: "See how it works →",
      secondaryCTA: "",
      image: "https://cdn.touch4it.com/sites/default/files/2023-12/MySkyWatch%20%E2%80%93%20cover%20photo.jpg",
      alt: "weather alerts",
    },
    {
      heading: "Your perfect stay.<br>Your best fare.<br>All in one place.",
      index: "04",
      eyebrow: "FLIGHTS & HOTELS",
      desc: "Search flights, compare hotels, and lock in the best prices without jumping between ten different tabs. Travoura finds options that fit your itinerary dates, your budget tier, and your travel style — already filtered, already ranked.",
      primaryCTA: "Search flights & hotels →",
      secondaryCTA: "",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=90",
      alt: "Flights and hotels",
    },
  ];

  const handleScroll = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    setScrollProgress(scrolled);

    // Determine which section is in view
    const scrollSections = document.querySelectorAll(".scroll-section");
    scrollSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
        setCurrentActive(index);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentSection = sections[currentActive] || sections[0];

  return (
    <div className="relative min-h-screen bg-[#0c0c0c]">
      <style>{`
        :root {
          --bg-color: #0c0c0c;
          --accent-color: #ffffff;
          --color-gold: #C9A84C;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background-color: var(--bg-color);
          color: var(--accent-color);
          margin: 0;
        }

        .display-font {
          font-family: 'Cormorant Garamond', serif;
        }

        .ui-font {
          font-family: 'DM Sans', sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }

        #sticky-heading {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }

        .heading-hidden {
          opacity: 0;
          transform: translateY(20px);
        }

        .heading-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .scroll-indicator-bar {
          transition: height 0.3s ease-out;
        }

        .fade-transition {
          transition: opacity 0.4s ease;
        }

        /* Image Trail Styles */
        .image-trail-section {
          position: relative;
          height: 600px;
          background: #0c0c0c;
          overflow: hidden;
          cursor: none;
        }
        .image-trail-overlay {
          position: absolute;
          inset: 0;
          z-index: 200;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
          padding: 0 24px;
        }
        .image-trail-overlay__heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 500;
          line-height: 1.08;
          color: #F7F5F0;
          margin: 0 0 16px;
        }
        .image-trail-overlay__heading em {
          font-style: italic;
          color: rgba(247,245,240,0.55);
        }
        .image-trail-overlay__sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 300;
          color: rgba(247,245,240,0.4);
          max-width: 420px;
        }
        .image-trail-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(247,245,240,0.25);
          pointer-events: none;
          animation: pulse-hint 2s ease-in-out infinite;
        }
        .image-trail-overlay__cta {
          margin-top: 32px;
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          border: none;
          background: var(--color-gold, #C9A84C);
          color: #0A0A0B;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 40px;
          transition: all 300ms ease;
          pointer-events: auto;
          cursor: pointer;
        }
        .image-trail-overlay__cta:hover {
          background: #b0923d;
          box-shadow: 0 4px 20px rgba(201, 168, 76, 0.3);
        }
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 pt-4 pb-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="30" fill="#F7F5F0" fontFamily="'Cormorant Garamond', serif" fontSize="32" fontWeight="600" letterSpacing="0.04em">
              Travoura
            </text>
          </svg>
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/login" className="ui-font text-xs uppercase tracking-[0.2em] font-medium hover:opacity-50 transition-opacity">
            Sign In
          </Link>
          <Link to="/signup" className="ui-font text-xs uppercase tracking-[0.2em] font-bold bg-[#C9A84C] text-[#0A0A0B] px-6 py-2.5 rounded-sm shadow-[0_0_15px_rgba(201,168,76,0.5)] hover:shadow-[0_0_25px_rgba(201,168,76,0.9)] hover:bg-[#b0923d] transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left: Sticky Content (40%) */}
        <aside className="hidden lg:flex w-full lg:w-[40%] lg:sticky lg:top-0 lg:h-screen flex-col justify-center px-12 lg:px-24 z-10 pt-20 lg:pt-0">
          <div className="relative">
            {currentSection.index && (
              <div className="absolute -top-12 left-0 text-[10px] ui-font uppercase tracking-[0.4em] text-white/40 flex items-center gap-4">
                <span id="section-index">{currentSection.index}</span>
                <div className="w-12 h-[1px] bg-white/20"></div>
                <span id="section-eyebrow" className="fade-transition">
                  {currentSection.eyebrow}
                </span>
              </div>
            )}

            <div className="overflow-hidden mb-6">
              <h1
                id="sticky-heading"
                className="display-font text-4xl lg:text-6xl font-semibold leading-tight tracking-tight"
                dangerouslySetInnerHTML={{ __html: currentSection.heading }}
              />
            </div>

            <p id="sticky-description" className="ui-font text-white/50 max-w-sm leading-relaxed text-lg font-light fade-transition">
              {currentSection.desc}
            </p>

            <div id="cta-container" className="mt-12 flex flex-wrap items-center gap-6 fade-transition hidden lg:flex">
              {currentSection.primaryCTA && (
                <button
                  onClick={() => navigate("/signup")}
                  className="ui-font inline-flex items-center gap-4 py-3 px-6 text-sm uppercase tracking-widest font-bold transition-all bg-[#C9A84C] text-[#0A0A0B] hover:bg-[#b0923d]"
                >
                  {currentSection.primaryCTA}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              )}
              {currentSection.secondaryCTA && (
                <a href="#" className="ui-font text-xs uppercase tracking-widest font-bold border-b border-white/20 hover:border-white transition-all py-1">
                  {currentSection.secondaryCTA}
                </a>
              )}
            </div>
          </div>

          {/* Scroll Progress Indicator */}
          <div className="absolute bottom-12 left-12 lg:left-24 h-32 w-[2px] bg-white/10 hidden lg:block">
            <div id="scroll-bar" className="scroll-indicator-bar absolute top-0 left-0 w-full bg-white h-0" style={{ height: `${scrollProgress}%` }} />
          </div>
        </aside>

        {/* Right: Scrollable Content (60%) */}
        <main className="w-full lg:w-[60%] relative">
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="scroll-section min-h-screen lg:h-screen w-full flex flex-col lg:block items-center justify-center lg:p-24"
            >
              <div className="w-full h-[50vh] lg:h-full relative overflow-hidden bg-zinc-900">
                <img src={section.image} alt={section.alt} className="w-full h-full object-cover" />
              </div>
              
              {/* Mobile text block */}
              <div className="w-full p-8 flex flex-col justify-center lg:hidden bg-[#0c0c0c]">
                {section.index && (
                  <div className="text-[10px] ui-font uppercase tracking-[0.4em] text-white/40 flex items-center gap-4 mb-4">
                    <span>{section.index}</span>
                    <div className="w-8 h-[1px] bg-white/20"></div>
                    <span>{section.eyebrow}</span>
                  </div>
                )}
                <h2 className="display-font text-3xl font-semibold leading-tight tracking-tight mb-4" dangerouslySetInnerHTML={{ __html: section.heading }} />
                <p className="ui-font text-white/50 text-sm leading-relaxed mb-8">
                  {section.desc}
                </p>
                {section.primaryCTA && (
                  <button
                    onClick={() => navigate("/signup")}
                    className="ui-font inline-flex items-center justify-center gap-4 py-3 px-6 text-sm uppercase tracking-widest font-bold w-full transition-all bg-[#C9A84C] text-[#0A0A0B] hover:bg-[#b0923d]"
                  >
                    {section.primaryCTA}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* Image Trail Section at the bottom */}
      <section className="image-trail-section">
        <ImageTrail
          items={TRAIL_IMAGES}
          variant={7}
        />
        <div className="image-trail-overlay">
          <h2 className="image-trail-overlay__heading">
            Wander<br /><em>Without Limits</em>
          </h2>
          <p className="image-trail-overlay__sub">
            Plan less. Experience more.
            Travoura takes care of the details so you never miss the moments.
          </p>
          <Link to="/signup" className="image-trail-overlay__cta">
            Start Planning <span className="ml-2">→</span>
          </Link>
        </div>
        <span className="image-trail-hint">Move your cursor to explore</span>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#080808] border-t border-white/10 pt-20 pb-8 px-8 lg:px-24 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="w-full md:w-1/3">
            <svg width="120" height="30" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
              <text x="0" y="30" fill="#F7F5F0" fontFamily="'Cormorant Garamond', serif" fontSize="32" fontWeight="600" letterSpacing="0.04em">
                Travoura
              </text>
            </svg>
            <p className="ui-font text-white/50 text-sm leading-relaxed max-w-xs">
              Your perfect journey starts here. Discover, plan, and book your dream vacation.
            </p>
          </div>

          <div className="w-full md:w-2/3 flex flex-wrap justify-between gap-8 md:gap-16">
            <div>
              <h4 className="ui-font text-white font-medium mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="flex flex-col gap-4 text-sm text-white/50 ui-font">
                <li><a href="#" className="hover:text-white transition-colors">Flights</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Itinerary</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="ui-font text-white font-medium mb-6 uppercase tracking-widest text-xs">Support</h4>
              <ul className="flex flex-col gap-4 text-sm text-white/50 ui-font">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="ui-font text-white font-medium mb-6 uppercase tracking-widest text-xs">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="ui-font text-white/30 text-xs">
            © 2024 Travoura. All rights reserved.
          </p>
          <div className="flex gap-6 ui-font text-white/30 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none border-x border-white/[0.03] mx-12 lg:mx-24 z-0"></div>
      <div className="fixed top-1/2 left-0 w-full h-[1px] bg-white/[0.03] pointer-events-none z-0"></div>
    </div>
  );
};

export default LandingPage;
