import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";
import heroImage from "@/assets/hero-digischool.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern digital learning at DigiSchool"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary-glow/60 to-accent/50" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary-foreground rounded-full animate-ping opacity-40" />
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-accent/50 rounded-full animate-bounce opacity-30" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium text-primary-foreground">Kenya's Leading Digital School</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-primary-foreground mb-6 animate-fade-in leading-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent mt-2">
              DigiSchool
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/95 mb-4 max-w-3xl mx-auto animate-slide-up font-medium leading-relaxed">
            Where Technology Meets Excellence
          </p>
          
          <p className="text-sm sm:text-base md:text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up font-medium">
            Digital Learning • AI-Enhanced Education • Future-Ready Students
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 animate-slide-up">
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-primary-foreground">Smart Classrooms</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-primary-foreground">Expert Teachers</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-primary-foreground">Holistic Growth</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-16 animate-slide-up max-w-4xl mx-auto px-4">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent-light text-accent-foreground font-bold px-6 sm:px-10 py-4 sm:py-6 shadow-accent text-base sm:text-lg rounded-full transform hover:scale-105 transition-all duration-300 border-2 border-accent w-full sm:w-auto"
              onClick={() => window.location.href = '/admissions'}
            >
              <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Enroll Today
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-accent/80 bg-accent/10 backdrop-blur-sm text-accent hover:bg-accent hover:text-accent-foreground px-6 sm:px-10 py-4 sm:py-6 font-bold text-base sm:text-lg rounded-full transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              onClick={() => window.location.href = '/fees'}
            >
              Pay School Fees
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 sm:px-10 py-4 sm:py-6 font-bold text-base sm:text-lg rounded-full transform hover:scale-105 transition-all duration-300 border-2 border-primary-foreground/40 w-full sm:w-auto"
              onClick={() => window.location.href = '/contact'}
            >
              Book a Visit
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/30 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-primary-glow/25 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-accent-light/15 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }} />
    </section>
  );
}