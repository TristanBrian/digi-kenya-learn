import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Send, FileText, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admissions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    childFirstName: '',
    childLastName: '',
    dateOfBirth: '',
    gender: '',
    gradeApplyingFor: '',
    currentSchool: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    preferredTerm: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    consentGiven: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = {
      childFirstName: "Child's First Name",
      childLastName: "Child's Last Name", 
      dateOfBirth: "Date of Birth",
      gradeApplyingFor: "Grade Applying For",
      parentName: "Parent/Guardian Name",
      parentPhone: "Parent Phone"
    };

    const emptyFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) {
        emptyFields.push(label);
      }
    }

    if (emptyFields.length > 0) {
      toast({
        title: "Missing Required Information",
        description: `Please fill in: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (!formData.consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please provide consent to store your child's information.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting admission submission...');
      
      // Generate admission reference
      const admissionRef = `ADM-${Date.now()}`;
      console.log('Generated admission ref:', admissionRef);
      
      // Get DigiSchool ID
      const { data: schools, error: schoolError } = await supabase
        .from('schools')
        .select('id, name')
        .eq('name', 'DigiSchool')
        .limit(1);
      
      if (schoolError) {
        console.error('School fetch error:', schoolError);
        throw new Error('Failed to fetch school information');
      }

      if (!schools || schools.length === 0) {
        // Fallback to any available school
        const { data: fallbackSchools, error: fallbackError } = await supabase
          .from('schools')
          .select('id, name')
          .limit(1);
          
        if (fallbackError || !fallbackSchools?.length) {
          console.error('No schools found:', fallbackError);
          throw new Error('No schools available in the system');
        }
        
        console.log('Using fallback school:', fallbackSchools[0]);
      }
      
      const schoolId = schools?.[0]?.id || (await supabase.from('schools').select('id').limit(1)).data?.[0]?.id;
      console.log('Using school ID:', schoolId);

      if (!schoolId) {
        throw new Error('School ID not found');
      }

      const submissionData = {
        school_id: schoolId,
        admission_ref: admissionRef,
        child_first_name: formData.childFirstName.trim(),
        child_last_name: formData.childLastName.trim(),
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender || null,
        grade_applying_for: formData.gradeApplyingFor,
        current_school: formData.currentSchool.trim() || null,
        parent_name: formData.parentName.trim(),
        parent_phone: formData.parentPhone.trim(),
        parent_email: formData.parentEmail.trim() || null,
        address: formData.address.trim() || null,
        preferred_term: formData.preferredTerm || null,
        emergency_contact_name: formData.emergencyContactName.trim() || null,
        emergency_contact_phone: formData.emergencyContactPhone.trim() || null,
        consent_given: formData.consentGiven,
        status: 'new'
      };

      console.log('Submission data:', submissionData);

      const { data, error } = await supabase
        .from('admissions')
        .insert(submissionData)
        .select();

      if (error) {
        console.error('Supabase insertion error:', error);
        throw error;
      }

      console.log('Admission submitted successfully:', data);

      toast({
        title: "Application Submitted Successfully!",
        description: `Thank you! Your application reference is ${admissionRef}. We will contact you within 3 working days.`,
      });

      // Reset form
      setFormData({
        childFirstName: '',
        childLastName: '',
        dateOfBirth: '',
        gender: '',
        gradeApplyingFor: '',
        currentSchool: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        preferredTerm: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        consentGiven: false
      });

    } catch (error: any) {
      console.error('Full error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
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
              Admissions
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Apply online for admission to PP1–Grade 8. Download prospectus, view fees and submit application form.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg text-muted-foreground">
              Begin the enrollment process here. Fill the form below and our admissions team will contact you within 3 working days.
            </p>
          </div>
        </section>

        {/* Downloads */}
        <section className="py-8 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card border-0">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-4">School Prospectus</h3>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Prospectus (PDF)
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-4">Fee Structure</h3>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Fee Structure (PDF)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Online Admission Form</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Child Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Child Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="childFirstName">Child's First Name *</Label>
                        <Input 
                          id="childFirstName"
                          value={formData.childFirstName}
                          onChange={(e) => setFormData({...formData, childFirstName: e.target.value})}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="childLastName">Child's Last Name *</Label>
                        <Input 
                          id="childLastName"
                          value={formData.childLastName}
                          onChange={(e) => setFormData({...formData, childLastName: e.target.value})}
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth * (DD/MM/YYYY)</Label>
                        <Input 
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gradeApplyingFor">Grade Applying For *</Label>
                        <Select value={formData.gradeApplyingFor} onValueChange={(value) => setFormData({...formData, gradeApplyingFor: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PP1">PP1</SelectItem>
                            <SelectItem value="PP2">PP2</SelectItem>
                            <SelectItem value="PP3">PP3</SelectItem>
                            <SelectItem value="Grade 1">Grade 1</SelectItem>
                            <SelectItem value="Grade 2">Grade 2</SelectItem>
                            <SelectItem value="Grade 3">Grade 3</SelectItem>
                            <SelectItem value="Grade 4">Grade 4</SelectItem>
                            <SelectItem value="Grade 5">Grade 5</SelectItem>
                            <SelectItem value="Grade 6">Grade 6</SelectItem>
                            <SelectItem value="Grade 7">Grade 7</SelectItem>
                            <SelectItem value="Grade 8">Grade 8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currentSchool">Current School (if any)</Label>
                        <Input 
                          id="currentSchool"
                          value={formData.currentSchool}
                          onChange={(e) => setFormData({...formData, currentSchool: e.target.value})}
                          placeholder="Previous school name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Parent/Guardian Information</h3>
                    
                    <div>
                      <Label htmlFor="parentName">Parent/Guardian Full Name *</Label>
                      <Input 
                        id="parentName"
                        value={formData.parentName}
                        onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentPhone">Parent Phone * (+2547XXXXXXXX)</Label>
                        <Input 
                          id="parentPhone"
                          value={formData.parentPhone}
                          onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                          placeholder="+2547XXXXXXXX"
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="parentEmail">Parent Email (optional)</Label>
                        <Input 
                          id="parentEmail"
                          type="email"
                          value={formData.parentEmail}
                          onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                          placeholder="parent@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Home Address</Label>
                      <Textarea 
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Full address including area and nearest landmark"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Additional Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredTerm">Preferred Start Term</Label>
                        <Select value={formData.preferredTerm} onValueChange={(value) => setFormData({...formData, preferredTerm: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Term 1">Term 1</SelectItem>
                            <SelectItem value="Term 2">Term 2</SelectItem>
                            <SelectItem value="Term 3">Term 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                        <Input 
                          id="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                        <Input 
                          id="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                          placeholder="+2547XXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Documents (Optional)</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload birth certificate and previous school report (PDF/JPG, max 5MB each)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="birthCertificate">Birth Certificate</Label>
                        <Input id="birthCertificate" type="file" accept=".pdf,.jpg,.jpeg" />
                      </div>
                      <div>
                        <Label htmlFor="previousReport">Previous Report</Label>
                        <Input id="previousReport" type="file" accept=".pdf,.jpg,.jpeg" />
                      </div>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="consent"
                      checked={formData.consentGiven}
                      onCheckedChange={(checked) => setFormData({...formData, consentGiven: checked as boolean})}
                    />
                    <Label htmlFor="consent" className="text-sm leading-relaxed">
                      I consent to DigiSchool storing my child's information for admissions and communication. 
                      See <a href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</a>.
                    </Label>
                  </div>

                  {/* Submit */}
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-accent hover:bg-accent-light text-accent-foreground font-semibold shadow-accent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting Application..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admissions;