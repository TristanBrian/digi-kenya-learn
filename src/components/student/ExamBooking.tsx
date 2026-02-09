import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Calendar, Clock, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExamSchedule {
  id: string;
  title: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  venue: string | null;
  registration_open: boolean;
  subject: { name: string; code: string } | null;
}

interface ExamRegistration {
  id: string;
  exam_id: string;
  status: string;
}

export function ExamBooking({ studentId, gradeLevel }: { studentId: string; gradeLevel: string }) {
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [registrations, setRegistrations] = useState<ExamRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [studentId, gradeLevel]);

  const loadData = async () => {
    const [examsRes, regsRes] = await Promise.all([
      supabase
        .from("exam_schedules" as any)
        .select("id, title, exam_date, start_time, end_time, venue, registration_open, subject:subjects(name, code)")
        .eq("grade_level", gradeLevel)
        .gte("exam_date", new Date().toISOString().split("T")[0])
        .order("exam_date", { ascending: true }),
      supabase
        .from("exam_registrations" as any)
        .select("id, exam_id, status")
        .eq("student_id", studentId),
    ]);

    if (examsRes.data) setExams(examsRes.data as unknown as ExamSchedule[]);
    if (regsRes.data) setRegistrations(regsRes.data as unknown as ExamRegistration[]);
    setLoading(false);
  };

  const isRegistered = (examId: string) =>
    registrations.some((r) => r.exam_id === examId);

  const handleRegister = async (examId: string) => {
    setRegistering(examId);
    try {
      const { error } = await supabase
        .from("exam_registrations" as any)
        .insert({ student_id: studentId, exam_id: examId });

      if (error) throw error;

      toast({ title: "Registered!", description: "You have been registered for this exam." });
      await loadData();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not register for exam",
        variant: "destructive",
      });
    } finally {
      setRegistering(null);
    }
  };

  const formatTime = (t: string) => t?.slice(0, 5) || "";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Exam Registration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Register for upcoming examinations below
        </p>
      </div>

      {/* Registered Exams */}
      {registrations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">My Registered Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {registrations.map((reg) => {
                const exam = exams.find((e) => e.id === reg.exam_id);
                return (
                  <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <div>
                      <p className="font-medium text-sm">{exam?.title || "Exam"}</p>
                      <p className="text-xs text-muted-foreground">
                        {exam?.exam_date ? new Date(exam.exam_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : ""}
                      </p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {reg.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Exams */}
      {exams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-1">No Upcoming Exams</h3>
            <p className="text-muted-foreground text-sm">
              There are no exams scheduled for your course at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => {
            const registered = isRegistered(exam.id);
            return (
              <Card key={exam.id} className={registered ? "border-accent/30 bg-accent/5" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{exam.title}</CardTitle>
                      <CardDescription>{(exam.subject as any)?.name}</CardDescription>
                    </div>
                    {registered && (
                      <Badge className="bg-accent text-accent-foreground">Registered</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(exam.exam_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                    </span>
                  </div>
                  {exam.venue && (
                    <p className="text-sm flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {exam.venue}
                    </p>
                  )}
                  {!registered && exam.registration_open && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleRegister(exam.id)}
                      disabled={registering === exam.id}
                    >
                      {registering === exam.id ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...</>
                      ) : (
                        "Register for Exam"
                      )}
                    </Button>
                  )}
                  {!exam.registration_open && !registered && (
                    <p className="text-xs text-muted-foreground text-center">Registration closed</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
