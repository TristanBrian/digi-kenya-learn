import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const testimonials = [
  {
    text: "My child settled in quickly — friendly teachers and great communication.",
    author: "Mary Wanjiku",
    role: "Parent",
    location: "Karen",
    rating: 5,
    hasVideo: false
  },
  {
    text: "The individualized attention and modern facilities make all the difference for our daughter's learning.",
    author: "John Kamau", 
    role: "Parent",
    location: "Nairobi",
    rating: 5,
    hasVideo: true
  },
  {
    text: "DigiSchool's coding program sparked my love for technology. I'm now developing my own mobile app!",
    author: "Grace Achieng",
    role: "Grade 8 Student",
    location: "Kibera",
    rating: 5,
    hasVideo: false
  },
  {
    text: "The teachers here don't just teach subjects, they mentor us for life. I feel confident about high school now.",
    author: "Brian Mwende",
    role: "Grade 7 Student",
    location: "Eastlands",
    rating: 5,
    hasVideo: true
  },
  {
    text: "As a working mother, I appreciate the school's communication app that keeps me updated on my son's progress.",
    author: "Fatuma Ali",
    role: "Parent",
    location: "Westlands",
    rating: 5,
    hasVideo: false
  },
  {
    text: "The holistic approach here has transformed my daughter into a confident young lady with strong values.",
    author: "Peter Njoroge",
    role: "Parent",
    location: "Thika",
    rating: 5,
    hasVideo: false
  }
];

export function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const getCurrentTestimonials = () => {
    const start = currentPage * testimonialsPerPage;
    return testimonials.slice(start, start + testimonialsPerPage);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real testimonials from parents and students who are part of the DigiSchool family
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-foreground font-semibold ml-2">4.9/5</span>
            <span className="text-muted-foreground text-sm ml-1">(150+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {getCurrentTestimonials().map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-card bg-card hover:shadow-elegant transition-all duration-300 group">
              <CardContent className="p-6 relative">
                {testimonial.hasVideo && (
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-accent/10 hover:bg-accent/20">
                      <Play className="h-4 w-4 text-accent" />
                    </Button>
                  </div>
                )}
                
                <Quote className="h-6 w-6 text-accent mb-4 opacity-60" />
                
                {/* Rating Stars */}
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-foreground mb-6 leading-relaxed text-sm">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold text-sm">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevPage}
            className="rounded-full w-10 h-10 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentPage ? 'bg-accent w-6' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextPage}
            className="rounded-full w-10 h-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}