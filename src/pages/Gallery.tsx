import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Camera, Play, Image as ImageIcon, Users, BookOpen, Trophy, Search, X, Share2, Download, Heart, Calendar, Eye } from "lucide-react";
import { useState, useMemo } from "react";

import galleryDigitalClassroom from "@/assets/gallery-digital-classroom.jpg";
import galleryCodingLab from "@/assets/gallery-coding-lab.jpg";
import galleryOutdoorTech from "@/assets/gallery-outdoor-tech.jpg";

const categories = [
  { id: 'all', name: 'All Photos', icon: ImageIcon, count: 10 },
  { id: 'classrooms', name: 'Classrooms', icon: BookOpen, count: 4 },
  { id: 'sports', name: 'Sports', icon: Trophy, count: 1 },
  { id: 'events', name: 'Events', icon: Users, count: 2 },
  { id: 'trips', name: 'Trips', icon: Camera, count: 2 },
  { id: 'library', name: 'Library', icon: BookOpen, count: 1 }
];

const galleryItems = [
  {
    id: 1,
    title: "Smart Digital Classroom",
    caption: "Students learning with tablets and interactive whiteboards — DigiSchool 2025",
    category: "classrooms",
    type: "photo",
    thumbnail: galleryDigitalClassroom
  },
  {
    id: 2,
    title: "Coding Lab Session",
    caption: "Programming classes in our modern computer lab — March 2025",
    category: "classrooms",
    type: "photo",
    thumbnail: galleryCodingLab
  },
  {
    id: 3,
    title: "Tech-Enhanced Outdoor Learning",
    caption: "Combining nature and technology for holistic education — February 2025",
    category: "events",
    type: "photo",
    thumbnail: galleryOutdoorTech
  },
  {
    id: 4,
    title: "AI Learning Workshop",
    caption: "Introduction to artificial intelligence for Grade 6 students — March 2025",
    category: "classrooms",
    type: "photo",
    thumbnail: "/api/placeholder/400/300",
    date: "2025-03-15",
    views: 245
  },
  {
    id: 5,
    title: "Digital Library Hub",
    caption: "E-books and interactive learning resources — January 2025",
    category: "library",
    type: "photo",
    thumbnail: "/api/placeholder/400/300",
    date: "2025-01-20",
    views: 189
  },
  {
    id: 6,
    title: "Virtual Reality Field Trip",
    caption: "Exploring ancient civilizations through VR technology — February 2025",
    category: "trips",
    type: "video",
    thumbnail: "/api/placeholder/400/300",
    date: "2025-02-14",
    views: 567
  },
  {
    id: 7,
    title: "Robotics Competition",
    caption: "Student-built robots in inter-school competition — March 2025",
    category: "sports",
    type: "video",
    thumbnail: "/api/placeholder/400/300",
    date: "2025-03-10",
    views: 432
  },
  {
    id: 8,
    title: "Digital Innovation Fair",
    caption: "Students showcase their tech projects and innovations — December 2024",
    category: "events",
    type: "photo",
    thumbnail: "/api/placeholder/400/300",
    date: "2024-12-18",
    views: 389
  },
  {
    id: 9,
    title: "3D Design Workshop",
    caption: "Learning 3D modeling and printing with Grade 7 students — February 2025",
    category: "classrooms",
    type: "photo",
    thumbnail: "/api/placeholder/400/300",
    date: "2025-02-28",
    views: 298
  },
  {
    id: 10,
    title: "Tech Safari Experience",
    caption: "Using drones and cameras to document wildlife — January 2025",
    category: "trips",
    type: "video",
    thumbnail: "/api/placeholder/400/300",
    date: "2025-01-25",
    views: 612
  }
];

  // Add missing date and views for first three items
  const galleryItemsWithMeta = galleryItems.map(item => ({
    ...item,
    date: item.date || "2025-03-01",
    views: item.views || Math.floor(Math.random() * 500) + 100
  }));
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let items = activeCategory === 'all' 
      ? galleryItemsWithMeta 
      : galleryItemsWithMeta.filter(item => item.category === activeCategory);
    
    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items;
  }, [activeCategory, searchQuery]);

  const openLightbox = (item: any) => {
    setSelectedImage(item);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              DigiSchool Gallery
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Discover our digital learning environment, innovative classrooms, and tech-powered education
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search photos and videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1.5 h-7 px-2"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2 h-10"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Results Info */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? (
                  <>Showing {filteredItems.length} results for "{searchQuery}"</>
                ) : (
                  <>Showing {filteredItems.length} items in {categories.find(c => c.id === activeCategory)?.name}</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="shadow-card border-0 overflow-hidden hover:shadow-elegant transition-all duration-300 group cursor-pointer break-inside-avoid mb-6"
                  onClick={() => openLightbox(item)}
                >
                  <div className="relative overflow-hidden">
                    {/* Image */}
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    {/* Fallback placeholder */}
                    <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center absolute inset-0" style={{ display: 'none' }}>
                      <Camera className="h-16 w-16 text-muted-foreground" />
                    </div>
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-center text-white">
                        {item.type === 'video' ? (
                          <Play className="h-8 w-8 mx-auto mb-2" />
                        ) : (
                          <Eye className="h-8 w-8 mx-auto mb-2" />
                        )}
                        <p className="text-sm">Click to view</p>
                      </div>
                    </div>

                    {/* Video Play Button */}
                    {item.type === 'video' && (
                      <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 bg-primary/90 rounded-full flex items-center justify-center">
                          <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(cat => cat.id === item.category)?.name}
                      </Badge>
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.caption}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16 col-span-full">
                <div className="max-w-md mx-auto">
                  {searchQuery ? (
                    <>
                      <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No results found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try searching with different keywords or browse by category
                      </p>
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        Clear search
                      </Button>
                    </>
                  ) : (
                    <>
                      <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No photos in this category yet
                      </h3>
                      <p className="text-muted-foreground">
                        Check back soon for more photos and videos!
                      </p>
                    </>
                  )}
                </div>
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

        {/* Lightbox Modal */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-4xl w-full p-0 bg-black/95">
            {selectedImage && (
              <>
                <DialogHeader className="p-6 pb-3">
                  <DialogTitle className="text-white text-left">{selectedImage.title}</DialogTitle>
                </DialogHeader>
                
                <div className="relative px-6">
                  <img 
                    src={selectedImage.thumbnail} 
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/800/600";
                    }}
                  />
                  
                  {selectedImage.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center">
                        <Play className="h-10 w-10 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 pt-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedImage.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{selectedImage.views} views</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(cat => cat.id === selectedImage.category)?.name}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm">
                    {selectedImage.caption}
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Load More */}
        {filteredItems.length > 0 && (
          <section className="pb-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Button variant="outline" size="lg" className="font-semibold">
                Load More Photos
                <Camera className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;