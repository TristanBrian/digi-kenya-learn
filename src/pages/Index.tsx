import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/hero-section";
import { QuickIntroSection } from "@/components/sections/quick-intro";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { StatisticsBar } from "@/components/sections/statistics-bar";
import { InteractiveFeaturesSection } from "@/components/sections/interactive-features";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { SuccessStoriesSection } from "@/components/sections/success-stories";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { LatestNewsSection } from "@/components/sections/latest-news";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <QuickIntroSection />
        <WhyChooseUsSection />
        <StatisticsBar />
        <InteractiveFeaturesSection />
        <HowItWorksSection />
        <SuccessStoriesSection />
        <TestimonialsSection />
        <LatestNewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
