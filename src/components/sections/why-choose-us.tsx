import { Users, GraduationCap, MonitorSpeaker, Globe, Briefcase, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
  { icon: GraduationCap, title: "Accredited Programs", description: "CUE-accredited degree programs recognized by employers across East Africa and globally" },
  { icon: Users, title: "Distinguished Faculty", description: "PhD-qualified lecturers with industry experience and active research portfolios" },
  { icon: MonitorSpeaker, title: "Modern Facilities", description: "State-of-the-art labs, smart classrooms, high-speed campus Wi-Fi, and digital library" },
  { icon: Globe, title: "Global Partnerships", description: "Exchange programs and research collaborations with universities in Europe, Asia, and the Americas" },
  { icon: Briefcase, title: "Industry Connections", description: "Internship pipelines and career placement support with top Kenyan and multinational employers" },
  { icon: BookOpen, title: "Research Excellence", description: "Cutting-edge research centers driving innovation in technology, agriculture, and health" },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose DigiUniversity</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what makes us the ideal institution for your higher education journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <Card key={i} className="border-0 shadow-card bg-card/80 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <reason.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-3">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
