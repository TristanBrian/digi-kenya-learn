import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Image, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  Shield,
  School,
  AlertCircle,
  CheckCircle,
  Clock,
  Receipt,
  GraduationCap,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { demoAuth } from "@/utils/demoAuth";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NewsEvent {
  id: string;
  title: string;
  type: string;
  excerpt: string | null;
  content: string;
  event_date: string | null;
  event_location: string | null;
  featured_image_url: string | null;
  published: boolean;
  created_at: string;
  author_id: string | null;
}

interface GalleryImage {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  image_url: string;
  featured: boolean;
  created_at: string;
  school_id: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  preferred_contact: string | null;
}

interface Admission {
  id: string;
  admission_ref: string;
  child_first_name: string;
  child_last_name: string;
  parent_name: string;
  parent_email: string | null;
  parent_phone: string;
  grade_applying_for: string;
  status: string;
  created_at: string;
  notes: string | null;
}

interface Payment {
  id: string;
  admission_ref: string | null;
  amount: number;
  payer_phone: string;
  payer_email: string | null;
  payment_method: string;
  status: string;
  mpesa_receipt: string | null;
  mpesa_transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  grade: string;
  status: string | null;
  user_id: string | null;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Data states
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Form states
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsEvent | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    type: 'news',
    excerpt: '',
    content: '',
    event_date: '',
    event_location: '',
    published: false
  });

  // Student form
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [studentForm, setStudentForm] = useState({
    admission_number: '',
    first_name: '',
    last_name: '',
    grade: '',
    parent_name: '',
    parent_phone: '',
    parent_email: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const checkAuth = async () => {
    try {
      // Check demo auth first
      const demoSession = demoAuth.getSession();
      if (demoSession && demoSession.user.role === 'admin') {
        setUser({ email: demoSession.user.email } as any);
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Check if user has admin role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!userRole) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges to access this dashboard.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load demo data if using demo auth
      const demoSession = demoAuth.getSession();
      if (demoSession && demoSession.user.role === 'admin') {
        // Demo news events
        const demoNews: NewsEvent[] = [
          {
            id: '1',
            title: 'New ICT Lab Inauguration',
            type: 'news',
            excerpt: 'State-of-the-art computer laboratory launched',
            content: 'EAIC has officially opened its new Information Technology laboratory equipped with the latest computing systems and software for hands-on training.',
            event_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            event_location: 'Main Campus',
            featured_image_url: '/gallery-digital-classroom.jpg',
            published: true,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'admin-001'
          },
          {
            id: '2',
            title: 'Business Program Expansion',
            type: 'news',
            excerpt: 'New business management specializations added',
            content: 'The college has expanded its business curriculum to include entrepreneurship and digital marketing specializations.',
            event_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            event_location: 'Business School',
            featured_image_url: null,
            published: true,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            author_id: 'admin-001'
          }
        ];

        // Demo admissions
        const demoAdmissions: Admission[] = [
          {
            id: '1',
            admission_ref: 'ADM/2024/001',
            child_first_name: 'James',
            child_last_name: 'Kipchoge',
            parent_name: 'Joseph Kipchoge',
            parent_email: 'joseph@example.com',
            parent_phone: '+254712345678',
            grade_applying_for: 'ICT Diploma',
            status: 'Pending',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Completed secondary education with distinction'
          },
          {
            id: '2',
            admission_ref: 'ADM/2024/002',
            child_first_name: 'Grace',
            child_last_name: 'Mwangi',
            parent_name: 'Margaret Mwangi',
            parent_email: 'margaret@example.com',
            parent_phone: '+254723456789',
            grade_applying_for: 'Business Certificate',
            status: 'Approved',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Awaiting enrollment'
          }
        ];

        // Demo payments
        const demoPayments: Payment[] = [
          {
            id: '1',
            admission_ref: 'ADM/2024/002',
            amount: 50000,
            payer_phone: '+254723456789',
            payer_email: 'margaret@example.com',
            payment_method: 'mpesa',
            status: 'Completed',
            mpesa_receipt: 'MPESA123456',
            mpesa_transaction_id: 'LIV234567890',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];

        // Demo students
        const demoStudents: Student[] = [
          {
            id: '1',
            admission_number: 'EAIC/2024/001',
            first_name: 'John',
            last_name: 'Kipchoge',
            grade: 'ICT Diploma Year 1',
            status: 'Active',
            user_id: 'student-001'
          },
          {
            id: '2',
            admission_number: 'EAIC/2024/002',
            first_name: 'Grace',
            last_name: 'Mwangi',
            grade: 'Business Certificate Year 1',
            status: 'Active',
            user_id: null
          }
        ];

        setNewsEvents(demoNews);
        setAdmissions(demoAdmissions);
        setPayments(demoPayments);
        setStudents(demoStudents);
        return;
      }

      // Load from Supabase for real users
      const [newsRes, galleryRes, contactsRes, admissionsRes, paymentsRes, studentsRes] = await Promise.all([
        supabase.from('news_events').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('gallery_images').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('admissions').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('students').select('*').order('created_at', { ascending: false }).limit(20),
      ]);

      if (newsRes.data) setNewsEvents(newsRes.data as unknown as NewsEvent[]);
      if (galleryRes.data) setGalleryImages(galleryRes.data as unknown as GalleryImage[]);
      if (contactsRes.data) setContactMessages(contactsRes.data as unknown as ContactMessage[]);
      if (admissionsRes.data) setAdmissions(admissionsRes.data as unknown as Admission[]);
      if (paymentsRes.data) setPayments(paymentsRes.data as unknown as Payment[]);
      if (studentsRes.data) setStudents(studentsRes.data);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    demoAuth.signOut();
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSaveNews = async () => {
    try {
      const newsData = {
        ...newsForm,
        author_id: user?.id,
        school_id: 'default'
      };

      if (editingNews) {
        const { error } = await supabase
          .from('news_events')
          .update(newsData)
          .eq('id', editingNews.id);

        if (error) throw error;
        
        toast({
          title: "News Updated",
          description: "News item has been updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('news_events')
          .insert([newsData]);

        if (error) throw error;
        
        toast({
          title: "News Created",
          description: "News item has been created successfully."
        });
      }

      setShowNewsDialog(false);
      setEditingNews(null);
      setNewsForm({
        title: '',
        type: 'news',
        excerpt: '',
        content: '',
        event_date: '',
        event_location: '',
        published: false
      });
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save news item",
        variant: "destructive"
      });
    }
  };

  const handleEditNews = (news: NewsEvent) => {
    setEditingNews(news);
    setNewsForm({
      title: news.title,
      type: news.type,
      excerpt: news.excerpt || '',
      content: news.content,
      event_date: news.event_date || '',
      event_location: news.event_location || '',
      published: news.published
    });
    setShowNewsDialog(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const { error } = await supabase
        .from('news_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "News Deleted",
        description: "News item has been deleted successfully."
      });
      
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete news item",
        variant: "destructive"
      });
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: "Contact message status has been updated."
      });
      
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const updateAdmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('admissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: "Admission status has been updated."
      });
      
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleCreateStudent = async () => {
    try {
      const { error } = await supabase
        .from('students')
        .insert([studentForm]);

      if (error) throw error;

      toast({
        title: "Student Created",
        description: "Student record has been created successfully."
      });

      setShowStudentDialog(false);
      setStudentForm({
        admission_number: '',
        first_name: '',
        last_name: '',
        grade: '',
        parent_name: '',
        parent_phone: '',
        parent_email: ''
      });
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create student",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges to access this dashboard.
            </p>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <School className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">DigiSchool Admin</h1>
                <p className="text-xs text-muted-foreground">Content Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Admin</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden lg:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">News</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden lg:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="admissions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden lg:inline">Admissions</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden lg:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden lg:inline">Messages</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold text-foreground">{students.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Admissions</p>
                      <p className="text-2xl font-bold text-foreground">
                        {admissions.filter(a => a.status === 'pending').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                      <p className="text-2xl font-bold text-foreground">
                        {contactMessages.filter(c => c.status === 'new').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Recent Payments</p>
                      <p className="text-2xl font-bold text-foreground">{payments.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No students yet</p>
                  ) : (
                    <div className="space-y-3">
                      {students.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{student.first_name} {student.last_name}</p>
                            <p className="text-sm text-muted-foreground">{student.admission_number}</p>
                          </div>
                          <Badge>{student.grade}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Admissions</CardTitle>
                </CardHeader>
                <CardContent>
                  {admissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No admissions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {admissions.slice(0, 5).map((admission) => (
                        <div key={admission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{admission.child_first_name} {admission.child_last_name}</p>
                            <p className="text-sm text-muted-foreground">{admission.grade_applying_for}</p>
                          </div>
                          <Badge variant={admission.status === 'pending' ? 'secondary' : admission.status === 'approved' ? 'default' : 'destructive'}>
                            {admission.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-muted-foreground">Manage student records and link accounts</p>
              </div>
              <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Admission Number</Label>
                        <Input 
                          value={studentForm.admission_number}
                          onChange={(e) => setStudentForm(p => ({...p, admission_number: e.target.value}))}
                          placeholder="e.g., DS2025001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Grade</Label>
                        <Select 
                          value={studentForm.grade} 
                          onValueChange={(v) => setStudentForm(p => ({...p, grade: v}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'].map(g => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input 
                          value={studentForm.first_name}
                          onChange={(e) => setStudentForm(p => ({...p, first_name: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input 
                          value={studentForm.last_name}
                          onChange={(e) => setStudentForm(p => ({...p, last_name: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Name</Label>
                      <Input 
                        value={studentForm.parent_name}
                        onChange={(e) => setStudentForm(p => ({...p, parent_name: e.target.value}))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Parent Phone</Label>
                        <Input 
                          value={studentForm.parent_phone}
                          onChange={(e) => setStudentForm(p => ({...p, parent_phone: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Parent Email</Label>
                        <Input 
                          type="email"
                          value={studentForm.parent_email}
                          onChange={(e) => setStudentForm(p => ({...p, parent_email: e.target.value}))}
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateStudent} className="w-full">
                      Create Student
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No students registered yet</p>
                    <Button className="mt-4" onClick={() => setShowStudentDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Student
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4 font-medium">Adm. No</th>
                          <th className="text-left py-3 px-4 font-medium">Name</th>
                          <th className="text-left py-3 px-4 font-medium">Grade</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Account</th>
                          <th className="text-right py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-mono text-sm">{student.admission_number}</td>
                            <td className="py-3 px-4 font-medium">{student.first_name} {student.last_name}</td>
                            <td className="py-3 px-4">{student.grade}</td>
                            <td className="py-3 px-4">
                              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                {student.status || 'active'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {student.user_id ? (
                                <Badge variant="outline" className="bg-primary/10">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Linked
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Not Linked
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">News & Events</h2>
              <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingNews(null); setNewsForm({ title: '', type: 'news', excerpt: '', content: '', event_date: '', event_location: '', published: false }); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingNews ? 'Edit News' : 'Create News'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input 
                        value={newsForm.title}
                        onChange={(e) => setNewsForm(p => ({...p, title: e.target.value}))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={newsForm.type} onValueChange={(v) => setNewsForm(p => ({...p, type: v}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Event Date (optional)</Label>
                        <Input 
                          type="datetime-local"
                          value={newsForm.event_date}
                          onChange={(e) => setNewsForm(p => ({...p, event_date: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Excerpt</Label>
                      <Input 
                        value={newsForm.excerpt}
                        onChange={(e) => setNewsForm(p => ({...p, excerpt: e.target.value}))}
                        placeholder="Short summary..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea 
                        value={newsForm.content}
                        onChange={(e) => setNewsForm(p => ({...p, content: e.target.value}))}
                        rows={5}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={newsForm.published}
                          onChange={(e) => setNewsForm(p => ({...p, published: e.target.checked}))}
                          className="rounded"
                        />
                        <span className="text-sm">Published</span>
                      </label>
                    </div>
                    <Button onClick={handleSaveNews} className="w-full">
                      {editingNews ? 'Update' : 'Create'} News
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {newsEvents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No news items yet</p>
                  </CardContent>
                </Card>
              ) : (
                newsEvents.map((news) => (
                  <Card key={news.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{news.title}</CardTitle>
                          <CardDescription>
                            {new Date(news.created_at).toLocaleDateString()} • {news.type}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={news.published ? 'default' : 'secondary'}>
                            {news.published ? 'Published' : 'Draft'}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleEditNews(news)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteNews(news.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{news.excerpt}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Photo Gallery</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>

            {galleryImages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images in gallery yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted">
                      <img src={image.image_url} alt={image.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm truncate">{image.title}</p>
                      <p className="text-xs text-muted-foreground">{image.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Admissions Tab */}
          <TabsContent value="admissions" className="space-y-6">
            <h2 className="text-2xl font-bold">Admission Applications</h2>

            {admissions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No admission applications yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {admissions.map((admission) => (
                  <Card key={admission.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {admission.child_first_name} {admission.child_last_name}
                          </CardTitle>
                          <CardDescription>
                            Ref: {admission.admission_ref} • Applied for {admission.grade_applying_for}
                          </CardDescription>
                        </div>
                        <Select 
                          value={admission.status} 
                          onValueChange={(v) => updateAdmissionStatus(admission.id, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Parent</p>
                          <p className="font-medium">{admission.parent_name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{admission.parent_phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{admission.parent_email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Applied</p>
                          <p className="font-medium">{new Date(admission.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Records</h2>

            {payments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment records yet</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Reference</th>
                          <th className="text-left py-3 px-4 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 font-medium">Method</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{new Date(payment.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4 font-mono text-sm">{payment.admission_ref || payment.mpesa_receipt || '-'}</td>
                            <td className="py-3 px-4 font-medium">KES {payment.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">{payment.payment_method}</td>
                            <td className="py-3 px-4">
                              <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                                {payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Messages</h2>

            {contactMessages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{message.name}</CardTitle>
                          <CardDescription>
                            {message.email} • {message.phone}
                          </CardDescription>
                        </div>
                        <Select 
                          value={message.status} 
                          onValueChange={(v) => updateContactStatus(message.id, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{message.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
