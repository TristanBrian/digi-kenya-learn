import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "My child settled in quickly — friendly teachers and great communication.",
    author: "Parent",
    location: "[LOCATION]"
  },
  {
    text: "The individualized attention and modern facilities make all the difference for our daughter's learning.",
    author: "Parent",
    location: "[LOCATION]"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Parents Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Real feedback from our school community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-card bg-card">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-accent mb-4" />
                <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                <div className="text-muted-foreground">
                  <span className="font-medium">{testimonial.author}</span>
                  <span className="mx-2">•</span>
                  <span>{testimonial.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}