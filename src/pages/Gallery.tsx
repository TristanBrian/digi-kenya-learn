import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Play, Image as ImageIcon, Users, BookOpen, Trophy } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: 'all', name: 'All Photos', icon: ImageIcon },
  { id: 'classrooms', name: 'Classrooms', icon: BookOpen },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'events', name: 'Events', icon: Users },
  { id: 'trips', name: 'Trips', icon: Camera },
  { id: 'library', name: 'Library', icon: BookOpen }
];

const galleryItems = [
  {
    id: 1,
    title: "Grade 3 English Reading Circle",
    caption: "Students enjoying interactive reading session — March 2025",
    category: "classrooms",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 2,
    title: "Sports Day Athletics",
    caption: "Annual sports day with track and field events — December 2024",
    category: "sports",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 3,
    title: "Science Fair Projects",
    caption: "Grade 6 students presenting innovative science projects — November 2024",
    category: "events",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 4,
    title: "ICT Lab Session",
    caption: "Computer literacy class in our modern ICT laboratory — February 2025",
    category: "classrooms",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 5,
    title: "Library Reading Time",
    caption: "Quiet study and reading in our well-equipped library — January 2025",
    category: "library",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 6,
    title: "Field Trip to Museum",
    caption: "Educational trip to National Museum — October 2024",
    category: "trips",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 7,
    title: "Football Team Practice",
    caption: "School football team training session — March 2025",
    category: "sports",
    type: "video",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 8,
    title: "Prize Giving Ceremony",
    caption: "Celebrating academic and character excellence — December 2024",
    category: "events",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 9,
    title: "Art & Craft Class",
    caption: "Creative arts session with Grade 4 students — February 2025",
    category: "classrooms",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 10,
    title: "Safari Park Visit",
    caption: "Environmental studies trip to Nairobi National Park — January 2025",
    category: "trips",
    type: "video",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 11,
    title: "Debate Competition",
    caption: "Inter-class debate competition finals — March 2025",
    category: "events",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  },
  {
    id: 12,
    title: "Netball Championship",
    caption: "School netball team in regional championship — February 2025",
    category: "sports",
    type: "photo",
    thumbnail: "/api/placeholder/400/300"
  }
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Gallery
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Browse photos of learning activities, sports, trips and school events
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="shadow-card border-0 overflow-hidden hover:shadow-elegant transition-all duration-300 group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Placeholder for image */}
                    <div className="w-full h-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Camera className="h-16 w-16 text-muted-foreground" />
                    </div>
                    
                    {/* Video Play Button Overlay */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center">
                          <Play className="h-8 w-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                        {categories.find(cat => cat.id === item.category)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.caption}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No photos in this category yet
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for more photos and videos!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Photo Policy Notice */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-6 w-6 text-accent" />
              <h2 className="font-semibold text-foreground">Photo Usage Policy</h2>
            </div>
            <p className="text-muted-foreground">
              All photos and videos displayed in our gallery are used with proper parent consent and 
              are taken during official school activities. If you have any concerns about photo usage, 
              please contact our administration office.
            </p>
          </div>
        </section>

        {/* Load More */}
        <section className="pb-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Button variant="outline" size="lg" className="font-semibold">
              Load More Photos
              <Camera className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;