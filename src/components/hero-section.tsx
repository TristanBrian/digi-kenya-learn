import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-school.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern classroom with engaged students"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-glow/60" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Excellence in
            <span className="block text-accent"> Digital Education</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-slide-up">
            Empowering Kenyan schools with modern digital platforms that connect educators, 
            students, and parents for exceptional learning outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 py-3 shadow-accent"
            >
              Explore Admissions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3"
            >
              Watch Virtual Tour
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
              <Star className="h-8 w-8 text-accent mb-2" />
              <div className="text-2xl font-bold text-primary-foreground">100%</div>
              <div className="text-sm text-primary-foreground/80">Pass Rate</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
              <Users className="h-8 w-8 text-accent mb-2" />
              <div className="text-2xl font-bold text-primary-foreground">500+</div>
              <div className="text-sm text-primary-foreground/80">Students</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
              <Trophy className="h-8 w-8 text-accent mb-2" />
              <div className="text-2xl font-bold text-primary-foreground">15+</div>
              <div className="text-sm text-primary-foreground/80">Awards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
}