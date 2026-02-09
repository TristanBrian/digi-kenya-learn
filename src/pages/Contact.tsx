import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredContact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        message: formData.message.trim(),
        preferred_contact: formData.preferredContact || null,
        status: 'new'
      };

      const { error } = await supabase
        .from('contact_messages' as any)
        .insert(submissionData);

      if (error) {
        console.error('Contact insertion error:', error);
        throw error;
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll respond within 2 business days.",
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        preferredContact: ''
      });

    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Contact Eastern Africa Integrated College to learn about our programs, apply, or schedule a campus visit
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                    Get in Touch
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    We'd love to hear from you. Reach out to us using any of the methods below.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-card border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Address</h3>
                          <p className="text-muted-foreground">
                            ABC Imani Plaza, 4th Floor<br />
                            Ngei Road<br />
                            Machakos Town, Kenya
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                          <p className="text-muted-foreground mb-2">
                            <a href="tel:+254701234567" className="hover:text-accent transition-colors">
                              +254 701 234 567
                            </a>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Office Hours: Monday-Friday 8AM-5PM
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Email</h3>
                          <p className="text-muted-foreground">
                            <a href="mailto:info@eaic.ac.ke" className="hover:text-accent transition-colors">
                              info@eaic.ac.ke
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-card border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Visiting Hours</h3>
                          <p className="text-muted-foreground">
                            Monday - Friday: 8:00 AM – 4:00 PM<br />
                            Saturday: 9:00 AM – 1:00 PM<br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* WhatsApp Button */}
                <Card className="shadow-card border-0 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          Quick questions? Chat with us on WhatsApp
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open('https://wa.me/254700123456', '_blank')}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat with us
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you within 2 business days.
                    </p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input 
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone *</Label>
                          <Input 
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="+2547XXXXXXXX"
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                        <Select value={formData.preferredContact} onValueChange={(value) => setFormData({...formData, preferredContact: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="How would you like us to contact you?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">Phone Call</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea 
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="Tell us how we can help you..."
                          rows={6}
                          required 
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending Message..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Visit Our School
              </h2>
              <p className="text-lg text-muted-foreground">
                Find us easily with the map below
              </p>
            </div>

            <Card className="shadow-card border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="w-full h-96 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Google Maps integration would be embedded here
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Karen Road, Plot 123, Karen, Nairobi
                    </p>
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

export default Contact;
