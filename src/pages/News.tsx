import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Users, Bell, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const newsEvents = [
  {
    id: 1,
    title: "Prize-Giving Day 2025",
    type: "event",
    date: "Saturday, 5 December 2025",
    time: "10:00 AM",
    location: "School Main Hall",
    excerpt: "Annual celebration of student achievements in academics, sports, and character development.",
    content: "Join us for our annual Prize-Giving Day as we celebrate the outstanding achievements of our students throughout the year. The ceremony will include academic awards, sports recognition, character development certificates, and special performances by our students. Parents and guardians are invited to witness this special celebration of excellence.",
    featured: true
  },
  {
    id: 2,
    title: "Term 1 2025 Registration Open",
    type: "news",
    date: "December 15, 2024",
    excerpt: "Applications for Term 1 2025 are now open with early bird discount available.",
    content: "We are pleased to announce that registration for Term 1 2025 is now officially open. Early bird discount of 10% is available for all applications submitted before January 15th, 2025. Visit our admissions page to complete your online application.",
    featured: true
  },
  {
    id: 3,
    title: "Science Fair Success",
    type: "news",
    date: "November 28, 2024",
    excerpt: "Our students showcased innovative projects at the regional science fair.",
    content: "Congratulations to our Grade 6-8 students who participated in the Regional Science Fair. Three of our projects won recognition for innovation and creativity, demonstrating the quality of STEM education at our school.",
    featured: false
  },
  {
    id: 4,
    title: "Sports Day 2024",
    type: "event",
    date: "Friday, 20 December 2024",
    time: "8:00 AM - 4:00 PM",
    location: "School Sports Field",
    excerpt: "Annual sports day featuring athletics, team games, and fun activities for all grades.",
    content: "Our annual Sports Day brings together students, parents, and teachers for a day of friendly competition and fun. Events include track and field, football, netball, and various fun games for younger students.",
    featured: false
  }
];

const News = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      toast({
        title: "Contact Required",
        description: "Please provide either email or phone number.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Subscription Successful!",
      description: "You'll receive updates about school news and events.",
    });

    setEmail('');
    setPhone('');
  };

  const featuredNews = newsEvents.filter(item => item.featured);
  const otherNews = newsEvents.filter(item => !item.featured);

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
              Latest announcements, term calendar and upcoming events at [SCHOOL_NAME]
            </p>
          </div>
        </section>

        {/* Featured News */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Featured Announcements
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {featuredNews.map((item) => (
                <Card key={item.id} className="shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-accent font-medium mb-2">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                      {item.time && (
                        <>
                          <span className="mx-2">•</span>
                          {item.time}
                        </>
                      )}
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {item.title}
                    </CardTitle>
                    {item.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {item.content}
                    </p>
                    <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      {item.type === 'event' ? 'Event' : 'News'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Other News */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Recent Updates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherNews.map((item) => (
                <Card key={item.id} className="shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 text-sm text-accent font-medium mb-2">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                      {item.time && (
                        <>
                          <span className="mx-2">•</span>
                          {item.time}
                        </>
                      )}
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {item.title}
                    </CardTitle>
                    {item.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      {item.type === 'event' ? 'Event' : 'News'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                        <strong>Reminder:</strong> Prize-Giving Day at [SCHOOL_NAME] on Sat, 5 Dec at 10:00 AM. See details: [LINK]
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
