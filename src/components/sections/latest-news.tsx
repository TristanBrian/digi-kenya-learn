import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const newsItems = [
  {
    title: "Term 1 2025 Registration Open",
    date: "December 15, 2024",
    summary: "Applications for Term 1 2025 are now open. Early bird discount available until January 15th.",
    category: "Admissions"
  },
  {
    title: "Prize-Giving Day 2024",
    date: "December 10, 2024",
    summary: "Celebrating our students' achievements in academics, sports, and character development.",
    category: "Events"
  }
];

export function LatestNewsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest News
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with school announcements and events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {newsItems.map((item, index) => (
            <Card key={index} className="border-0 shadow-card bg-card hover:shadow-elegant transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-sm text-accent font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {item.summary}
                </p>
                <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                  {item.category}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="font-semibold">
            View All News
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}