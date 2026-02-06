-- CRITICAL SECURITY FIX: Update RLS policies to prevent public access to sensitive data

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow admin access to patients" ON public.patients;
DROP POLICY IF EXISTS "Allow admin access to appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow admin access to patient_financials" ON public.patient_financials;
DROP POLICY IF EXISTS "Allow admin access to patient_services" ON public.patient_services;
DROP POLICY IF EXISTS "Allow admin access to feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow admin access to doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow admin access to services" ON public.services;

-- Create user roles system for proper access control
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'staff', 'patient');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- Create function to check if user is healthcare provider
CREATE OR REPLACE FUNCTION public.is_healthcare_provider(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'doctor', 'staff')
  )
$$;

-- SECURE RLS POLICIES FOR PATIENTS TABLE
CREATE POLICY "Healthcare providers can view patients" ON public.patients
FOR SELECT TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

CREATE POLICY "Healthcare providers can insert patients" ON public.patients
FOR INSERT TO authenticated
WITH CHECK (public.is_healthcare_provider(auth.uid()));

CREATE POLICY "Healthcare providers can update patients" ON public.patients
FOR UPDATE TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

CREATE POLICY "Admin can delete patients" ON public.patients
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE RLS POLICIES FOR APPOINTMENTS TABLE
CREATE POLICY "Healthcare providers can view appointments" ON public.appointments
FOR SELECT TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

CREATE POLICY "Healthcare providers can create appointments" ON public.appointments
FOR INSERT TO authenticated
WITH CHECK (public.is_healthcare_provider(auth.uid()));

CREATE POLICY "Healthcare providers can update appointments" ON public.appointments
FOR UPDATE TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

CREATE POLICY "Admin can delete appointments" ON public.appointments
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE RLS POLICIES FOR PATIENT_FINANCIALS TABLE
CREATE POLICY "Admin and staff can view patient financials" ON public.patient_financials
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admin and staff can manage patient financials" ON public.patient_financials
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- SECURE RLS POLICIES FOR PATIENT_SERVICES TABLE
CREATE POLICY "Healthcare providers can view patient services" ON public.patient_services
FOR SELECT TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

CREATE POLICY "Healthcare providers can manage patient services" ON public.patient_services
FOR ALL TO authenticated
USING (public.is_healthcare_provider(auth.uid()));

-- SECURE RLS POLICIES FOR FEEDBACK TABLE
CREATE POLICY "Admin can view all feedback" ON public.feedback
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit feedback" ON public.feedback
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin can manage feedback" ON public.feedback
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE RLS POLICIES FOR DOCTORS TABLE
CREATE POLICY "Authenticated users can view doctors" ON public.doctors
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admin can manage doctors" ON public.doctors
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE RLS POLICIES FOR SERVICES TABLE
CREATE POLICY "Anyone can view services" ON public.services
FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admin can manage services" ON public.services
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS POLICIES FOR USER_ROLES TABLE
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default admin user (replace with actual admin user ID)
-- Note: This should be updated with the actual admin user ID after authentication is set up