import { supabase } from '@/integrations/supabase/client'

export { supabase }

// Additional types for new tables
export type Doctor = {
  id: string
  created_at: string
  name: string
  specialty: string | null
  email: string | null
  phone: string | null
  is_active: boolean
}

export type Feedback = {
  id: string
  created_at: string
  updated_at: string
  patient_name: string
  patient_email: string
  rating: number
  message: string
  category: string
  status: 'new' | 'reviewed'
  patient_id: string | null
}

export type Service = {
  id: string
  created_at: string
  name: string
  description: string | null
  default_cost: number
  category: string
}

export type PatientService = {
  id: string
  created_at: string
  updated_at: string
  patient_id: string
  service_id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  assigned_cost: number
  notes: string | null
  scheduled_date: string | null
  completed_date: string | null
  service_name?: string
  service_description?: string
}

export type PatientFinancial = {
  id: string
  created_at: string
  updated_at: string
  patient_id: string
  total_treatment_cost: number
  amount_paid_by_patient: number
  remaining_from_patient: number
  amount_due_to_doctor: number
  notes: string | null
}

// Database types for the dental practice
export type Patient = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  medical_history: string
  insurance_info: string
  status: 'active' | 'inactive'
  patient_id: string | null
}

export type Appointment = {
  id: string
  created_at: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  service_type: string
  doctor: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  notes: string
}

export type Treatment = {
  id: string
  created_at: string
  patient_id: string
  appointment_id: string
  treatment_type: string
  description: string
  cost: number
  status: 'planned' | 'in-progress' | 'completed'
}

// Helper functions for database operations
export const patientService = {
  async getAll() {
    console.log('🔍 Fetching patients from Supabase...')
    
    // Check authentication status
    const { data: authData } = await supabase.auth.getUser()
    console.log('🔐 Auth status:', authData?.user ? 'Authenticated' : 'Not authenticated')
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('📊 Patients query result:', { data, error, count: data?.length })
    
    if (error) {
      console.error('❌ Patient fetch error:', error)
      throw error
    }
    return data as Patient[]
  },

  async create(patient: Omit<Patient, 'id' | 'created_at' | 'patient_id'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single()
    
    if (error) throw error
    return data as Patient
  },

  async update(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Patient
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const appointmentService = {
  async getAll() {
    try {
      console.log('🔍 Fetching appointments from Supabase...')
      
      // Check authentication status
      const { data: authData } = await supabase.auth.getUser()
      console.log('🔐 Auth status for appointments:', authData?.user ? 'Authenticated' : 'Not authenticated')
      
      // Get appointments with patient data using a simpler approach
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
      
      console.log('📊 Appointments query result:', { appointments, appointmentsError, count: appointments?.length })
      
      if (appointmentsError) {
        console.error('Appointments error:', appointmentsError)
        throw appointmentsError
      }

      // Get patient data separately and merge
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, name, email, phone')
      
      if (patientsError) {
        console.error('Patients error:', patientsError)
        throw patientsError
      }

      // Merge appointment and patient data
      const appointmentsWithPatients = appointments?.map(appointment => {
        const patient = patients?.find(p => p.id === appointment.patient_id)
        return {
          ...appointment,
          patient_name: patient?.name || 'Unknown Patient',
          patient_email: patient?.email,
          patient_phone: patient?.phone
        }
      }) || []

      console.log('Merged appointments data:', appointmentsWithPatients)
      return appointmentsWithPatients
    } catch (error) {
      console.error('Error in appointmentService.getAll:', error)
      throw error
    }
  },

  async create(appointment: Omit<Appointment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single()
    
    if (error) throw error
    return data as Appointment
  },

  async update(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Appointment
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Feedback service
export const feedbackService = {
  async getAll() {
    console.log('🔍 Fetching feedback from Supabase...')
    
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('📊 Feedback query result:', { data, error, count: data?.length })
    
    if (error) {
      console.error('❌ Feedback fetch error:', error)
      throw error
    }
    return data as Feedback[]
  },

  async create(feedback: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single()
    
    if (error) throw error
    return data as Feedback
  },

  async update(id: string, updates: Partial<Feedback>) {
    const { data, error } = await supabase
      .from('feedback')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Feedback
  }
}

// Doctor service
export const doctorService = {
  async getAll() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Doctor[]
  }
}

// Service management
export const serviceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Service[]
  }
}

// Patient services (todo list)
export const patientServiceService = {
  async getByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('patient_services')
      .select(`
        *,
        service:services(name, description)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data.map(item => ({
      ...item,
      service_name: item.service?.name,
      service_description: item.service?.description
    })) as PatientService[]
  },

  async create(patientService: Omit<PatientService, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patient_services')
      .insert([patientService])
      .select()
      .single()
    
    if (error) throw error
    return data as PatientService
  },

  async update(id: string, updates: Partial<PatientService>) {
    const { data, error } = await supabase
      .from('patient_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as PatientService
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('patient_services')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Patient financials service
export const patientFinancialService = {
  async getByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('patient_financials')
      .select('*')
      .eq('patient_id', patientId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as PatientFinancial | null
  },

  async create(financials: Omit<PatientFinancial, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patient_financials')
      .insert([financials])
      .select()
      .single()
    
    if (error) throw error
    return data as PatientFinancial
  },

  async update(patientId: string, updates: Partial<PatientFinancial>) {
    const { data, error } = await supabase
      .from('patient_financials')
      .update(updates)
      .eq('patient_id', patientId)
      .select()
      .single()
    
    if (error) throw error
    return data as PatientFinancial
  },

  async upsert(financials: Omit<PatientFinancial, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patient_financials')
      .upsert([financials], { onConflict: 'patient_id' })
      .select()
      .single()
    
    if (error) throw error
    return data as PatientFinancial
  }
}