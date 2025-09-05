import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Bell, ArrowRight, Search, Filter, Clock, Eye, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewsEvent {
  id: string;
  title: string;
  type: string;
  excerpt: string;
  content: string;
  event_date: string | null;
  event_location: string | null;
  featured_image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string | null;
}

const News = () => {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<NewsEvent[]>([]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'news' | 'event'>('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { toast } = useToast();

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [newsEvents, searchQuery, filterType]);

  const fetchNewsEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('news_events')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsEvents(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to static data for demo
      setNewsEvents([
        {
          id: '1',
          title: "Prize-Giving Day 2025",
          type: "event",
          excerpt: "Annual celebration of student achievements in academics, sports, and character development.",
          content: "Join us for our annual Prize-Giving Day as we celebrate the outstanding achievements of our students throughout the year.",
          event_date: "2025-12-05T10:00:00Z",
          event_location: "School Main Hall",
          featured_image_url: null,
          published: true,
          created_at: "2024-11-01T00:00:00Z",
          author_id: null
        },
        {
          id: '2',
          title: "Term 1 2025 Registration Open",
          type: "news",
          excerpt: "Applications for Term 1 2025 are now open with early bird discount available.",
          content: "We are pleased to announce that registration for Term 1 2025 is now officially open. Early bird discount of 10% is available for all applications submitted before January 15th, 2025.",
          event_date: null,
          event_location: null,
          featured_image_url: null,
          published: true,
          created_at: "2024-12-15T00:00:00Z",
          author_id: null
        },
        {
          id: '3',
          title: "Science Fair Success",
          type: "news",
          excerpt: "Our students showcased innovative projects at the regional science fair.",
          content: "Congratulations to our Grade 6-8 students who participated in the Regional Science Fair. Three of our projects won recognition for innovation and creativity, demonstrating the quality of STEM education at our school.",
          event_date: null,
          event_location: null,
          featured_image_url: null,
          published: true,
          created_at: "2024-11-28T00:00:00Z",
          author_id: null
        },
        {
          id: '4',
          title: "Sports Day 2024",
          type: "event",
          excerpt: "Annual sports day featuring athletics, team games, and fun activities for all grades.",
          content: "Our annual Sports Day brings together students, parents, and teachers for a day of friendly competition and fun. Events include track and field, football, netball, and various fun games for younger students.",
          event_date: "2024-12-20T08:00:00Z",
          event_location: "School Sports Field",
          featured_image_url: null,
          published: true,
          created_at: "2024-11-15T00:00:00Z",
          author_id: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = newsEvents;

    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      toast({
        title: "Contact Required",
        description: "Please provide either email or phone number.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send this to your backend/Supabase
    toast({
      title: "Subscription Successful!",
      description: "You'll receive updates about school news and events.",
    });

    setEmail('');
    setPhone('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const featuredNews = filteredEvents.slice(0, 2);
  const otherNews = paginatedEvents.slice(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              News & Events
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Latest announcements, term calendar and upcoming events at DigiSchool
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news and events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={(value: 'all' | 'news' | 'event') => setFilterType(value)}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="news">News Only</SelectItem>
                  <SelectItem value="event">Events Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                {searchQuery ? (
                  <>Showing {filteredEvents.length} results for "{searchQuery}"</>
                ) : (
                  <>Showing {filteredEvents.length} {filterType === 'all' ? 'items' : filterType + 's'}</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{filteredEvents.filter(e => e.type === 'news').length} News</Badge>
                <Badge variant="outline">{filteredEvents.filter(e => e.type === 'event').length} Events</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Featured Announcements
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.map((item) => (
                  <Card key={item.id} className="shadow-card border-0 hover:shadow-elegant transition-all duration-300 group">
                    {item.featured_image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.featured_image_url} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-accent font-medium">
                          <Calendar className="h-4 w-4" />
                          {item.event_date ? formatEventDateTime(item.event_date) : formatDate(item.created_at)}
                        </div>
                        <Badge variant={item.type === 'event' ? 'default' : 'secondary'}>
                          {item.type === 'event' ? 'Event' : 'News'}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      {item.event_location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {item.event_location}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(item.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>234 views</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main News Grid */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {otherNews.length === 0 && filteredEvents.length <= 2 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {searchQuery ? 'No results found' : 'No additional news items'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Check back soon for more updates'}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                    {searchQuery ? 'Search Results' : 'Recent Updates'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {(otherNews.length > 0 ? otherNews : filteredEvents.slice(0, 6)).map((item) => (
                    <Card key={item.id} className="shadow-card border-0 hover:shadow-elegant transition-all duration-300 group cursor-pointer">
                      {item.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={item.featured_image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm text-accent font-medium">
                            <Calendar className="h-4 w-4" />
                            {item.event_date ? formatEventDateTime(item.event_date) : formatDate(item.created_at)}
                          </div>
                          <Badge variant={item.type === 'event' ? 'default' : 'secondary'} className="text-xs">
                            {item.type === 'event' ? 'Event' : 'News'}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </CardTitle>
                        {item.event_location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {item.event_location}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Read more
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Bell className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Subscribe to School Updates
              </h2>
              <p className="text-lg text-muted-foreground">
                Stay informed about important announcements, events, and news
              </p>
            </div>

            <Card className="shadow-card border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number (for SMS updates)</Label>
                      <Input 
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+2547XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 shadow-accent"
                    >
                      Subscribe to Updates
                      <Bell className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    You can provide either email or phone number. We respect your privacy and won't spam you.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sample Event Reminder */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Event Reminders
              </h2>
              <p className="text-lg text-muted-foreground">
                Example of SMS reminders you'll receive for upcoming events
              </p>
            </div>

            <Card className="shadow-card border-0 bg-accent/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Sample SMS Reminder:</h3>
                    <div className="bg-background p-4 rounded-lg border">
                      <p className="text-sm text-foreground">
                        <strong>Reminder:</strong> Prize-Giving Day at DigiSchool on Sat, 5 Dec at 10:00 AM. See details: [LINK]
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;