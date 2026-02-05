-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'parent', 'teacher');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create students table (linked to user accounts)
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    admission_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    grade TEXT NOT NULL,
    stream TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    parent_email TEXT,
    address TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create academic_terms table
CREATE TABLE public.academic_terms (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on academic_terms
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    grade_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create results table
CREATE TABLE public.results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    term_id UUID REFERENCES public.academic_terms(id) ON DELETE CASCADE NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    grade TEXT,
    remarks TEXT,
    teacher_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on results
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create fee_categories table
CREATE TABLE public.fee_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    grade_level TEXT,
    term_id UUID REFERENCES public.academic_terms(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on fee_categories
ALTER TABLE public.fee_categories ENABLE ROW LEVEL SECURITY;

-- Create fee_records table (student fee balances and payments)
CREATE TABLE public.fee_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    term_id UUID REFERENCES public.academic_terms(id) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    balance DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    status TEXT DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on fee_records
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;

-- Create fee_payments table
CREATE TABLE public.fee_payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    fee_record_id UUID REFERENCES public.fee_records(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_ref TEXT,
    receipt_number TEXT UNIQUE,
    paid_by TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on fee_payments
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's student record
CREATE OR REPLACE FUNCTION public.get_user_student_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.students WHERE user_id = _user_id LIMIT 1
$$;

-- Function to assign first user as admin
CREATE OR REPLACE FUNCTION public.assign_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first user
  IF (SELECT COUNT(*) FROM public.user_roles) = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for first user admin
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_user_admin();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_results_updated_at
  BEFORE UPDATE ON public.results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_records_updated_at
  BEFORE UPDATE ON public.fee_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS POLICIES

-- Profiles: users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- User roles: users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Students: students can view their own record, admins can manage all
CREATE POLICY "Students can view own record" ON public.students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Academic terms: everyone can view, admins can manage
CREATE POLICY "Everyone can view terms" ON public.academic_terms
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage terms" ON public.academic_terms
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Subjects: everyone can view, admins can manage
CREATE POLICY "Everyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Results: students can view their own, admins and teachers can manage
CREATE POLICY "Students can view own results" ON public.results
  FOR SELECT USING (student_id = get_user_student_id(auth.uid()));

CREATE POLICY "Admins can manage results" ON public.results
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage results" ON public.results
  FOR ALL USING (has_role(auth.uid(), 'teacher'));

-- Fee categories: everyone can view, admins can manage
CREATE POLICY "Everyone can view fee categories" ON public.fee_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage fee categories" ON public.fee_categories
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Fee records: students can view their own, admins can manage all
CREATE POLICY "Students can view own fee records" ON public.fee_records
  FOR SELECT USING (student_id = get_user_student_id(auth.uid()));

CREATE POLICY "Admins can manage fee records" ON public.fee_records
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Fee payments: students can view their own, admins can manage all
CREATE POLICY "Students can view own payments" ON public.fee_payments
  FOR SELECT USING (student_id = get_user_student_id(auth.uid()));

CREATE POLICY "Admins can manage fee payments" ON public.fee_payments
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Insert some sample data for subjects
INSERT INTO public.subjects (name, code, description, grade_level) VALUES
  ('Mathematics', 'MATH', 'Core mathematics curriculum', 'All'),
  ('English', 'ENG', 'English language and literature', 'All'),
  ('Science', 'SCI', 'General science', 'All'),
  ('History', 'HIST', 'World and local history', 'All'),
  ('Geography', 'GEO', 'Physical and human geography', 'All'),
  ('Computer Studies', 'CS', 'Information technology and programming', 'All'),
  ('Kiswahili', 'KSW', 'Kiswahili language', 'All'),
  ('Physics', 'PHY', 'Advanced physics', 'Secondary'),
  ('Chemistry', 'CHEM', 'Advanced chemistry', 'Secondary'),
  ('Biology', 'BIO', 'Advanced biology', 'Secondary');

-- Insert sample academic term
INSERT INTO public.academic_terms (name, year, start_date, end_date, is_current) VALUES
  ('Term 1', 2025, '2025-01-06', '2025-04-04', false),
  ('Term 2', 2025, '2025-04-28', '2025-08-01', true),
  ('Term 3', 2025, '2025-08-25', '2025-11-21', false);