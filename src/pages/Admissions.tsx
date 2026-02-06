import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Send, FileText, Users, Calendar, ChevronRight, ChevronLeft, CheckCircle, User, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admissions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: "Child Info", icon: User },
    { id: 2, title: "Parent Info", icon: Users },
    { id: 3, title: "Additional", icon: FileText },
    { id: 4, title: "Review", icon: CheckCircle }
  ];

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+254${cleaned.slice(1)}`;
    } else if (cleaned.startsWith('7')) {
      return `+254${cleaned}`;
    }
    return value;
  };

  // Real-time validation
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'childFirstName':
      case 'childLastName':
        if (!value.trim()) {
          newErrors[name] = 'This field is required';
        } else {
          delete newErrors[name];
        }
        break;
      case 'dateOfBirth':
        if (!value) {
          newErrors[name] = 'Date of birth is required';
        } else {
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          if (age < 2 || age > 18) {
            newErrors[name] = 'Age must be between 2-18 years';
          } else {
            delete newErrors[name];
          }
        }
        break;
      case 'parentPhone':
        if (!value) {
          newErrors[name] = 'Phone number is required';
        } else if (!/^\+254[17]\d{8}$/.test(value)) {
          newErrors[name] = 'Please enter a valid Kenyan phone number';
        } else {
          delete newErrors[name];
        }
        break;
      case 'parentEmail':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          newErrors[name] = 'Please enter a valid email address';
        } else {
          delete newErrors[name];
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === 'parentPhone' || name === 'emergencyContactPhone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const canProceedToNextStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.childFirstName && formData.childLastName && formData.dateOfBirth && formData.gradeApplyingFor;
      case 2:
        return formData.parentName && formData.parentPhone && !errors.parentPhone;
      case 3:
        return formData.consentGiven;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (canProceedToNextStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required information before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

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

      const submissionData = {
        admission_ref: admissionRef,
        child_first_name: formData.childFirstName.trim(),
        child_last_name: formData.childLastName.trim(),
        child_dob: formData.dateOfBirth,
        child_gender: formData.gender || null,
        grade_applying_for: formData.gradeApplyingFor,
        previous_school: formData.currentSchool.trim() || null,
        parent_name: formData.parentName.trim(),
        parent_phone: formData.parentPhone.trim(),
        parent_email: formData.parentEmail.trim() || null,
        parent_address: formData.address.trim() || null,
        status: 'pending'
      };

      console.log('Submission data:', submissionData);

      const { data, error } = await supabase
        .from('admissions' as any)
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
      setCurrentStep(1);
      setCompletedSteps([]);

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

        {/* Quick Info Cards */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-card border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">We respond within 3 working days</p>
                </CardContent>
              </Card>
              <Card className="shadow-card border-0 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Simple Process</h3>
                  <p className="text-sm text-muted-foreground">4-step online application</p>
                </CardContent>
              </Card>
              <Card className="shadow-card border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Secure Submission</h3>
                  <p className="text-sm text-muted-foreground">Your data is safely encrypted</p>
                </CardContent>
              </Card>
            </div>

            {/* Downloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-2">School Prospectus</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Learn about our curriculum, facilities, and educational philosophy
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Prospectus (2.4 MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Users className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-2">Fee Structure 2025</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detailed breakdown of tuition and additional fees
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Fee Structure (1.8 MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Multi-Step Application Form */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-card border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-center mb-6">Online Admission Application</CardTitle>
                
                {/* Progress Indicator */}
                <div className="w-full mb-6">
                  <div className="flex justify-between items-center mb-4">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                          ${currentStep === step.id 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : completedSteps.includes(step.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          {completedSteps.includes(step.id) ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <step.icon className="h-5 w-5" />
                          )}
                        </div>
                        <span className={`text-xs mt-2 ${currentStep === step.id ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Progress value={getStepProgress()} className="h-2" />
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Child Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="text-center mb-6">
                        <User className="h-12 w-12 text-primary mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-foreground">Child Information</h3>
                        <p className="text-sm text-muted-foreground">Tell us about your child</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="childFirstName">Child's First Name *</Label>
                          <Input 
                            id="childFirstName"
                            value={formData.childFirstName}
                            onChange={(e) => handleInputChange('childFirstName', e.target.value)}
                            className={errors.childFirstName ? 'border-red-500' : ''}
                          />
                          {errors.childFirstName && <p className="text-red-500 text-xs mt-1">{errors.childFirstName}</p>}
                        </div>
                        <div>
                          <Label htmlFor="childLastName">Child's Last Name *</Label>
                          <Input 
                            id="childLastName"
                            value={formData.childLastName}
                            onChange={(e) => handleInputChange('childLastName', e.target.value)}
                            className={errors.childLastName ? 'border-red-500' : ''}
                          />
                          {errors.childLastName && <p className="text-red-500 text-xs mt-1">{errors.childLastName}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input 
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className={errors.dateOfBirth ? 'border-red-500' : ''}
                          />
                          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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
                          <Select value={formData.gradeApplyingFor} onValueChange={(value) => handleInputChange('gradeApplyingFor', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PP1">PP1 (Pre-Primary 1)</SelectItem>
                              <SelectItem value="PP2">PP2 (Pre-Primary 2)</SelectItem>
                              <SelectItem value="PP3">PP3 (Pre-Primary 3)</SelectItem>
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
                            onChange={(e) => handleInputChange('currentSchool', e.target.value)}
                            placeholder="Previous school name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Parent Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="text-center mb-6">
                        <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-foreground">Parent/Guardian Information</h3>
                        <p className="text-sm text-muted-foreground">Your contact details</p>
                      </div>

                      <div>
                        <Label htmlFor="parentName">Parent/Guardian Full Name *</Label>
                        <Input 
                          id="parentName"
                          value={formData.parentName}
                          onChange={(e) => handleInputChange('parentName', e.target.value)}
                          className={errors.parentName ? 'border-red-500' : ''}
                        />
                        {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parentPhone">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="parentPhone"
                              value={formData.parentPhone}
                              onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                              placeholder="+254712345678"
                              className={`pl-10 ${errors.parentPhone ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                        </div>
                        <div>
                          <Label htmlFor="parentEmail">Email Address (optional)</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="parentEmail"
                              type="email"
                              value={formData.parentEmail}
                              onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                              placeholder="parent@example.com"
                              className={`pl-10 ${errors.parentEmail ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Home Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea 
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Full address including area and nearest landmark"
                            rows={3}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Additional Information */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="text-center mb-6">
                        <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-foreground">Additional Information</h3>
                        <p className="text-sm text-muted-foreground">Complete your application</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="preferredTerm">Preferred Start Term</Label>
                          <Select value={formData.preferredTerm} onValueChange={(value) => handleInputChange('preferredTerm', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Term 1">Term 1 (January - April)</SelectItem>
                              <SelectItem value="Term 2">Term 2 (May - August)</SelectItem>
                              <SelectItem value="Term 3">Term 3 (September - December)</SelectItem>
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
                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                          <Input 
                            id="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                            placeholder="+254712345678"
                          />
                        </div>
                      </div>

                      {/* Consent */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="consent" 
                            checked={formData.consentGiven}
                            onCheckedChange={(checked) => handleInputChange('consentGiven', checked ? 'true' : 'false')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label 
                              htmlFor="consent"
                              className="text-sm leading-relaxed cursor-pointer"
                            >
                              I consent to the collection and processing of my child's personal data for admission purposes. 
                              I understand that this information will be used in accordance with the school's privacy policy.
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="text-center mb-6">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-foreground">Review Your Application</h3>
                        <p className="text-sm text-muted-foreground">Please verify all information before submitting</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 bg-muted/30">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Child Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div><strong>Name:</strong> {formData.childFirstName} {formData.childLastName}</div>
                            <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>
                            <div><strong>Gender:</strong> {formData.gender || 'Not specified'}</div>
                            <div><strong>Grade:</strong> {formData.gradeApplyingFor}</div>
                            {formData.currentSchool && <div><strong>Current School:</strong> {formData.currentSchool}</div>}
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-muted/30">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Parent Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div><strong>Name:</strong> {formData.parentName}</div>
                            <div><strong>Phone:</strong> {formData.parentPhone}</div>
                            {formData.parentEmail && <div><strong>Email:</strong> {formData.parentEmail}</div>}
                            {formData.address && <div><strong>Address:</strong> {formData.address}</div>}
                          </CardContent>
                        </Card>
                      </div>

                      {(formData.preferredTerm || formData.emergencyContactName) && (
                        <Card className="border-0 bg-muted/30">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Additional Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            {formData.preferredTerm && <div><strong>Preferred Term:</strong> {formData.preferredTerm}</div>}
                            {formData.emergencyContactName && <div><strong>Emergency Contact:</strong> {formData.emergencyContactName}</div>}
                            {formData.emergencyContactPhone && <div><strong>Emergency Phone:</strong> {formData.emergencyContactPhone}</div>}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < steps.length ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={!canProceedToNextStep(currentStep)}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !formData.consentGiven}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    )}
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