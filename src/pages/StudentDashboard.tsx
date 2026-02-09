import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap, BookOpen, CreditCard, User, TrendingUp, FileText,
  Clock, CheckCircle, AlertCircle, Download, Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { TimetableView } from "@/components/student/TimetableView";
import { ExamBooking } from "@/components/student/ExamBooking";
import { AnnouncementsView } from "@/components/student/AnnouncementsView";

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
  subject: { name: string; code: string };
  term: { name: string; year: number };
}

interface FeeRecord {
  id: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  due_date: string | null;
  term: { name: string; year: number };
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session?.user) { navigate("/auth"); return; }
      setUser(session.user);
    });
    checkAuth();
    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/auth"); return; }
      setUser(session.user);

      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!studentData) {
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (adminRole) { navigate("/admin"); return; }

        toast({ title: "No Student Account", description: "Your account is not linked to a student profile.", variant: "destructive" });
        setLoading(false);
        return;
      }

      setStudent(studentData);
      await loadStudentData(studentData.id);
    } catch {
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async (studentId: string) => {
    const [resultsRes, feesRes, paymentsRes] = await Promise.all([
      supabase.from("results").select("id, score, grade, remarks, subject:subjects(name, code), term:academic_terms(name, year)").eq("student_id", studentId).order("created_at", { ascending: false }),
      supabase.from("fee_records").select("id, total_amount, amount_paid, balance, status, due_date, term:academic_terms(name, year)").eq("student_id", studentId).order("created_at", { ascending: false }),
      supabase.from("fee_payments").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
    ]);

    if (resultsRes.data) setResults(resultsRes.data.map((r: any) => ({ ...r, subject: r.subject, term: r.term })));
    if (feesRes.data) setFeeRecords(feesRes.data.map((f: any) => ({ ...f, term: f.term })));
    if (paymentsRes.data) setFeePayments(paymentsRes.data);
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  const avgScore = results.length ? (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1) : "0";
  const totalBalance = feeRecords.reduce((s, f) => s + f.balance, 0);

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-muted text-muted-foreground";
    const g = grade.toUpperCase();
    if (g.startsWith("A")) return "bg-accent/20 text-accent";
    if (g.startsWith("B")) return "bg-primary/20 text-primary";
    if (g.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    return "bg-destructive/20 text-destructive";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>No Student Profile</CardTitle>
            <CardDescription>Your account is not linked to a student profile. Please contact administration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">Back to Home</Button>
            <Button onClick={handleSignOut} variant="ghost" className="w-full">Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <StudentSidebar
        studentName={`${student.first_name} ${student.last_name}`}
        studentInitials={`${student.first_name[0]}${student.last_name[0]}`}
        admissionNumber={student.admission_number}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
      />

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Dashboard"}
              {activeTab === "results" && "Academic Results"}
              {activeTab === "fees" && "Fee Statement"}
              {activeTab === "timetable" && "Class Timetable"}
              {activeTab === "exams" && "Exam Booking"}
              {activeTab === "announcements" && "Announcements"}
              {activeTab === "profile" && "My Profile"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {student.first_name}
            </p>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardDescription>Average Score</CardDescription>
                    <CardTitle className="text-3xl text-primary">{avgScore}%</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardDescription>Subjects</CardDescription>
                    <CardTitle className="text-3xl">{new Set(results.map(r => r.subject?.code)).size}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardDescription>Fee Balance</CardDescription>
                    <CardTitle className="text-3xl text-destructive">KES {totalBalance.toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardDescription>Status</CardDescription>
                    <CardTitle>
                      <Badge variant={student.status === "active" ? "default" : "secondary"} className="text-sm mt-1">{student.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-card border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" /> Recent Results
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("results")}>View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {results.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6 text-sm">No results available yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {results.slice(0, 4).map((r) => (
                          <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{r.subject?.name}</p>
                              <p className="text-xs text-muted-foreground">{r.term?.name} {r.term?.year}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{r.score}%</span>
                              <Badge className={getGradeColor(r.grade)}>{r.grade || "N/A"}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-card border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" /> Fee Summary
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("fees")}>View Details</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {feeRecords.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6 text-sm">No fee records available.</p>
                    ) : (
                      <div className="space-y-4">
                        {feeRecords.slice(0, 3).map((fee) => (
                          <div key={fee.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{fee.term?.name} {fee.term?.year}</span>
                              <Badge variant={fee.status === "paid" ? "default" : fee.status === "partial" ? "secondary" : "destructive"}>{fee.status}</Badge>
                            </div>
                            <Progress value={(fee.amount_paid / fee.total_amount) * 100} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Paid: KES {fee.amount_paid.toLocaleString()}</span>
                              <span>Bal: KES {fee.balance.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Results */}
          {activeTab === "results" && (
            <Card className="shadow-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" /> Academic Transcript
                    </CardTitle>
                    <CardDescription>Your performance across all subjects and terms</CardDescription>
                  </div>
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export</Button>
                </div>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium text-sm">Subject</th>
                          <th className="text-left py-3 px-2 font-medium text-sm">Term</th>
                          <th className="text-center py-3 px-2 font-medium text-sm">Score</th>
                          <th className="text-center py-3 px-2 font-medium text-sm">Grade</th>
                          <th className="text-left py-3 px-2 font-medium text-sm">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r) => (
                          <tr key={r.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-2">
                              <p className="font-medium text-sm">{r.subject?.name}</p>
                              <p className="text-xs text-muted-foreground">{r.subject?.code}</p>
                            </td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">{r.term?.name} {r.term?.year}</td>
                            <td className="py-3 px-2 text-center font-bold text-sm">{r.score}%</td>
                            <td className="py-3 px-2 text-center">
                              <Badge className={getGradeColor(r.grade)}>{r.grade || "N/A"}</Badge>
                            </td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">{r.remarks || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fees */}
          {activeTab === "fees" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Fees</CardDescription>
                    <CardTitle className="text-2xl">KES {feeRecords.reduce((s, f) => s + f.total_amount, 0).toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="shadow-card border-0">
                  <CardHeader className="pb-2">
                    <CardDescription>Total Paid</CardDescription>
                    <CardTitle className="text-2xl text-accent">KES {feeRecords.reduce((s, f) => s + f.amount_paid, 0).toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="shadow-card border-0 border-destructive/20">
                  <CardHeader className="pb-2">
                    <CardDescription>Outstanding</CardDescription>
                    <CardTitle className="text-2xl text-destructive">KES {totalBalance.toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-primary" /> Fee Records by Term
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {feeRecords.length === 0 ? (
                    <div className="text-center py-16">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No fee records available.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feeRecords.map((fee) => (
                        <div key={fee.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-sm">{fee.term?.name} {fee.term?.year}</h4>
                              {fee.due_date && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> Due: {new Date(fee.due_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Badge variant={fee.status === "paid" ? "default" : fee.status === "partial" ? "secondary" : "destructive"}>
                              {fee.status === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {fee.status}
                            </Badge>
                          </div>
                          <Progress value={(fee.amount_paid / fee.total_amount) * 100} className="h-3" />
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Total</p>
                              <p className="font-medium">KES {fee.total_amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Paid</p>
                              <p className="font-medium text-accent">KES {fee.amount_paid.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Balance</p>
                              <p className="font-medium text-destructive">KES {fee.balance.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4 text-primary" /> Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {feePayments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8 text-sm">No payment records found.</p>
                  ) : (
                    <div className="space-y-2">
                      {feePayments.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-accent/10 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">KES {p.amount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{p.payment_method} • {p.receipt_number || "No receipt"}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Timetable */}
          {activeTab === "timetable" && <TimetableView gradeLevel={student.grade} />}

          {/* Exams */}
          {activeTab === "exams" && <ExamBooking studentId={student.id} gradeLevel={student.grade} />}

          {/* Announcements */}
          {activeTab === "announcements" && <AnnouncementsView />}

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-primary" /> Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xl">{student.first_name[0]}{student.last_name[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{student.first_name} {student.last_name}</h3>
                      <p className="text-sm text-muted-foreground">{student.admission_number}</p>
                      <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-muted-foreground text-xs">Grade/Level</p><p className="font-medium">{student.grade}</p></div>
                    <div><p className="text-muted-foreground text-xs">Stream</p><p className="font-medium">{student.stream || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Gender</p><p className="font-medium">{student.gender || "-"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Date of Birth</p><p className="font-medium">{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : "-"}</p></div>
                    <div className="col-span-2"><p className="text-muted-foreground text-xs">Enrollment Date</p><p className="font-medium">{student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : "-"}</p></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-primary" /> Parent/Guardian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{student.parent_name || "Not provided"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{student.parent_phone || "Not provided"}</p></div>
                  <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{student.parent_email || "Not provided"}</p></div>
                  <Separator />
                  <div><p className="text-muted-foreground text-xs">Account Email</p><p className="font-medium">{user?.email}</p></div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="h-4 w-4 text-primary" /> Academic Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">{avgScore}%</p>
                      <p className="text-xs text-muted-foreground">Average</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{results.length}</p>
                      <p className="text-xs text-muted-foreground">Assessments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{new Set(results.map(r => r.subject?.code)).size}</p>
                      <p className="text-xs text-muted-foreground">Subjects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{new Set(results.map(r => `${r.term?.name}-${r.term?.year}`)).size}</p>
                      <p className="text-xs text-muted-foreground">Terms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
