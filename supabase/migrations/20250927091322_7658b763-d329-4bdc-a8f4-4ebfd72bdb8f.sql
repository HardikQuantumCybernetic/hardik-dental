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