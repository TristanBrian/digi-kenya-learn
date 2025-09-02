import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, Users, Award } from "lucide-react";

const teamMembers = [
  {
    name: "Mrs. Sarah Wanjiku",
    role: "Headteacher",
    bio: "15+ years in primary education, passionate about holistic child development",
    image: "/api/placeholder/150/150"
  },
  {
    name: "Mr. John Kariuki",
    role: "Deputy Head",
    bio: "Mathematics specialist with expertise in curriculum development",
    image: "/api/placeholder/150/150"
  },
  {
    name: "Ms. Grace Muthoni",
    role: "Head of ICT",
    bio: "Computer science graduate, leading digital learning initiatives",
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
                About DigiSchool
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                Discover our mission, values, and the dedicated team committed to your child's success
              </p>
            </div>
          </div>
        </section>

        {/* Headteacher Welcome */}
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
                      Headteacher's Welcome
                    </h2>
                    <div className="prose prose-lg text-muted-foreground space-y-4">
                      <p>
                        Welcome to DigiSchool. We are committed to academic excellence and moral development in every child who walks through our doors.
                      </p>
                      <p>
                        Our dedicated staff nurture curiosity and individual growth in a safe, supportive environment where every student can thrive. We believe in developing not just academic skills, but also character, creativity, and critical thinking.
                      </p>
                      <p>
                        Together, we're building the foundation for your child's bright future.
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="font-semibold text-primary">— Mrs. Sarah Wanjiku, Headteacher</p>
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