import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  GraduationCap, 
  Award, 
  Star,
  ChevronRight,
  Zap,
  Target,
  Users2
} from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "National Science Olympiad",
    year: "2024",
    description: "Our Grade 8 team won 1st place in the National Science Competition",
    highlight: "1st Place",
    color: "bg-yellow-500/10 text-yellow-600"
  },
  {
    icon: GraduationCap,
    title: "KCPE Excellence",
    year: "2024",
    description: "98% of students scored above 350 marks in KCPE examinations",
    highlight: "98% Success",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: Award,
    title: "Innovation Award",
    year: "2024", 
    description: "Best Digital Learning Integration - Kenya Education Awards",
    highlight: "National Winner",
    color: "bg-purple-500/10 text-purple-600"
  }
];

const successMetrics = [
  {
    icon: Target,
    value: "98%",
    label: "Pass Rate",
    description: "Students achieving target grades"
  },
  {
    icon: Users2,
    value: "15:1",
    label: "Student Ratio",
    description: "Personalized attention guaranteed"
  },
  {
    icon: Zap,
    value: "100%",
    label: "Digital Ready",
    description: "Technology integrated learning"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Parent Rating", 
    description: "Satisfaction from families"
  }
];

const graduateStories = [
  {
    name: "Sarah Mwangi",
    achievement: "Full Scholarship to Starehe Girls Centre",
    grade: "Former Grade 8 Student (2023)",
    quote: "DigiSchool's innovative teaching methods prepared me for success at the national level."
  },
  {
    name: "David Ochieng",
    achievement: "Kenya Science & Technology Fair Winner",
    grade: "Current Grade 7 Student",
    quote: "The coding and robotics program here opened my eyes to endless possibilities."
  },
  {
    name: "Amina Hassan",
    achievement: "Young Entrepreneur of the Year",
    grade: "Alumni (2022)",
    quote: "The business skills I learned at DigiSchool helped me start my own company at 15."
  }
];

export function SuccessStoriesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories & Achievements
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our students consistently excel academically and develop into well-rounded individuals 
            ready for the challenges of tomorrow
          </p>
        </div>

        {/* Recent Achievements */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-semibold text-foreground mb-8 text-center">
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-0 shadow-card bg-card hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${achievement.color} group-hover:scale-110 transition-transform duration-300`}>
                    <achievement.icon className="h-8 w-8" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                      {achievement.highlight}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg text-foreground mb-2">
                    {achievement.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    {achievement.description}
                  </p>
                  <span className="text-primary font-medium text-sm">
                    {achievement.year}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mb-16 p-8 bg-gradient-subtle rounded-2xl">
          <h3 className="font-display text-2xl font-semibold text-foreground mb-8 text-center">
            Academic Excellence Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                  <metric.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {metric.value}
                </div>
                <div className="font-semibold text-foreground mb-1">
                  {metric.label}
                </div>
                <div className="text-muted-foreground text-xs">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graduate Stories */}
        <div>
          <h3 className="font-display text-2xl font-semibold text-foreground mb-8 text-center">
            Student Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {graduateStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-card bg-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {story.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {story.grade}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h5 className="font-medium text-primary mb-2">
                      {story.achievement}
                    </h5>
                    <blockquote className="text-muted-foreground text-sm italic leading-relaxed">
                      "{story.quote}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" className="font-semibold">
              Read More Success Stories
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}