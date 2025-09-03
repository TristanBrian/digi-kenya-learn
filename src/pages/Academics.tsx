import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Trophy, Microscope, Music, Palette, ArrowRight, Clock, Target, Award, Calendar, CheckCircle, Star } from "lucide-react";
import { useState } from "react";

const classLevels = [
  {
    title: "Early Years (PP1-PP3)",
    description: "Play-based foundations",
    details: "Building social skills, basic literacy and numeracy through interactive play and discovery learning.",
    icon: Users,
    ageRange: "3-6 years",
    subjects: ["Pre-Literacy", "Pre-Numeracy", "Creative Arts", "Physical Development", "Social Skills"],
    highlights: ["Play-based learning", "Social development", "Basic motor skills", "Creative expression"]
  },
  {
    title: "Lower Primary (Grade 1-4)",
    description: "Literacy, numeracy, basics",
    details: "Strengthening reading, writing, and mathematical foundations with creative problem-solving approaches.",
    icon: BookOpen,
    ageRange: "6-10 years",
    subjects: ["English", "Mathematics", "Kiswahili", "Science & Technology", "Social Studies", "Creative Arts"],
    highlights: ["Reading fluency", "Basic mathematics", "Scientific thinking", "Digital literacy"]
  },
  {
    title: "Upper Primary (Grade 5-8)",
    description: "Exam prep, STEM exposure",
    details: "Advanced curriculum preparation for KCPE with focus on science, technology, and critical thinking skills.",
    icon: Microscope,
    ageRange: "10-14 years",
    subjects: ["English", "Mathematics", "Kiswahili", "Science", "Social Studies", "Religious Education", "Life Skills"],
    highlights: ["KCPE preparation", "Advanced STEM", "Leadership skills", "Critical thinking"]
  }
];

const curriculumAreas = [
  {
    title: "Language & Literacy",
    description: "Building strong communication foundations in English and Kiswahili",
    icon: BookOpen,
    skills: ["Reading comprehension", "Creative writing", "Public speaking", "Grammar & vocabulary"]
  },
  {
    title: "Mathematical Thinking",
    description: "Developing logical reasoning and problem-solving abilities",
    icon: Target,
    skills: ["Number concepts", "Algebraic thinking", "Geometry", "Data handling"]
  },
  {
    title: "Scientific Inquiry", 
    description: "Hands-on exploration of natural and physical sciences",
    icon: Microscope,
    skills: ["Scientific method", "Observation & analysis", "Experimentation", "Environmental awareness"]
  },
  {
    title: "Digital Citizenship",
    description: "21st-century skills for the digital world",
    icon: Trophy,
    skills: ["Computer literacy", "Digital safety", "Coding basics", "Online research"]
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
  const [activeLevel, setActiveLevel] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/10 text-white border-white/20">
                <Award className="mr-2 h-4 w-4" />
                CBC-Aligned Curriculum
              </Badge>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Academic Excellence<br />
                <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
                  Meets Innovation
                </span>
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed">
                From Pre-Primary to Grade 8, our comprehensive curriculum builds strong foundations while fostering creativity, critical thinking, and character development
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">CBC Curriculum</h3>
                <p className="text-white/80 text-sm">Government-approved competency-based learning</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Small Classes</h3>
                <p className="text-white/80 text-sm">Maximum 25 students per class for personalized attention</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Holistic Growth</h3>
                <p className="text-white/80 text-sm">Academic, social, and emotional development</p>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Areas */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Core Learning Areas
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our CBC-aligned curriculum focuses on developing competencies across key learning areas that prepare students for success in the 21st century
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {curriculumAreas.map((area, index) => (
                <Card key={index} className="shadow-card border-0 hover:shadow-elegant transition-all duration-500 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <area.icon className="h-8 w-8 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {area.title}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{area.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Skills Developed:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {area.skills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                            <span className="text-muted-foreground text-sm">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Class Structure */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Progressive Learning Journey
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our carefully structured progression from Early Years through Grade 8, designed to build competencies at each developmental stage
              </p>
            </div>

            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
                {classLevels.map((level, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={index.toString()}
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    {level.title.split(' (')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {classLevels.map((level, index) => (
                <TabsContent key={index} value={index.toString()}>
                  <Card className="shadow-card border-0 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      <div className="lg:col-span-2 p-8 lg:p-12">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center">
                            <level.icon className="h-10 w-10 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-display text-3xl font-bold text-foreground">
                              {level.title}
                            </h3>
                            <p className="text-accent font-semibold text-lg">
                              Ages {level.ageRange}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                          {level.details}
                        </p>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-accent" />
                              Core Subjects
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {level.subjects.map((subject, subIndex) => (
                                <Badge key={subIndex} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Star className="h-5 w-5 text-accent" />
                              Key Highlights
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {level.highlights.map((highlight, highlightIndex) => (
                                <div key={highlightIndex} className="flex items-center gap-3">
                                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                                  <span className="text-muted-foreground">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-accent/5 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="h-12 w-12 text-accent" />
                          </div>
                          <h4 className="font-semibold text-xl text-foreground mb-4">
                            Class Size & Schedule
                          </h4>
                          <div className="space-y-3 text-muted-foreground">
                            <p>Maximum 25 students per class</p>
                            <p>Monday - Friday: 7:30 AM - 3:30 PM</p>
                            <p>Qualified, experienced teachers</p>
                            <p>Regular parent-teacher meetings</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
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