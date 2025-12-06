-- Relax RLS policies to make Admin Panel fully functional without authentication (dev/demo)
-- NOTE: These policies are permissive for development purposes. For production, restrict via auth roles.

-- Doctors: allow public read
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view doctors (public)" 
ON public.doctors
FOR SELECT
USING (true);

-- Feedback: allow status updates (e.g., mark as reviewed)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can update feedback (dev)"
ON public.feedback
FOR UPDATE
USING (true);

-- Patients: allow insert/update
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert patients (dev)"
ON public.patients
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update patients (dev)"
ON public.patients
FOR UPDATE
USING (true);

-- Appointments: allow insert/update
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert appointments (dev)"
ON public.appointments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update appointments (dev)"
ON public.appointments
FOR UPDATE
USING (true);

-- Patient services: allow manage (insert/select/update/delete)
ALTER TABLE public.patient_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage patient services (dev)"
ON public.patient_services
FOR ALL
USING (true)
WITH CHECK (true);

-- Patient financials: allow manage (insert/select/update/delete)
ALTER TABLE public.patient_financials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage patient financials (dev)"
ON public.patient_financials
FOR ALL
USING (true)
WITH CHECK (true);