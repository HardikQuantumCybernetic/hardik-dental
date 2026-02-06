-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql' 
SET search_path = '';

-- Add security definer for better security practices
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER;