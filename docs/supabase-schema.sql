-- Supabase SQL Schema for Dental Practice Management System (Updated)
-- Run these queries in your Supabase SQL Editor to set up or align the database

-- 1) Core tables -------------------------------------------------------------

-- Patients
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

-- Appointments
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

-- Treatments (optional legacy)
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

-- Practice settings
CREATE TABLE IF NOT EXISTS public.practice_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2) New feature tables ------------------------------------------------------

-- Feedback (real-time)
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

-- Doctors (used by appointment scheduling)
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Services catalog (used by patient_services)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_cost NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'general'
);

-- Patient services (TODO/treatment plan)
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

-- Patient financials (3 financial slots)
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

-- 3) RLS ---------------------------------------------------------------------
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_financials ENABLE ROW LEVEL SECURITY;

-- Simple admin-like access policies (adjust as needed)
CREATE POLICY IF NOT EXISTS "Allow admin access to patients" ON public.patients FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to treatments" ON public.treatments FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to practice_settings" ON public.practice_settings FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to feedback" ON public.feedback FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to doctors" ON public.doctors FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to services" ON public.services FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to patient_services" ON public.patient_services FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to patient_financials" ON public.patient_financials FOR ALL USING (true);

-- 4) Triggers & functions ----------------------------------------------------
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

-- Auto-set updated_at
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_services_updated_at ON public.patient_services;
CREATE TRIGGER update_patient_services_updated_at
  BEFORE UPDATE ON public.patient_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_financials_updated_at ON public.patient_financials;
CREATE TRIGGER update_patient_financials_updated_at
  BEFORE UPDATE ON public.patient_financials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Generated patient_id (unique)
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

DROP TRIGGER IF EXISTS patients_set_id ON public.patients;
CREATE TRIGGER patients_set_id
  BEFORE INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_patient_id();

-- Optional: auto-create a financial record for new patients
CREATE OR REPLACE FUNCTION public.create_patient_financial_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.patient_financials (
    patient_id, total_treatment_cost, amount_paid_by_patient, remaining_from_patient, amount_due_to_doctor, notes
  ) VALUES (
    NEW.id, 0, 0, 0, 0, 'Initial financial record created automatically'
  ) ON CONFLICT (patient_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_create_patient_financial_record ON public.patients;
CREATE TRIGGER trigger_create_patient_financial_record
  AFTER INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.create_patient_financial_record();

-- 5) Indexes -----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_treatments_patient_id ON public.treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_appointment_id ON public.treatments(appointment_id);

