-- Fix remaining security issues

-- Update doctors table RLS policy to restrict to authenticated users only
DROP POLICY IF EXISTS "Authenticated users can view doctors" ON public.doctors;
CREATE POLICY "Healthcare providers can view doctors" 
  ON public.doctors 
  FOR SELECT 
  USING (is_healthcare_provider(auth.uid()));

-- Ensure feedback table has proper RLS policies (already created but let's verify)
-- The current policy only allows admins to view feedback, which is correct

-- Enable realtime for all tables to support real-time updates
ALTER TABLE public.patients REPLICA IDENTITY FULL;
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.feedback REPLICA IDENTITY FULL;
ALTER TABLE public.doctors REPLICA IDENTITY FULL;
ALTER TABLE public.services REPLICA IDENTITY FULL;
ALTER TABLE public.patient_services REPLICA IDENTITY FULL;
ALTER TABLE public.patient_financials REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_financials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;