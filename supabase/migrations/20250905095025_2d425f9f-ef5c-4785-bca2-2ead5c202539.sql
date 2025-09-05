-- Fix RLS policies for admissions table to allow public submissions
DROP POLICY IF EXISTS "Anyone can submit admissions" ON public.admissions;
DROP POLICY IF EXISTS "Authenticated users can view own admissions" ON public.admissions;

-- Create proper policies for admissions
CREATE POLICY "Anyone can submit admissions"
ON public.admissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users to view their own admissions (if they have an account)
CREATE POLICY "Users can view their own admissions"
ON public.admissions
FOR SELECT
TO authenticated
USING (parent_email = auth.email());

-- Admins can manage all admissions
CREATE POLICY "Admins can manage all admissions"
ON public.admissions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add similar policies for contact messages
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can manage contact messages"
ON public.contact_messages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));