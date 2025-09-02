import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
          Ready to Join Our School Community?
        </h2>
        
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Take the first step towards your child's bright future. Our admissions team 
          is ready to guide you through the process.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 py-3 shadow-accent"
          >
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-accent/10 backdrop-blur-sm text-accent hover:bg-accent hover:text-accent-foreground px-8 py-3 font-semibold border-2 border-accent/60 rounded-full transform hover:scale-105 transition-all duration-300"
            >
              Schedule Visit
            </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center text-primary-foreground/80">
          <div className="flex items-center justify-center">
            <Phone className="h-4 w-4 mr-2" />
            <span className="text-sm">+254 700 123 456</span>
          </div>
          <div className="flex items-center justify-center">
            <Mail className="h-4 w-4 mr-2" />
            <span className="text-sm">admissions@digischool.co.ke</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
    </section>
  );
}