import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  Smartphone, 
  BookOpen, 
  Users, 
  Play,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Smart Classrooms",
    description: "Interactive whiteboards and digital learning tools",
    highlight: "100% Digital",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Learning",
    description: "Access lessons anywhere with our mobile app",
    highlight: "24/7 Access",
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: BookOpen,
    title: "Digital Library",
    description: "Thousands of e-books and research materials",
    highlight: "10K+ Resources",
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Group projects and peer-to-peer learning",
    highlight: "Team Focus",
    color: "bg-orange-500/10 text-orange-600"
  }
];

const schoolDay = [
  {
    time: "7:30 AM",
    activity: "School Gates Open",
    description: "Students arrive and prepare for the day"
  },
  {
    time: "8:00 AM", 
    activity: "Morning Assembly",
    description: "Daily briefing and motivation"
  },
  {
    time: "8:30 AM",
    activity: "First Lesson",
    description: "Academic learning begins"
  },
  {
    time: "10:30 AM",
    activity: "Tea Break",
    description: "Healthy snacks and social time"
  },
  {
    time: "2:00 PM",
    activity: "Lunch & Activities",
    description: "Nutritious meals and co-curricular"
  },
  {
    time: "4:30 PM",
    activity: "School Closes",
    description: "End of school day"
  }
];

export function InteractiveFeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Interactive Features */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Learning Made Interactive
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience modern education through technology-enhanced learning environments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-card bg-card hover:shadow-elegant transition-all duration-300 group overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                    {feature.highlight}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* A Day in the Life Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              A Day in the Life at DigiSchool
            </h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              From morning assembly to afternoon activities, every moment is designed 
              for growth, learning, and character development.
            </p>
            
            <div className="space-y-6">
              {schoolDay.map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-primary text-sm">
                        {item.time}
                      </span>
                      <span className="font-semibold text-foreground">
                        {item.activity}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Virtual Tour Card */}
            <Card className="border-0 shadow-card bg-gradient-subtle hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-accent" />
                </div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-3">
                  Take a Virtual Tour
                </h4>
                <p className="text-muted-foreground mb-6">
                  Explore our campus from the comfort of your home
                </p>
                <Button className="w-full bg-accent hover:bg-accent-light">
                  Start Virtual Tour
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Visit Card */}
            <Card className="border-0 shadow-card bg-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-3">
                  Schedule a Physical Visit
                </h4>
                <p className="text-muted-foreground mb-6">
                  Experience our facilities and meet our team in person
                </p>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Visit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}