CREATE INDEX IF NOT EXISTS idx_feedback_patient_id ON public.feedback(patient_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_patient_services_patient_id ON public.patient_services(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_service_id ON public.patient_services(service_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_status ON public.patient_services(status);

CREATE INDEX IF NOT EXISTS idx_patient_financials_patient_id ON public.patient_financials(patient_id);

-- 6) Seed data (optional) ----------------------------------------------------
INSERT INTO public.doctors (name, specialty, email, phone)
VALUES
('Dr. Smith', 'General Dentistry', 'dr.smith@dentalclinic.com', '(555) 123-4567'),
('Dr. Johnson', 'Orthodontics', 'dr.johnson@dentalclinic.com', '(555) 234-5678'),
('Dr. Brown', 'Oral Surgery', 'dr.brown@dentalclinic.com', '(555) 345-6789')
ON CONFLICT DO NOTHING;

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



-- Dental Practice Management System - Basic Schema

-- Supabase SQL Schema for Dental Practice Management System
-- Run these queries in your Supabase SQL Editor to set up the database

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT,
  medical_history TEXT,
  insurance_info VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  doctor VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  notes TEXT
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  treatment_type VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed'))
);

-- Create practice_settings table for admin settings
CREATE TABLE IF NOT EXISTS practice_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default practice settings
INSERT INTO practice_settings (setting_key, setting_value) VALUES
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_treatments_patient_id ON treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_appointment_id ON treatments(appointment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON patients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON appointments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON treatments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON practice_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for practice_settings
CREATE TRIGGER update_practice_settings_updated_at
    BEFORE UPDATE ON practice_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO patients (name, email, phone, date_of_birth, address, medical_history, insurance_info, status) VALUES
('John Smith', 'john.smith@email.com', '(555) 123-4567', '1985-06-15', '123 Main St, City, State', 'No known allergies. Regular cleanings every 6 months.', 'Delta Dental', 'active'),
('Sarah Johnson', 'sarah.johnson@email.com', '(555) 987-6543', '1990-03-22', '456 Oak Ave, City, State', 'Sensitive to cold. Previous root canal.', 'Blue Cross Blue Shield', 'active'),
('Michael Brown', 'michael.brown@email.com', '(555) 456-7890', '1978-11-08', '789 Pine Rd, City, State', 'Diabetes. Regular monitoring required.', 'Aetna', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (patient_id, appointment_date, appointment_time, service_type, doctor, status, notes)
SELECT 
  p.id,
  CURRENT_DATE + INTERVAL '7 days',
  '10:00:00',
  'Regular Cleaning',
  'Dr. Smith',
  'scheduled',
  'Regular checkup and cleaning'
FROM patients p
WHERE p.email = 'john.smith@email.com'
ON CONFLICT DO NOTHING;

-- Admin Access RLS Policies update
-- Fix RLS policies to allow proper admin access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON patients;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON appointments;

-- Create more permissive policies for admin access
CREATE POLICY "Allow admin access to patients" ON patients
FOR ALL 
USING (true);

CREATE POLICY "Allow admin access to appointments" ON appointments  
FOR ALL
USING (true);

-- Ensure RLS is enabled but policies are permissive for now
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

--Restrict application value options for appointment status
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'));

-- Client Feedback , scheduling & Billing Schema 
-- Create feedback table for real-time feedback management
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed')),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to feedback" 
ON public.feedback 
FOR ALL 
USING (true);

-- Create doctors table for appointment scheduling
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to doctors" 
ON public.doctors 
FOR ALL 
USING (true);

-- Insert default doctors
INSERT INTO public.doctors (name, specialty, email, phone) VALUES
('Dr. Smith', 'General Dentistry', 'dr.smith@dentalclinic.com', '(555) 123-4567'),
('Dr. Johnson', 'Orthodontics', 'dr.johnson@dentalclinic.com', '(555) 234-5678'),
('Dr. Brown', 'Oral Surgery', 'dr.brown@dentalclinic.com', '(555) 345-6789');

-- Create services table for todo list functionality
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL,
  description TEXT,
  default_cost NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'general'
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to services" 
ON public.services 
FOR ALL 
USING (true);

-- Insert default services
INSERT INTO public.services (name, description, default_cost, category) VALUES
('Regular Cleaning', 'Routine dental cleaning and examination', 150, 'preventive'),
('Cavity Filling', 'Tooth cavity filling treatment', 200, 'restorative'),
('Root Canal', 'Root canal therapy', 800, 'endodontic'),
('Crown Installation', 'Dental crown placement', 1200, 'restorative'),
('Tooth Extraction', 'Tooth removal procedure', 300, 'surgical'),
('Teeth Whitening', 'Professional teeth whitening', 400, 'cosmetic'),
('Orthodontic Consultation', 'Braces consultation', 100, 'orthodontic'),
('Emergency Care', 'Emergency dental treatment', 250, 'emergency');

-- Create patient_services table for todo list
CREATE TABLE public.patient_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_cost NUMERIC DEFAULT 0,
  notes TEXT,
  scheduled_date DATE,
  completed_date DATE
);

-- Enable RLS
ALTER TABLE public.patient_services ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to patient_services" 
ON public.patient_services 
FOR ALL 
USING (true);

-- Create patient_financials table for financial tracking
CREATE TABLE public.patient_financials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  total_treatment_cost NUMERIC DEFAULT 0,
  amount_paid_by_patient NUMERIC DEFAULT 0,
  remaining_from_patient NUMERIC DEFAULT 0,
  amount_due_to_doctor NUMERIC DEFAULT 0,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.patient_financials ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to patient_financials" 
ON public.patient_financials 
FOR ALL 
USING (true);

-- Add unique patient_id column to patients table
ALTER TABLE public.patients ADD COLUMN patient_id TEXT UNIQUE;

-- Create function to generate unique patient ID
CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_id := 'P' || LPAD(counter::TEXT, 6, '0');
        
        -- Check if this ID already exists
        IF NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update existing patients with unique IDs
UPDATE public.patients 
SET patient_id = generate_patient_id()
WHERE patient_id IS NULL;

-- Create trigger to auto-generate patient ID for new patients
CREATE OR REPLACE FUNCTION set_patient_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.patient_id IS NULL THEN
        NEW.patient_id := generate_patient_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patients_set_id
    BEFORE INSERT ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION set_patient_id();

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_services_updated_at
    BEFORE UPDATE ON public.patient_services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_financials_updated_at
    BEFORE UPDATE ON public.patient_financials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all new tables
ALTER TABLE public.feedback REPLICA IDENTITY FULL;
ALTER TABLE public.doctors REPLICA IDENTITY FULL;
ALTER TABLE public.services REPLICA IDENTITY FULL;
ALTER TABLE public.patient_services REPLICA IDENTITY FULL;
ALTER TABLE public.patient_financials REPLICA IDENTITY FULL;

--PatientID Generation & timestamp trigger  
-- Fix function search path issues for security compliance

-- Update generate_patient_id function with proper search_path
CREATE OR REPLACE FUNCTION generate_patient_id()
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
        
        -- Check if this ID already exists
        IF NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$;

-- Update set_patient_id function with proper search_path
CREATE OR REPLACE FUNCTION set_patient_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.patient_id IS NULL THEN
        NEW.patient_id := generate_patient_id();
    END IF;
    RETURN NEW;
END;
$$;

-- Update update_updated_at_column function with proper search_path
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

-- Detail patient Realtime schema & Trigger Functions
-- Create comprehensive dental practice database with real-time features
-- This script creates all necessary tables, indexes, and functions for the dental practice

-- Enable realtime for new tables (if not already enabled)
DO $$
BEGIN
    -- Add tables to realtime publication if they exist and aren't already added
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'feedback' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'doctors' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'services' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'patient_services' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_services;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'patient_financials' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_financials;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'patients' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'appointments' AND schemaname = 'public') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors if tables don't exist or are already in publication
        NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_patient_id ON public.feedback(patient_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_patient_services_patient_id ON public.patient_services(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_service_id ON public.patient_services(service_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_status ON public.patient_services(status);

CREATE INDEX IF NOT EXISTS idx_patient_financials_patient_id ON public.patient_financials(patient_id);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);

-- Create function to automatically create financial record for new patients
CREATE OR REPLACE FUNCTION create_patient_financial_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create a default financial record for the new patient
    INSERT INTO public.patient_financials (
        patient_id,
        total_treatment_cost,
        amount_paid_by_patient,
        remaining_from_patient,
        amount_due_to_doctor,
        notes
    ) VALUES (
        NEW.id,
        0.00,
        0.00,
        0.00,
        0.00,
        'Initial financial record created automatically'
    ) ON CONFLICT (patient_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically create financial records
DROP TRIGGER IF EXISTS trigger_create_patient_financial_record ON public.patients;
CREATE TRIGGER trigger_create_patient_financial_record
    AFTER INSERT ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION create_patient_financial_record();

-- Create function to update appointment count statistics
CREATE OR REPLACE FUNCTION update_appointment_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- This function can be extended to update statistics
    -- For now, it just ensures data integrity
    
    IF TG_OP = 'INSERT' THEN
        -- Log new appointment creation
        RAISE NOTICE 'New appointment created for patient %', NEW.patient_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log appointment status changes
        IF OLD.status != NEW.status THEN
            RAISE NOTICE 'Appointment % status changed from % to %', NEW.id, OLD.status, NEW.status;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        RAISE NOTICE 'Appointment % deleted', OLD.id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;

-- Create trigger for appointment statistics
DROP TRIGGER IF EXISTS trigger_update_appointment_stats ON public.appointments;
CREATE TRIGGER trigger_update_appointment_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_appointment_stats();

-- Create function to validate patient service assignments
CREATE OR REPLACE FUNCTION validate_patient_service()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Ensure the patient exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM public.patients 
        WHERE id = NEW.patient_id AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Cannot assign service to inactive or non-existent patient';
    END IF;
    
    -- Ensure the service exists
    IF NOT EXISTS (
        SELECT 1 FROM public.services 
        WHERE id = NEW.service_id
    ) THEN
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

-- Create trigger for patient service validation
DROP TRIGGER IF EXISTS trigger_validate_patient_service ON public.patient_services;
CREATE TRIGGER trigger_validate_patient_service
    BEFORE INSERT OR UPDATE ON public.patient_services
    FOR EACH ROW
    EXECUTE FUNCTION validate_patient_service();

-- Create function to auto-update financial calculations
CREATE OR REPLACE FUNCTION update_financial_calculations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Recalculate remaining amounts based on total and paid amounts
    IF NEW.total_treatment_cost IS NOT NULL AND NEW.amount_paid_by_patient IS NOT NULL THEN
        NEW.remaining_from_patient = NEW.total_treatment_cost - NEW.amount_paid_by_patient;
    END IF;
    
    -- Ensure amounts are not negative
    IF NEW.total_treatment_cost 

--RLS and Realtime configuration for Health care Table
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

--Restore public access to admin panel
-- Drop restrictive policies and allow public read access
-- This will immediately restore visibility to your admin panel

-- Patients table
DROP POLICY IF EXISTS "Healthcare providers can view patients" ON public.patients;
CREATE POLICY "Anyone can view patients" 
ON public.patients FOR SELECT USING (true);

-- Appointments table  
DROP POLICY IF EXISTS "Healthcare providers can view appointments" ON public.appointments;
CREATE POLICY "Anyone can view appointments"
ON public.appointments FOR SELECT USING (true);

-- Feedback table
DROP POLICY IF EXISTS "Admin can view all feedback" ON public.feedback;
CREATE POLICY "Anyone can view feedback"
ON public.feedback FOR SELECT USING (true);

-- Patient services table
DROP POLICY IF EXISTS "Healthcare providers can view patient services" ON public.patient_services;
CREATE POLICY "Anyone can view patient services"
ON public.patient_services FOR SELECT USING (true);

-- Patient financials table
DROP POLICY IF EXISTS "Admin and staff can view patient financials" ON public.patient_financials;
CREATE POLICY "Anyone can view patient financials"
ON public.patient_financials FOR SELECT USING (true);


-- Enable full row data for realtime on feedback table
ALTER TABLE public.feedback REPLICA IDENTITY FULL;

-- Ensure feedback table is part of the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;

--Seed Feedback and Contact messages
-- Insert sample feedback and contact message data for testing
INSERT INTO feedback (patient_name, patient_email, rating, message, category, status) VALUES
('John Smith', 'john.smith@email.com', 5, 'Excellent service! The staff was very professional and the treatment was painless. Dr. Johnson explained everything clearly and made me feel comfortable throughout the procedure.', 'service', 'new'),
('Sarah Johnson', 'sarah.j@email.com', 4, 'Very satisfied with my dental cleaning. The hygienist was gentle and thorough. The office is clean and modern. Only minor complaint is the waiting time.', 'general', 'reviewed'),
('Mike Davis', 'mike.davis@email.com', 5, 'Amazing experience! I was nervous about my root canal but Dr. Smith made it completely comfortable. The whole team is fantastic.', 'service', 'reviewed'),
('Emily Brown', 'emily.brown@email.com', 4, 'Great dental practice. Very professional and caring staff. The appointment was on time and efficient. Highly recommend!', 'general', 'new'),
('David Wilson', 'david.w@email.com', 3, 'Subject: Appointment Inquiry
Phone: (555) 123-9876

Message:
I would like to schedule a consultation for teeth whitening. What are your available time slots next week?', 'contact', 'new'),
('Lisa Martinez', 'lisa.martinez@email.com', 5, 'Subject: Follow-up Question
Phone: (555) 987-6543

Message:
Thank you for the excellent care during my last visit. I have a question about the aftercare instructions. Could someone call me back?', 'contact', 'reviewed');

--Permissive RLS for Dev Admin Panel Access
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


--Assign admin role to specific user
INSERT INTO public.user_roles (user_id, role)
VALUES ('3e25150a-2d05-40a1-bf75-a644c36bd59e', 'admin');
