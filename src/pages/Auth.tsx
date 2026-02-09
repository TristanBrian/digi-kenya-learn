import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, School, AlertCircle, CheckCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { demoAuth, DEMO_CREDENTIALS } from "@/utils/demoAuth";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile creation/updates with setTimeout
          setTimeout(() => {
            createOrUpdateProfile(session.user);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const createOrUpdateProfile = async (user: SupabaseUser) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: formData.fullName || user.user_metadata?.full_name || '',
            phone: formData.phone || user.user_metadata?.phone || '',
          });

        if (error) {
          console.error('Error creating profile:', error);
        }
      }
    } catch (error) {
      console.error('Error managing profile:', error);
    }
  };

  const redirectByRole = async (userId: string) => {
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (adminRole) {
      navigate('/admin');
      return;
    }

    const { data: studentData } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (studentData) {
      navigate('/student');
      return;
    }

    navigate('/');
  };


  const validateForm = (isSignUp: boolean = false) => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.fullName,
            phone: formData.phone
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      } else if (data.session) {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        // Redirect based on role
        await redirectByRole(data.session.user.id);
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Try demo login first
      const demoSession = demoAuth.signIn(formData.email, formData.password);
      
      if (demoSession) {
        toast({
          title: "Welcome back!",
          description: "Demo access granted.",
        });
        
        // Redirect based on role
        if (demoSession.user.role === 'admin') {
          navigate('/admin');
        } else if (demoSession.user.role === 'student') {
          navigate('/student');
        }
        return;
      }

      // Fall back to Supabase if demo login fails
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      
      await redirectByRole(data.user.id);
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>You're already signed in!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Welcome back, {user.email}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <School className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary-foreground mb-2">
            EAIC Portal
          </h1>
          <p className="text-primary-foreground/80">
            Access your account
          </p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
              Welcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.email}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1.5 h-7 px-2"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.password}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground mb-3">Demo Credentials:</p>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          email: DEMO_CREDENTIALS.admin.email,
                          password: DEMO_CREDENTIALS.admin.password
                        });
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold">Admin Dashboard</span>
                        <span className="text-xs text-muted-foreground">{DEMO_CREDENTIALS.admin.email}</span>
                      </div>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          email: DEMO_CREDENTIALS.student.email,
                          password: DEMO_CREDENTIALS.student.password
                        });
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold">Student Portal</span>
                        <span className="text-xs text-muted-foreground">{DEMO_CREDENTIALS.student.email}</span>
                      </div>
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.fullName && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.fullName}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.email}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="+2547XXXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1.5 h-7 px-2"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.password}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.confirmPassword}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:text-primary-foreground/80"
          >
            ← Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
