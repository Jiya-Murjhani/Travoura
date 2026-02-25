import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TravelCompanionSection from "@/components/TravelCompanionSection";
import PopularDestinations from "@/components/PopularDestinations";
import TravelChatbot from "@/components/TravelChatbot";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TravelCompanionSection />
        <PopularDestinations />
      </main>
      <Footer />
      <TravelChatbot />
    </div>
  );
};

export default Index;
