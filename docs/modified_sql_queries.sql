-- ============================================================================
-- DENTAL PRACTICE MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- Consolidated, debugged, and optimized version
-- Run in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- SECTION 1: CORE TABLES
-- ============================================================================

-- Patients table with auto-generated patient_id
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT,
  medical_history TEXT,
  insurance_info VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  patient_id TEXT UNIQUE
);

-- Appointments table with extended status options
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  doctor VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes TEXT
);

-- Treatments table (legacy/optional)
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  treatment_type VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed'))
);

-- Practice settings for admin configuration
CREATE TABLE IF NOT EXISTS public.practice_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- SECTION 2: FEEDBACK & COMMUNICATION TABLES
-- ============================================================================

-- Feedback table for patient reviews and contact messages
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed')),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL
);

-- ============================================================================
-- SECTION 3: SCHEDULING & SERVICE TABLES
-- ============================================================================

-- Doctors table for appointment management
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Services catalog for treatment options
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_cost NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'general'
);

-- Patient services (treatment plan/todo list)
CREATE TABLE IF NOT EXISTS public.patient_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_cost NUMERIC DEFAULT 0,
  notes TEXT,
  scheduled_date DATE,
  completed_date DATE
);

-- ============================================================================
-- SECTION 4: FINANCIAL MANAGEMENT
-- ============================================================================

-- Patient financials tracking
CREATE TABLE IF NOT EXISTS public.patient_financials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID NOT NULL UNIQUE REFERENCES public.patients(id) ON DELETE CASCADE,
  total_treatment_cost NUMERIC DEFAULT 0,
  amount_paid_by_patient NUMERIC DEFAULT 0,
  remaining_from_patient NUMERIC DEFAULT 0,
  amount_due_to_doctor NUMERIC DEFAULT 0,
  notes TEXT
);

