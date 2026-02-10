import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Create admin user
    const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
      email: "admin@digiuniversity.ac.ke",
      password: "Admin@2026",
      email_confirm: true,
      user_metadata: { full_name: "Prof. James Mwangi" },
    });

    if (adminErr && !adminErr.message.includes("already been registered")) {
      console.error("Admin creation error:", adminErr);
    }

    const adminId = adminData?.user?.id;

    if (adminId) {
      // Create admin profile
      await supabase.from("profiles").upsert({
        user_id: adminId,
        email: "admin@digiuniversity.ac.ke",
        full_name: "Prof. James Mwangi",
        phone: "+254700100100",
      }, { onConflict: "user_id" });

      // Assign admin role
      await supabase.from("user_roles").upsert({
        user_id: adminId,
        role: "admin",
      }, { onConflict: "user_id,role" });
    }

    // Create student user
    const { data: studentData, error: studentErr } = await supabase.auth.admin.createUser({
      email: "student@digiuniversity.ac.ke",
      password: "Student@2026",
      email_confirm: true,
      user_metadata: { full_name: "Jane Wanjiku" },
    });

    if (studentErr && !studentErr.message.includes("already been registered")) {
      console.error("Student creation error:", studentErr);
    }

    const studentId = studentData?.user?.id;

    if (studentId) {
      // Create student profile
      await supabase.from("profiles").upsert({
        user_id: studentId,
        email: "student@digiuniversity.ac.ke",
        full_name: "Jane Wanjiku",
        phone: "+254700200200",
      }, { onConflict: "user_id" });

      // Assign student role
      await supabase.from("user_roles").upsert({
        user_id: studentId,
        role: "student",
      }, { onConflict: "user_id,role" });

      // Create student record
      const { data: existingStudent } = await supabase.from("students").select("id").eq("user_id", studentId).maybeSingle();
      
      let studentRecordId: string;
      if (!existingStudent) {
        const { data: newStudent } = await supabase.from("students").insert({
          user_id: studentId,
          admission_number: "DU/2024/001",
          first_name: "Jane",
          last_name: "Wanjiku",
          grade: "Year 2",
          stream: "Computer Science",
          gender: "Female",
          date_of_birth: "2002-05-15",
          parent_name: "Mary Wanjiku",
          parent_phone: "+254700300300",
          parent_email: "mary@example.com",
          status: "active",
        }).select("id").single();
        studentRecordId = newStudent!.id;
      } else {
        studentRecordId = existingStudent.id;
      }

      // Create academic term
      const { data: term } = await supabase.from("academic_terms").upsert({
        name: "Semester 1",
        year: 2026,
        start_date: "2026-01-15",
        end_date: "2026-05-30",
        is_current: true,
      }, { onConflict: "name,year" }).select("id").single();

      const { data: term2 } = await supabase.from("academic_terms").upsert({
        name: "Semester 2",
        year: 2025,
        start_date: "2025-08-15",
        end_date: "2025-12-15",
        is_current: false,
      }, { onConflict: "name,year" }).select("id").single();

      const termId = term?.id;
      const term2Id = term2?.id;

      // Create subjects
      const subjectData = [
        { code: "CS201", name: "Data Structures & Algorithms", grade_level: "Year 2" },
        { code: "CS202", name: "Database Systems", grade_level: "Year 2" },
        { code: "CS203", name: "Operating Systems", grade_level: "Year 2" },
        { code: "MTH201", name: "Discrete Mathematics", grade_level: "Year 2" },
        { code: "CS204", name: "Software Engineering", grade_level: "Year 2" },
        { code: "CS205", name: "Computer Networks", grade_level: "Year 2" },
      ];

      for (const s of subjectData) {
        await supabase.from("subjects").upsert(s, { onConflict: "code" });
      }

      const { data: subjects } = await supabase.from("subjects").select("id, code").in("code", subjectData.map(s => s.code));

      // Create results
      if (subjects && termId) {
        const grades = [
          { code: "CS201", score: 78, grade: "B+", remarks: "Good analytical skills" },
          { code: "CS202", score: 85, grade: "A", remarks: "Excellent database design" },
          { code: "CS203", score: 72, grade: "B", remarks: "Good understanding of OS concepts" },
          { code: "MTH201", score: 65, grade: "B-", remarks: "Needs more practice" },
          { code: "CS204", score: 88, grade: "A", remarks: "Outstanding project work" },
          { code: "CS205", score: 70, grade: "B", remarks: "Solid networking fundamentals" },
        ];

        for (const g of grades) {
          const subj = subjects.find(s => s.code === g.code);
          if (subj) {
            await supabase.from("results").upsert({
              student_id: studentRecordId,
              subject_id: subj.id,
              term_id: termId,
              score: g.score,
              grade: g.grade,
              remarks: g.remarks,
            }, { onConflict: "student_id,subject_id,term_id" });
          }
        }
      }

      // Create fee records
      if (termId) {
        await supabase.from("fee_records").upsert({
          student_id: studentRecordId,
          term_id: termId,
          total_amount: 150000,
          amount_paid: 100000,
          balance: 50000,
          status: "partial",
          due_date: "2026-03-30",
        }, { onConflict: "student_id,term_id" });
      }

      if (term2Id) {
        await supabase.from("fee_records").upsert({
          student_id: studentRecordId,
          term_id: term2Id,
          total_amount: 150000,
          amount_paid: 150000,
          balance: 0,
          status: "paid",
          due_date: "2025-10-30",
        }, { onConflict: "student_id,term_id" });
      }

      // Create timetable entries
      if (termId && subjects) {
        const timetableEntries = [
          { day: "Monday", start: "08:00", end: "10:00", code: "CS201", room: "LH-201", lecturer: "Dr. Kamau" },
          { day: "Monday", start: "10:30", end: "12:30", code: "CS202", room: "Lab 3", lecturer: "Dr. Ochieng" },
          { day: "Tuesday", start: "08:00", end: "10:00", code: "MTH201", room: "LH-105", lecturer: "Prof. Njoroge" },
          { day: "Tuesday", start: "14:00", end: "16:00", code: "CS203", room: "LH-201", lecturer: "Dr. Wafula" },
          { day: "Wednesday", start: "08:00", end: "10:00", code: "CS204", room: "Lab 1", lecturer: "Dr. Muthoni" },
          { day: "Wednesday", start: "10:30", end: "12:30", code: "CS205", room: "LH-301", lecturer: "Dr. Otieno" },
          { day: "Thursday", start: "08:00", end: "10:00", code: "CS201", room: "Lab 2", lecturer: "Dr. Kamau" },
          { day: "Thursday", start: "14:00", end: "16:00", code: "CS202", room: "Lab 3", lecturer: "Dr. Ochieng" },
          { day: "Friday", start: "08:00", end: "10:00", code: "MTH201", room: "LH-105", lecturer: "Prof. Njoroge" },
          { day: "Friday", start: "10:30", end: "12:30", code: "CS204", room: "Lab 1", lecturer: "Dr. Muthoni" },
        ];

        for (const t of timetableEntries) {
          const subj = subjects.find(s => s.code === t.code);
          if (subj) {
            await supabase.from("timetable_entries").insert({
              day_of_week: t.day,
              start_time: t.start,
              end_time: t.end,
              subject_id: subj.id,
              grade_level: "Year 2",
              room: t.room,
              lecturer_name: t.lecturer,
              term_id: termId,
            });
          }
        }
      }

      // Create exam schedules
      if (termId && subjects) {
        for (const subj of subjects.slice(0, 4)) {
          await supabase.from("exam_schedules").insert({
            title: `${subj.code} Final Examination`,
            exam_date: "2026-05-15",
            start_time: "09:00",
            end_time: "12:00",
            grade_level: "Year 2",
            venue: "Main Exam Hall",
            subject_id: subj.id,
            term_id: termId,
            registration_open: true,
            max_registrations: 200,
          });
        }
      }

      // Create announcements
      await supabase.from("announcements").insert([
        {
          title: "Mid-Semester Examinations Schedule Released",
          content: "The mid-semester examination timetable for Semester 1, 2026 has been released. Please check the exam booking section to register for your papers. Registration closes on March 15, 2026.",
          priority: "high",
          target_audience: "students",
          published: true,
        },
        {
          title: "Library Extended Hours During Revision Week",
          content: "The university library will operate extended hours (6 AM - 12 AM) during the revision week from March 10-14, 2026. All students are encouraged to utilize this resource.",
          priority: "normal",
          target_audience: "all",
          published: true,
        },
        {
          title: "Fee Payment Deadline Reminder",
          content: "This is a reminder that the fee payment deadline for Semester 1, 2026 is March 30, 2026. Students with outstanding balances may not be allowed to sit for examinations.",
          priority: "urgent",
          target_audience: "students",
          published: true,
        },
      ]);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Demo data seeded successfully",
      credentials: {
        admin: { email: "admin@digiuniversity.ac.ke", password: "Admin@2026" },
        student: { email: "student@digiuniversity.ac.ke", password: "Student@2026" },
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Seed error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
