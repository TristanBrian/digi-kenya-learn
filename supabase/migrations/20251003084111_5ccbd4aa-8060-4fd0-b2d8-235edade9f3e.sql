-- Enable RLS on payments table if not already enabled
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all payments
CREATE POLICY "Admins can manage all payments"
ON public.payments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for viewing own payments (for future student portal)
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (
  payer_email = auth.email() OR 
  EXISTS (
    SELECT 1 FROM public.admissions
    WHERE admissions.admission_ref = payments.admission_ref
    AND admissions.parent_email = auth.email()
  )
);