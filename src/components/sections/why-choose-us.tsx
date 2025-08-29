import { Users, GraduationCap, MonitorSpeaker } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Average 30 students — individual attention for every child"
  },
  {
    icon: GraduationCap,
    title: "Experienced Teachers",
    description: "Qualified educators & strong exam performance track record"
  },
  {
    icon: MonitorSpeaker,
    title: "Modern Facilities",
    description: "ICT lab, sports facilities, and engaging after-school clubs"
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our school the ideal place for your child's educational journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <Card key={index} className="border-0 shadow-card bg-card/80 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <reason.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}