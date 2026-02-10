import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, AlertCircle, CheckCircle, Shield, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const DEMO_CREDENTIALS = {
  admin: { email: "admin@digiuniversity.ac.ke", password: "Admin@2026", label: "Admin", icon: Shield },
  student: { email: "student@digiuniversity.ac.ke", password: "Student@2026", label: "Student", icon: BookOpen },
};

const Auth = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', fullName: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => createOrUpdateProfile(session.user), 0);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) navigate('/');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const createOrUpdateProfile = async (user: SupabaseUser) => {
    try {
      const { data: existing } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (!existing) {
        await supabase.from('profiles').insert({
          user_id: user.id,
          email: user.email,
          full_name: formData.fullName || user.user_metadata?.full_name || '',
          phone: formData.phone || user.user_metadata?.phone || '',
        });
      }
    } catch (e) { console.error('Profile error:', e); }
  };

  const redirectByRole = async (userId: string) => {
    const { data: adminRole } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle();
    if (adminRole) { navigate('/admin'); return; }
    const { data: studentData } = await supabase.from('students').select('id').eq('user_id', userId).maybeSingle();
    if (studentData) { navigate('/student'); return; }
    navigate('/');
  };

  const validateForm = (isSignUp = false) => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (isSignUp) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
      if (error) throw error;
      toast({ title: "Welcome back!", description: "Signed in successfully." });
      await redirectByRole(data.user.id);
    } catch (error: any) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email, password: formData.password,
        options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: formData.fullName, phone: formData.phone } },
      });
      if (error) throw error;
      if (data.session) {
        toast({ title: "Welcome!", description: "Account created successfully." });
        await redirectByRole(data.session.user.id);
      } else {
        toast({ title: "Check your email", description: "Confirmation link sent." });
      }
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleDemoLogin = async (role: 'admin' | 'student') => {
    const creds = DEMO_CREDENTIALS[role];
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: creds.email, password: creds.password });
      if (error) {
        // If user doesn't exist, seed demo data first
        if (error.message.includes("Invalid login")) {
          setSeeding(true);
          toast({ title: "Setting up demo...", description: "Creating demo accounts and sample data. This may take a moment." });
          const res = await supabase.functions.invoke('seed-demo-data');
          if (res.error) throw new Error("Failed to seed demo data");
          setSeeding(false);
          // Retry login
          const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({ email: creds.email, password: creds.password });
          if (retryErr) throw retryErr;
          toast({ title: `Welcome, ${role}!`, description: `Logged in as ${creds.label}.` });
          await redirectByRole(retryData.user.id);
          return;
        }
        throw error;
      }
      toast({ title: `Welcome, ${role}!`, description: `Logged in as ${creds.label}.` });
      await redirectByRole(data.user.id);
    } catch (error: any) {
      toast({ title: "Demo login failed", description: error.message, variant: "destructive" });
    } finally { setLoading(false); setSeeding(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>You're signed in!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">Welcome, {user.email}</p>
            <Button onClick={() => navigate('/')} className="w-full">Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary-glow flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DigiUniversity</h1>
          <p className="text-white/70">University Management Portal</p>
        </div>

        {/* Demo Login Section */}
        <Card className="shadow-2xl border-0 mb-4 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-center">Quick Demo Access</CardTitle>
            <CardDescription className="text-center">Try the platform with pre-configured accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleDemoLogin('admin')}
                disabled={loading || seeding}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40"
              >
                {seeding ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Shield className="h-6 w-6 text-primary" />}
                <span className="font-semibold text-sm">Admin Portal</span>
                <Badge variant="secondary" className="text-[10px]">Full Control</Badge>
              </Button>
              <Button
                onClick={() => handleDemoLogin('student')}
                disabled={loading || seeding}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 border-accent/20 hover:bg-accent/5 hover:border-accent/40"
              >
                {seeding ? <Loader2 className="h-6 w-6 animate-spin text-accent" /> : <BookOpen className="h-6 w-6 text-accent" />}
                <span className="font-semibold text-sm">Student Portal</span>
                <Badge variant="secondary" className="text-[10px]">View Results & Fees</Badge>
              </Button>
            </div>
            {seeding && (
              <p className="text-xs text-center text-muted-foreground animate-pulse">
                Setting up demo accounts & sample data...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Login/Signup Card */}
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardContent className="pt-6">
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
                      <Input id="signin-email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} className={`pl-10 ${errors.email ? 'border-destructive' : ''}`} disabled={loading} />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signin-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter password" value={formData.password} onChange={handleInputChange} className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`} disabled={loading} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1.5 h-7 px-2" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in...</> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-name" name="fullName" placeholder="Your full name" value={formData.fullName} onChange={handleInputChange} className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`} disabled={loading} />
                    </div>
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} className={`pl-10 ${errors.email ? 'border-destructive' : ''}`} disabled={loading} />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone (Optional)</Label>
                    <Input id="signup-phone" name="phone" type="tel" placeholder="+2547XXXXXXXX" value={formData.phone} onChange={handleInputChange} disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={handleInputChange} className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`} disabled={loading} />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1.5 h-7 px-2" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-confirm" name="confirmPassword" type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`} disabled={loading} />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />
            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white/80 hover:text-white hover:bg-white/10">
            ← Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