-- ============================================================================
-- SECTION 5: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Patients indexes
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- Treatments indexes
CREATE INDEX IF NOT EXISTS idx_treatments_patient_id ON public.treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_appointment_id ON public.treatments(appointment_id);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_patient_id ON public.feedback(patient_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Patient services indexes
CREATE INDEX IF NOT EXISTS idx_patient_services_patient_id ON public.patient_services(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_service_id ON public.patient_services(service_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_status ON public.patient_services(status);

-- Patient financials indexes
CREATE INDEX IF NOT EXISTS idx_patient_financials_patient_id ON public.patient_financials(patient_id);

-- ============================================================================
-- SECTION 6: FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Function to generate unique patient ID
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_id := 'P' || LPAD(counter::TEXT, 6, '0');
    IF NOT EXISTS (SELECT 1 FROM public.patients WHERE patient_id = new_id) THEN
      RETURN new_id;
    END IF;
    counter := counter + 1;
  END LOOP;
END;
$$;

-- Function to set patient ID on insert
CREATE OR REPLACE FUNCTION public.set_patient_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.patient_id IS NULL THEN
    NEW.patient_id := public.generate_patient_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Function to auto-create financial record for new patients
CREATE OR REPLACE FUNCTION public.create_patient_financial_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.patient_financials (
    patient_id, total_treatment_cost, amount_paid_by_patient, 
    remaining_from_patient, amount_due_to_doctor, notes
  ) VALUES (
    NEW.id, 0, 0, 0, 0, 'Initial financial record created automatically'
  ) ON CONFLICT (patient_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Function to validate patient service assignments
CREATE OR REPLACE FUNCTION public.validate_patient_service()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure patient exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.patients 
    WHERE id = NEW.patient_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Cannot assign service to inactive or non-existent patient';
  END IF;
  
  -- Ensure service exists
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE id = NEW.service_id) THEN
    RAISE EXCEPTION 'Cannot assign non-existent service';
  END IF;
  
  -- Set completed date when status changes to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_date = CURRENT_DATE;
  END IF;
  
  -- Clear completed date if status changes from completed
  IF NEW.status != 'completed' THEN
    NEW.completed_date = NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to update financial calculations
CREATE OR REPLACE FUNCTION public.update_financial_calculations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Recalculate remaining amounts
  IF NEW.total_treatment_cost IS NOT NULL AND NEW.amount_paid_by_patient IS NOT NULL THEN
    NEW.remaining_from_patient = NEW.total_treatment_cost - NEW.amount_paid_by_patient;
  END IF;
  
  -- Ensure amounts are not negative
  IF NEW.total_treatment_cost < 0 THEN NEW.total_treatment_cost = 0; END IF;
  IF NEW.amount_paid_by_patient < 0 THEN NEW.amount_paid_by_patient = 0; END IF;
  IF NEW.remaining_from_patient < 0 THEN NEW.remaining_from_patient = 0; END IF;
  IF NEW.amount_due_to_doctor < 0 THEN NEW.amount_due_to_doctor = 0; END IF;
  
  RETURN NEW;
END;
$$;

-- ============================================================================
-- SECTION 7: TRIGGER CREATION
-- ============================================================================

-- Trigger: Auto-set patient ID
DROP TRIGGER IF EXISTS patients_set_id ON public.patients;
CREATE TRIGGER patients_set_id
  BEFORE INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_patient_id();

-- Trigger: Auto-create financial record
DROP TRIGGER IF EXISTS trigger_create_patient_financial_record ON public.patients;
CREATE TRIGGER trigger_create_patient_financial_record
  AFTER INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.create_patient_financial_record();

-- Trigger: Update feedback timestamp
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Update patient services timestamp
DROP TRIGGER IF EXISTS update_patient_services_updated_at ON public.patient_services;
CREATE TRIGGER update_patient_services_updated_at
  BEFORE UPDATE ON public.patient_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Update patient financials timestamp
DROP TRIGGER IF EXISTS update_patient_financials_updated_at ON public.patient_financials;
CREATE TRIGGER update_patient_financials_updated_at
  BEFORE UPDATE ON public.patient_financials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Update practice settings timestamp
DROP TRIGGER IF EXISTS update_practice_settings_updated_at ON public.practice_settings;
CREATE TRIGGER update_practice_settings_updated_at
  BEFORE UPDATE ON public.practice_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Validate patient service
DROP TRIGGER IF EXISTS trigger_validate_patient_service ON public.patient_services;
CREATE TRIGGER trigger_validate_patient_service
  BEFORE INSERT OR UPDATE ON public.patient_services
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_patient_service();

-- Trigger: Update financial calculations
DROP TRIGGER IF EXISTS trigger_update_financial_calculations ON public.patient_financials;
CREATE TRIGGER trigger_update_financial_calculations
  BEFORE INSERT OR UPDATE ON public.patient_financials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_financial_calculations();

-- ============================================================================
-- SECTION 8: ROW LEVEL SECURITY (RLS) - PERMISSIVE FOR DEVELOPMENT
-- Note: Tighten these policies for production use with proper authentication
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_financials ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (CHANGE FOR PRODUCTION!)
CREATE POLICY "Allow all access to patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to treatments" ON public.treatments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to practice_settings" ON public.practice_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to doctors" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to patient_services" ON public.patient_services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to patient_financials" ON public.patient_financials FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SECTION 9: REALTIME CONFIGURATION
-- ============================================================================

-- Enable replica identity for realtime updates
ALTER TABLE public.patients REPLICA IDENTITY FULL;
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.treatments REPLICA IDENTITY FULL;
ALTER TABLE public.feedback REPLICA IDENTITY FULL;
ALTER TABLE public.doctors REPLICA IDENTITY FULL;
ALTER TABLE public.services REPLICA IDENTITY FULL;
ALTER TABLE public.patient_services REPLICA IDENTITY FULL;
ALTER TABLE public.patient_financials REPLICA IDENTITY FULL;

-- ============================================================================
-- SECTION 10: SEED DATA
-- ============================================================================

-- Insert default practice settings
INSERT INTO public.practice_settings (setting_key, setting_value) VALUES
('practice_info', '{
  "name": "SmileCare Dental Practice",
  "address": "123 Main Street, Cityville, ST 12345",
  "phone": "(555) 123-DENT",
  "email": "info@smilecare.com",
  "website": "www.smilecare.com",
  "working_hours": "Mon-Fri: 8:00 AM - 6:00 PM",
  "description": "Providing quality dental care for over 20 years."
}'::jsonb),
('notifications', '{
  "email_reminders": true,
  "sms_reminders": true,
  "appointment_confirmations": true,
  "payment_reminders": true,
  "system_alerts": true,
  "marketing_emails": false
}'::jsonb),
('security', '{
  "two_factor_auth": true,
  "password_expiry": 90,
  "session_timeout": 30,
  "login_attempts": 3,
  "backup_frequency": "daily"
}'::jsonb),
('system', '{
  "theme": "light",
  "language": "English",
  "timezone": "America/New_York",
  "date_format": "MM/DD/YYYY",
  "currency": "USD",
  "auto_backup": true
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default doctors
INSERT INTO public.doctors (name, specialty, email, phone) VALUES
('Dr. Smith', 'General Dentistry', 'dr.smith@dentalclinic.com', '(555) 123-4567'),
('Dr. Johnson', 'Orthodontics', 'dr.johnson@dentalclinic.com', '(555) 234-5678'),
('Dr. Brown', 'Oral Surgery', 'dr.brown@dentalclinic.com', '(555) 345-6789')
ON CONFLICT DO NOTHING;

-- Insert default services
INSERT INTO public.services (name, description, default_cost, category) VALUES
('Regular Cleaning', 'Routine dental cleaning and examination', 150, 'preventive'),
('Cavity Filling', 'Tooth cavity filling treatment', 200, 'restorative'),
('Root Canal', 'Root canal therapy', 800, 'endodontic'),
('Crown Installation', 'Dental crown placement', 1200, 'restorative'),
('Tooth Extraction', 'Tooth removal procedure', 300, 'surgical'),
('Teeth Whitening', 'Professional teeth whitening', 400, 'cosmetic'),
('Orthodontic Consultation', 'Braces consultation', 100, 'orthodontic'),
('Emergency Care', 'Emergency dental treatment', 250, 'emergency')
ON CONFLICT DO NOTHING;

-- Insert sample patients
INSERT INTO public.patients (name, email, phone, date_of_birth, address, medical_history, insurance_info, status) VALUES
('John Smith', 'john.smith@email.com', '(555) 123-4567', '1985-06-15', '123 Main St, City, State', 'No known allergies. Regular cleanings every 6 months.', 'Delta Dental', 'active'),
('Sarah Johnson', 'sarah.johnson@email.com', '(555) 987-6543', '1990-03-22', '456 Oak Ave, City, State', 'Sensitive to cold. Previous root canal.', 'Blue Cross Blue Shield', 'active'),
('Michael Brown', 'michael.brown@email.com', '(555) 456-7890', '1978-11-08', '789 Pine Rd, City, State', 'Diabetes. Regular monitoring required.', 'Aetna', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample feedback
INSERT INTO public.feedback (patient_name, patient_email, rating, message, category, status) VALUES
('John Smith', 'john.smith@email.com', 5, 'Excellent service! The staff was very professional and the treatment was painless.', 'service', 'new'),
('Sarah Johnson', 'sarah.j@email.com', 4, 'Very satisfied with my dental cleaning. The hygienist was gentle and thorough.', 'general', 'reviewed'),
('Mike Davis', 'mike.davis@email.com', 5, 'Amazing experience! I was nervous about my root canal but Dr. Smith made it completely comfortable.', 'service', 'reviewed'),
('Emily Brown', 'emily.brown@email.com', 4, 'Great dental practice. Very professional and caring staff.', 'general', 'new')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Database schema is ready for use!
-- Remember to tighten RLS policies for production deployment.
-- ============================================================================
