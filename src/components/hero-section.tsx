import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-school.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Smiling students in classroom at [SCHOOL_NAME]"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary-glow/70" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 animate-fade-in">
            Nurturing Confident Learners
            <span className="block text-accent mt-2">PP1 to Grade 8</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/95 mb-8 max-w-2xl mx-auto animate-slide-up font-medium">
            Safe classrooms • Caring teachers • Holistic learning
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 py-4 shadow-accent text-base"
            onClick={() => window.location.href = '/admissions'}
          >
            Enroll Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15 px-8 py-4 font-semibold text-base backdrop-blur-sm"
            onClick={() => window.location.href = '/fees'}
          >
            Pay Fees
          </Button>
          <Button 
            variant="ghost" 
            size="lg"
            className="text-primary-foreground hover:bg-primary-foreground/15 px-8 py-4 font-semibold text-base"
            onClick={() => window.location.href = '/contact'}
          >
            Visit Us
          </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
}