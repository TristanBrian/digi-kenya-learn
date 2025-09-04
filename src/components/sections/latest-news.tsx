import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Clock, MapPin, Users } from "lucide-react";

const newsItems = [
  {
    title: "Term 1 2025 Opening Day",
    date: "January 15, 2025",
    time: "7:30 AM",
    location: "Main Campus",
    summary: "Term 1 2025 begins Monday, January 15th. Welcome back to all students for an exciting new academic year!",
    category: "Announcement",
    image: "/api/placeholder/400/200",
    isUrgent: true,
    attendees: "All Students"
  },
  {
    title: "Grade 6 Science Fair 2025",
    date: "March 20, 2025", 
    time: "9:00 AM - 3:00 PM",
    location: "Science Laboratory",
    summary: "Join us for the Grade 6 Science Fair featuring innovative student projects and experiments.",
    category: "Event",
    image: "/api/placeholder/400/200",
    isUrgent: false,
    attendees: "Parents & Students"
  },
  {
    title: "Digital Learning Workshop",
    date: "February 10, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Computer Lab",
    summary: "Parent workshop on supporting digital learning at home and understanding our tech platform.",
    category: "Workshop",
    image: "/api/placeholder/400/200",
    isUrgent: false,
    attendees: "Parents Only"
  },
  {
    title: "Sports Day 2025",
    date: "April 5, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "School Grounds",
    summary: "Annual inter-house sports competition featuring athletics, swimming, and team sports.",
    category: "Sports",
    image: "/api/placeholder/400/200",
    isUrgent: false,
    attendees: "Whole School"
  }
];

export function LatestNewsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest News & Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay connected with the latest happenings, important announcements, and upcoming events at DigiSchool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {newsItems.map((item, index) => (
            <Card key={index} className="border-0 shadow-card bg-card hover:shadow-elegant transition-all duration-300 group overflow-hidden">
              {/* Image Header */}
              <div className="relative h-48 bg-gradient-subtle overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    {item.isUrgent && (
                      <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
                        URGENT
                      </span>
                    )}
                    <span className="px-2 py-1 bg-accent/90 text-accent-foreground text-xs font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>{item.time}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {item.summary}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-accent" />
                    <span>{item.attendees}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground hover:bg-accent p-0 h-auto font-medium">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="font-semibold group" onClick={() => window.location.href = '/news'}>
            View All News & Events
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}