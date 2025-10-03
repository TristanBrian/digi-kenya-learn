import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Image, 
  MessageSquare, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  Shield,
  Calendar,
  School,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Receipt
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NewsEvent {
  id: string;
  title: string;
  type: string;
  excerpt: string;
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
      // Load news/events
      const { data: news } = await supabase
        .from('news_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (news) setNewsEvents(news);

      // Load gallery images
      const { data: gallery } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (gallery) setGalleryImages(gallery);

      // Load contact messages
      const { data: contacts } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (contacts) setContactMessages(contacts);

      // Load admissions
      const { data: admissionsData } = await supabase
        .from('admissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (admissionsData) setAdmissions(admissionsData);

      // Load payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (paymentsData) setPayments(paymentsData);

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
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSaveNews = async () => {
    try {
      const newsData = {
        ...newsForm,
        author_id: user?.id,
        school_id: 'default-school-id' // You might want to get this from user's profile
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
      <div className="border-b bg-card">
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              News & Events
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="admissions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Admissions
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total News</p>
                      <p className="text-2xl font-bold text-foreground">{newsEvents.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gallery Images</p>
                      <p className="text-2xl font-bold text-foreground">{galleryImages.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Image className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New Admissions</p>
                      <p className="text-2xl font-bold text-foreground">{admissions.filter(a => a.status === 'new').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                      <p className="text-2xl font-bold text-foreground">KES {payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                      <p className="text-2xl font-bold text-foreground">{contactMessages.filter(m => m.status === 'new').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent News & Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {newsEvents.slice(0, 3).map((news) => (
                    <div key={news.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{news.title}</h4>
                        <p className="text-xs text-muted-foreground">{new Date(news.created_at).toLocaleDateString()}</p>
                        <Badge variant={news.published ? "default" : "secondary"} className="text-xs mt-1">
                          {news.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {admissions.slice(0, 3).map((admission) => (
                    <div key={admission.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{admission.child_first_name} {admission.child_last_name}</h4>
                        <p className="text-xs text-muted-foreground">Grade {admission.grade_applying_for}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {admission.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News & Events Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">News & Events Management</h2>
              <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add News/Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingNews ? 'Edit' : 'Create'} News/Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newsForm.title}
                          onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={newsForm.type} onValueChange={(value) => setNewsForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={newsForm.excerpt}
                        onChange={(e) => setNewsForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newsForm.content}
                        onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Full content"
                        rows={4}
                      />
                    </div>

                    {newsForm.type === 'event' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="event_date">Event Date & Time</Label>
                          <Input
                            id="event_date"
                            type="datetime-local"
                            value={newsForm.event_date}
                            onChange={(e) => setNewsForm(prev => ({ ...prev, event_date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="event_location">Location</Label>
                          <Input
                            id="event_location"
                            value={newsForm.event_location}
                            onChange={(e) => setNewsForm(prev => ({ ...prev, event_location: e.target.value }))}
                            placeholder="Event location"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={newsForm.published}
                        onChange={(e) => setNewsForm(prev => ({ ...prev, published: e.target.checked }))}
                      />
                      <Label htmlFor="published">Publish immediately</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveNews}>
                        {editingNews ? 'Update' : 'Create'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewsDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-card border-0">
              <CardContent className="p-0">
                <div className="divide-y">
                  {newsEvents.map((news) => (
                    <div key={news.id} className="p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{news.title}</h3>
                          <Badge variant={news.type === 'event' ? 'default' : 'secondary'}>
                            {news.type}
                          </Badge>
                          <Badge variant={news.published ? 'default' : 'outline'}>
                            {news.published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{news.excerpt}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(news.created_at).toLocaleDateString()}
                          {news.event_date && ` • Event: ${new Date(news.event_date).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditNews(news)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteNews(news.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gallery Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Image
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <Card key={image.id} className="shadow-card border-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={image.image_url} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{image.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{image.caption}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{image.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Admissions Tab */}
          <TabsContent value="admissions" className="space-y-6">
            <h2 className="text-2xl font-bold">Admissions Management</h2>

            <Card className="shadow-card border-0">
              <CardContent className="p-0">
                <div className="divide-y">
                  {admissions.map((admission) => (
                    <div key={admission.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {admission.child_first_name} {admission.child_last_name}
                          </h3>
                          <p className="text-muted-foreground">
                            Ref: {admission.admission_ref} • Grade {admission.grade_applying_for}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Parent: {admission.parent_name} • {admission.parent_phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={admission.status} onValueChange={(value) => updateAdmissionStatus(admission.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="reviewing">Reviewing</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Applied: {new Date(admission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Payment Management</h2>
              <div className="text-sm text-muted-foreground">
                Total Revenue: KES {payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </div>
            </div>

            <Card className="shadow-card border-0">
              <CardContent className="p-0">
                <div className="divide-y">
                  {payments.map((payment) => (
                    <div key={payment.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">KES {payment.amount.toLocaleString()}</h3>
                            <Badge variant={
                              payment.status === 'completed' ? 'default' : 
                              payment.status === 'pending' ? 'secondary' : 
                              'destructive'
                            }>
                              {payment.status}
                            </Badge>
                            <Badge variant="outline">{payment.payment_method.toUpperCase()}</Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Student/Ref: {payment.admission_ref || 'N/A'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Payer: {payment.payer_phone} {payment.payer_email && `• ${payment.payer_email}`}
                            </p>
                            {payment.mpesa_transaction_id && (
                              <p className="text-sm text-muted-foreground">
                                M-Pesa Ref: {payment.mpesa_transaction_id}
                              </p>
                            )}
                            {payment.mpesa_receipt && (
                              <p className="text-sm text-muted-foreground">
                                Receipt: {payment.mpesa_receipt}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="text-sm font-medium">{new Date(payment.created_at).toLocaleString()}</p>
                          {payment.updated_at !== payment.created_at && (
                            <>
                              <p className="text-xs text-muted-foreground mt-2">Updated</p>
                              <p className="text-sm font-medium">{new Date(payment.updated_at).toLocaleString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                      <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payments yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Messages</h2>

            <Card className="shadow-card border-0">
              <CardContent className="p-0">
                <div className="divide-y">
                  {contactMessages.map((message) => (
                    <div key={message.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{message.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {message.email} • {message.phone}
                          </p>
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={message.status} onValueChange={(value) => updateContactStatus(message.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="responded">Responded</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Received: {new Date(message.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;