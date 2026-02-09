
-- Timetable entries for students
CREATE TABLE public.timetable_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL, -- Monday, Tuesday, etc.
  start_time time NOT NULL,
  end_time time NOT NULL,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  lecturer_name text,
  room text,
  grade_level text NOT NULL,
  term_id uuid REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view timetable" ON public.timetable_entries FOR SELECT USING (true);
CREATE POLICY "Admins can manage timetable" ON public.timetable_entries FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Exam schedules
CREATE TABLE public.exam_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  exam_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  venue text,
  grade_level text NOT NULL,
  term_id uuid REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  registration_open boolean DEFAULT true,
  max_registrations integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view exams" ON public.exam_schedules FOR SELECT USING (true);
CREATE POLICY "Admins can manage exams" ON public.exam_schedules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Exam registrations (booking)
CREATE TABLE public.exam_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  exam_id uuid NOT NULL REFERENCES public.exam_schedules(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered',
  registered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, exam_id)
);

ALTER TABLE public.exam_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own registrations" ON public.exam_registrations FOR SELECT USING (student_id = get_user_student_id(auth.uid()));
CREATE POLICY "Students can register for exams" ON public.exam_registrations FOR INSERT WITH CHECK (student_id = get_user_student_id(auth.uid()));
CREATE POLICY "Admins can manage registrations" ON public.exam_registrations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Announcements for student portal
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'normal', -- low, normal, high, urgent
  target_audience text DEFAULT 'all', -- all, students, staff
  published boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published announcements" ON public.announcements FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
