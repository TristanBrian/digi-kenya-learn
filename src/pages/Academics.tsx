import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Trophy, Microscope, Music, Palette, ArrowRight } from "lucide-react";

const classLevels = [
  {
    title: "Early Years (PP1-PP3)",
    description: "Play-based foundations",
    details: "Building social skills, basic literacy and numeracy through interactive play and discovery learning.",
    icon: Users
  },
  {
    title: "Lower Primary (Grade 1-4)",
    description: "Literacy, numeracy, basics",
    details: "Strengthening reading, writing, and mathematical foundations with creative problem-solving approaches.",
    icon: BookOpen
  },
  {
    title: "Upper Primary (Grade 5-8)",
    description: "Exam prep, STEM exposure",
    details: "Advanced curriculum preparation for KCPE with focus on science, technology, and critical thinking skills.",
    icon: Microscope
  }
];

const clubs = [
  { name: "Science Club", icon: Microscope, description: "Hands-on experiments and discovery" },
  { name: "Computer Club", icon: BookOpen, description: "Digital literacy and coding basics" },
  { name: "Music & Drama", icon: Music, description: "Creative expression and performance" },
  { name: "Art Club", icon: Palette, description: "Visual arts and creative projects" },
  { name: "Sports", icon: Trophy, description: "Football, netball, and athletics" },
  { name: "Debate Club", icon: Users, description: "Public speaking and critical thinking" }
];

const Academics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Strong Curriculum • Practical Learning • Extra-curricular Balance
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Comprehensive education that prepares students for academic success and life beyond the classroom
            </p>
          </div>
        </section>

        {/* Curriculum Overview */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Curriculum Overview
            </h2>
            <div className="prose prose-lg text-muted-foreground mx-auto space-y-4">
              <p>
                We follow the Competency-Based Curriculum (CBC) with a focus on developing practical skills, 
                critical thinking, and character formation. Our approach integrates traditional academic excellence 
                with modern learning outcomes.
              </p>
              <p>
                Key focus areas include literacy and communication, numeracy, ICT integration, 
                environmental awareness, and life skills development that prepare students for the modern world.
              </p>
            </div>
          </div>
        </section>

        {/* Class Breakdown */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Class Structure
              </h2>
              <p className="text-lg text-muted-foreground">
                Age-appropriate learning progression from PP1 to Grade 8
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {classLevels.map((level, index) => (
                <Card key={index} className="shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                      <level.icon className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {level.title}
                    </CardTitle>
                    <p className="text-accent font-medium">{level.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {level.details}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Assessments & Reports */}
        <section className="py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                  Assessments & Reports
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We conduct comprehensive termly assessments that evaluate not just academic performance, 
                    but also social skills, creativity, and character development.
                  </p>
                  <p>
                    Teachers provide detailed feedback through our digital report cards, accessible via the parent portal. 
                    Regular progress updates keep parents informed of their child's journey.
                  </p>
                  <p>
                    Our assessment approach focuses on growth and improvement rather than just grades, 
                    encouraging students to reach their full potential.
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 p-8 rounded-lg">
                <h3 className="font-semibold text-xl text-foreground mb-4">Assessment Features</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Termly comprehensive evaluations
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Digital report cards with detailed feedback
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Parent-teacher conferences
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Progress tracking and goal setting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Enrichment & Clubs */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Enrichment & Clubs
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover talents and develop new skills through our diverse club activities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club, index) => (
                <Card key={index} className="shadow-card border-0 text-center hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                      <club.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {club.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {club.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ICT & Facilities */}
        <section className="py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                ICT & Facilities
              </h2>
              <p className="text-lg text-muted-foreground">
                Modern facilities supporting 21st-century learning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">ICT Lab</h3>
                <p className="text-muted-foreground text-sm">Modern computers with internet access</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Library</h3>
                <p className="text-muted-foreground text-sm">Well-stocked with curriculum books</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Microscope className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Science Corner</h3>
                <p className="text-muted-foreground text-sm">Hands-on experiments and discovery</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Sports Field</h3>
                <p className="text-muted-foreground text-sm">Safe compound for outdoor activities</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Ready to Join Our Academic Community?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discover how our comprehensive curriculum can benefit your child's educational journey
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 py-4 shadow-accent" onClick={() => window.location.href = '/admissions'}>
              View Admissions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Academics;