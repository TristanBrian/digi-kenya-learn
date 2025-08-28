import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Building, TrendingUp } from "lucide-react";
import excellenceIcon from "@/assets/icon-excellence.jpg";
import teachersIcon from "@/assets/icon-teachers.jpg";
import facilitiesIcon from "@/assets/icon-facilities.jpg";

const highlights = [
  {
    icon: excellenceIcon,
    fallbackIcon: GraduationCap,
    title: "Academic Excellence",
    description: "Consistent high performance with 100% KCPE pass rate and top national rankings.",
    stats: "100% Pass Rate"
  },
  {
    icon: teachersIcon,
    fallbackIcon: Users,
    title: "Qualified Teachers",
    description: "Experienced, certified educators committed to nurturing every child's potential.",
    stats: "25+ Teachers"
  },
  {
    icon: facilitiesIcon,
    fallbackIcon: Building,
    title: "Modern Facilities",
    description: "State-of-the-art classrooms, science labs, library, and sports facilities.",
    stats: "World-Class"
  },
  {
    icon: null,
    fallbackIcon: TrendingUp,
    title: "Consistent Results",
    description: "Track record of excellent academic outcomes and student success stories.",
    stats: "15+ Years"
  }
];

export function HighlightsSection() {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our School?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide a nurturing environment where every child can excel academically, 
            socially, and personally in preparation for their future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.fallbackIcon;
            return (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors">
                      {highlight.icon ? (
                        <img 
                          src={highlight.icon} 
                          alt={highlight.title}
                          className="w-8 h-8 object-contain" 
                        />
                      ) : (
                        <IconComponent className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {highlight.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                      {highlight.description}
                    </p>
                    
                    <div className="text-accent font-semibold text-sm">
                      {highlight.stats}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}