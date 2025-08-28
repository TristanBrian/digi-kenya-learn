import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/hero-section";
import { HighlightsSection } from "@/components/highlights-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <HighlightsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
