import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  User, 
  Calendar,
  TrendingUp,
  FileText,
  LogOut,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface StudentData {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  grade: string;
  stream: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  enrollment_date: string | null;
  status: string;
}

interface Result {
  id: string;
  score: number;
  grade: string | null;
  remarks: string | null;
  subject: {
    name: string;
    code: string;
  };
  term: {
    name: string;
    year: number;
  };
}

interface FeeRecord {
  id: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  due_date: string | null;
  term: {
    name: string;
    year: number;
  };
}

interface FeePayment {
  id: string;
  amount: number;
  payment_method: string;
  receipt_number: string | null;
  created_at: string;
}

const StudentDashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Check if user is a student
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (studentError) {
        console.error('Error fetching student:', studentError);
      }

      if (!studentData) {
        // Check if user is admin - redirect to admin dashboard
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (userRole) {
          navigate('/admin');
          return;
        }

        toast({
          title: "No Student Account",
          description: "Your account is not linked to a student profile. Please contact the administration.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      setStudent(studentData);
      await loadStudentData(studentData.id);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async (studentId: string) => {
    try {
      // Load results with subject and term info
      const { data: resultsData } = await supabase
        .from('results')
        .select(`
          id,
          score,
          grade,
          remarks,
          subject:subjects(name, code),
          term:academic_terms(name, year)
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (resultsData) {
        const formattedResults = resultsData.map((r: any) => ({
          ...r,
          subject: r.subject,
          term: r.term
        }));
        setResults(formattedResults);
      }

      // Load fee records with term info
      const { data: feeData } = await supabase
        .from('fee_records')
        .select(`
          id,
          total_amount,
          amount_paid,
          balance,
          status,
          due_date,
          term:academic_terms(name, year)
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (feeData) {
        const formattedFees = feeData.map((f: any) => ({
          ...f,
          term: f.term
        }));
        setFeeRecords(formattedFees);
      }

      // Load fee payments
      const { data: paymentsData } = await supabase
        .from('fee_payments')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (paymentsData) {
        setFeePayments(paymentsData);
      }

    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const calculateGPA = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.score, 0);
    return (total / results.length).toFixed(1);
  };

  const getTotalBalance = () => {
    return feeRecords.reduce((sum, f) => sum + f.balance, 0);
  };

  const getGradeColor = (grade: string | null) => {
    if (!grade) return 'bg-muted text-muted-foreground';
    const g = grade.toUpperCase();
    if (g === 'A' || g === 'A+') return 'bg-green-100 text-green-800';
    if (g === 'B' || g === 'B+') return 'bg-blue-100 text-blue-800';
    if (g === 'C' || g === 'C+') return 'bg-yellow-100 text-yellow-800';
    if (g === 'D' || g === 'D+') return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>No Student Profile</CardTitle>
            <CardDescription>
              Your account is not linked to a student profile. Please contact the school administration to set up your student account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
            <Button onClick={handleSignOut} variant="ghost" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
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
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  {student.first_name[0]}{student.last_name[0]}
                </span>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {student.first_name} {student.last_name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {student.admission_number} • {student.grade}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Fees</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Score</CardDescription>
                  <CardTitle className="text-3xl text-primary">{calculateGPA()}%</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Subjects</CardDescription>
                  <CardTitle className="text-3xl">{new Set(results.map(r => r.subject?.code)).size}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Fee Balance</CardDescription>
                  <CardTitle className="text-3xl text-destructive">
                    KES {getTotalBalance().toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Status</CardDescription>
                  <CardTitle>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="text-sm">
                      {student.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Results */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Recent Results
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('results')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No results available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {results.slice(0, 5).map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{result.subject?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {result.term?.name} {result.term?.year}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">{result.score}%</span>
                          <Badge className={getGradeColor(result.grade)}>
                            {result.grade || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fee Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Fee Summary
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('fees')}>
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {feeRecords.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No fee records available.</p>
                ) : (
                  <div className="space-y-4">
                    {feeRecords.slice(0, 3).map((fee) => (
                      <div key={fee.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{fee.term?.name} {fee.term?.year}</span>
                          <Badge variant={fee.status === 'paid' ? 'default' : fee.status === 'partial' ? 'secondary' : 'destructive'}>
                            {fee.status}
                          </Badge>
                        </div>
                        <Progress value={(fee.amount_paid / fee.total_amount) * 100} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Paid: KES {fee.amount_paid.toLocaleString()}</span>
                          <span>Balance: KES {fee.balance.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Academic Results
                    </CardTitle>
                    <CardDescription>Your performance across all subjects and terms</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results have been recorded yet.</p>
                    <p className="text-sm text-muted-foreground">Check back after your assessments.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Subject</th>
                          <th className="text-left py-3 px-2 font-medium">Term</th>
                          <th className="text-center py-3 px-2 font-medium">Score</th>
                          <th className="text-center py-3 px-2 font-medium">Grade</th>
                          <th className="text-left py-3 px-2 font-medium">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result) => (
                          <tr key={result.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-medium">{result.subject?.name}</p>
                                <p className="text-xs text-muted-foreground">{result.subject?.code}</p>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground">
                              {result.term?.name} {result.term?.year}
                            </td>
                            <td className="py-3 px-2 text-center font-bold">{result.score}%</td>
                            <td className="py-3 px-2 text-center">
                              <Badge className={getGradeColor(result.grade)}>
                                {result.grade || 'N/A'}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">
                              {result.remarks || '-'}
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

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-6">
            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Fees</CardDescription>
                  <CardTitle className="text-2xl">
                    KES {feeRecords.reduce((sum, f) => sum + f.total_amount, 0).toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Paid</CardDescription>
                  <CardTitle className="text-2xl text-green-600">
                    KES {feeRecords.reduce((sum, f) => sum + f.amount_paid, 0).toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-destructive/50">
                <CardHeader className="pb-2">
                  <CardDescription>Outstanding Balance</CardDescription>
                  <CardTitle className="text-2xl text-destructive">
                    KES {getTotalBalance().toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Fee Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Fee Records by Term
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feeRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No fee records available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feeRecords.map((fee) => (
                      <div key={fee.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{fee.term?.name} {fee.term?.year}</h4>
                            {fee.due_date && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Due: {new Date(fee.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Badge variant={
                            fee.status === 'paid' ? 'default' : 
                            fee.status === 'partial' ? 'secondary' : 'destructive'
                          }>
                            {fee.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {fee.status}
                          </Badge>
                        </div>
                        <Progress value={(fee.amount_paid / fee.total_amount) * 100} className="h-3" />
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-medium">KES {fee.total_amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Paid</p>
                            <p className="font-medium text-green-600">KES {fee.amount_paid.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Balance</p>
                            <p className="font-medium text-destructive">KES {fee.balance.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feePayments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No payment records found.</p>
                ) : (
                  <div className="space-y-3">
                    {feePayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">KES {payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.payment_method} • {payment.receipt_number || 'No receipt'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-2xl">
                        {student.first_name[0]}{student.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{student.first_name} {student.last_name}</h3>
                      <p className="text-muted-foreground">{student.admission_number}</p>
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Grade/Class</p>
                      <p className="font-medium">{student.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stream</p>
                      <p className="font-medium">{student.stream || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{student.gender || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Enrollment Date</p>
                      <p className="font-medium">
                        {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parent/Guardian Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Parent/Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{student.parent_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{student.parent_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{student.parent_email || 'Not provided'}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Account Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Academic Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{calculateGPA()}%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{results.length}</p>
                    <p className="text-sm text-muted-foreground">Total Assessments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{new Set(results.map(r => r.subject?.code)).size}</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{new Set(results.map(r => `${r.term?.name}-${r.term?.year}`)).size}</p>
                    <p className="text-sm text-muted-foreground">Terms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
