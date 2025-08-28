import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Eye, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Our School
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Established in 2009, we have been dedicated to providing quality education 
              that nurtures academic excellence, character development, and leadership skills.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 bg-primary/5 border-primary/20">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-primary mr-3" />
                    <h2 className="font-display text-2xl font-bold text-primary">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide holistic education that develops confident, caring, and creative individuals 
                    who are prepared to be productive global citizens and lifelong learners.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 bg-accent/5 border-accent/20">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Eye className="h-8 w-8 text-accent mr-3" />
                    <h2 className="font-display text-2xl font-bold text-accent">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the leading educational institution in Kenya, recognized for academic excellence, 
                    character development, and preparing students for success in the 21st century.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leadership Message */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Welcome from Our Principal
              </h2>
            </div>
            
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-16 w-16 text-primary" />
                  </div>
                  <div>
                    <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                      "Welcome to our school family! We are committed to providing an environment where 
                      every child can discover their potential, develop their talents, and build the 
                      foundation for a successful future. Our dedicated team of educators works tirelessly 
                      to ensure that each student receives personalized attention and support."
                    </blockquote>
                    <footer className="text-foreground">
                      <strong>Mrs. Grace Wanjiku</strong>
                      <span className="text-muted-foreground ml-2">- School Principal</span>
                    </footer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Our Achievements
              </h2>
              <p className="text-lg text-muted-foreground">
                Recognition of our commitment to educational excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Best Private School</h3>
                  <p className="text-sm text-muted-foreground">
                    Karen Region Education Awards 2023
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">KCPE Excellence</h3>
                  <p className="text-sm text-muted-foreground">
                    100% Pass Rate for 5 consecutive years
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Innovation in Education</h3>
                  <p className="text-sm text-muted-foreground">
                    Digital Learning Pioneer Award 2022
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;