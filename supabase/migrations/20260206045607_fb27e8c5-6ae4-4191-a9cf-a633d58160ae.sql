-- Create news_events table
CREATE TABLE public.news_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'news',
    excerpt TEXT,
    content TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    event_location TEXT,
    featured_image_url TEXT,
    published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id),
    school_id TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on news_events
ALTER TABLE public.news_events ENABLE ROW LEVEL SECURITY;

-- Create gallery_images table
CREATE TABLE public.gallery_images (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    image_url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    school_id TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on gallery_images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    preferred_contact TEXT DEFAULT 'phone',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create admissions table
CREATE TABLE public.admissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    admission_ref TEXT UNIQUE NOT NULL,
    child_first_name TEXT NOT NULL,
    child_last_name TEXT NOT NULL,
    child_dob DATE,
    child_gender TEXT,
    parent_name TEXT NOT NULL,
    parent_email TEXT,
    parent_phone TEXT NOT NULL,
    parent_address TEXT,
    grade_applying_for TEXT NOT NULL,
    previous_school TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admissions
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Create payments table (for admission fees)
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    admission_ref TEXT,
    amount DECIMAL(10,2) NOT NULL,
    payer_phone TEXT NOT NULL,
    payer_email TEXT,
    payment_method TEXT DEFAULT 'mpesa',
    status TEXT DEFAULT 'pending',
    mpesa_receipt TEXT,
    mpesa_transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- News events: public can view published, admins can manage all
CREATE POLICY "Public can view published news" ON public.news_events
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage news" ON public.news_events
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Gallery: public can view, admins can manage
CREATE POLICY "Public can view gallery" ON public.gallery_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery" ON public.gallery_images
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Contact messages: anyone can insert, admins can view/manage
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage contacts" ON public.contact_messages
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Admissions: anyone can apply, admins can manage
CREATE POLICY "Anyone can submit admission" ON public.admissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage admissions" ON public.admissions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Payments: anyone can insert, admins can manage
CREATE POLICY "Anyone can make payment" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_news_events_updated_at
  BEFORE UPDATE ON public.news_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admissions_updated_at
  BEFORE UPDATE ON public.admissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();