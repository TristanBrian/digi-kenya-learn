import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, Users, Award } from "lucide-react";

const teamMembers = [
  {
    name: "Rev. Dr. Patrick Kipchoge",
    role: "Principal",
    bio: "20+ years in technical education leadership, doctorate in vocational studies",
    image: "/api/placeholder/150/150"
  },
  {
    name: "Eng. Catherine Omondi",
    role: "Head of ICT Programs",
    bio: "Software engineer with 15 years in industry, specialized in certification programs",
    image: "/api/placeholder/150/150"
  },
  {
    name: "Mr. Abraham Kipkemoi",
    role: "Head of Business Programs",
    bio: "MBA graduate, entrepreneur with expertise in professional development",
    image: "/api/placeholder/150/150"
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                About EAIC
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                Discover our heritage, mission to transform lives through technical education, and our vision for East Africa's future
              </p>
            </div>
          </div>
        </section>

        {/* Principal Welcome */}
        <section className="py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-card border-0">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-1">
                    <div className="w-48 h-48 mx-auto bg-muted rounded-full flex items-center justify-center">
                      <GraduationCap className="h-24 w-24 text-accent" />
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                      Principal's Welcome
                    </h2>
                    <div className="prose prose-lg text-muted-foreground space-y-4">
                      <p>
                        Welcome to Eastern Africa Integrated College. Since 1950, we've been transforming lives through faith-integrated technical and vocational education.
                      </p>
                      <p>
                        We prepare skilled professionals ready for the African job market. Our curriculum combines international certifications with Christian values, ensuring our graduates are not just technically competent but also ethical leaders ready to impact their communities.
                      </p>
                      <p>
                        Every student who graduates from EAIC carries the tools for professional success and the values for meaningful contribution to society.
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="font-semibold text-primary">— Principal, Eastern Africa Integrated College</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-card border-0">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-accent mx-auto mb-6" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To nurture compassionate, curious learners who contribute positively to society and become responsible global citizens.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 text-accent mx-auto mb-6" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Deliver quality primary education blending academics, character formation and practical life skills in a nurturing environment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">Our History</h2>
            <div className="prose prose-lg text-muted-foreground mx-auto">
              <p>
                Founded in 2008, DigiSchool began with a vision to provide quality primary education in Karen, Nairobi. 
                Starting with just 45 students, we have grown to become a trusted educational institution serving over 500 families.
              </p>
              <p>
                Over the years, we have maintained our commitment to academic excellence while embracing modern teaching methods 
                and technology to prepare our students for the digital age.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Dedicated professionals committed to your child's success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="shadow-card border-0 text-center">
                  <CardContent className="p-8">
                    <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                      <Users className="h-16 w-16 text-accent" />
                    </div>
                    <h3 className="font-semibold text-xl text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className="text-accent font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
