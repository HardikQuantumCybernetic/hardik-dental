import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { 
  Feedback, 
  Doctor, 
  Service, 
  PatientService, 
  PatientFinancial,
  Appointment,
  feedbackService,
  doctorService,
  serviceService,
  patientServiceService,
  patientFinancialService
} from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

// Feedback hook with real-time updates
export const useFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const data = await feedbackService.getAll()
      setFeedback(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback')
      toast({
        title: "Error",
        description: "Failed to load feedback",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addFeedback = async (feedbackData: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newFeedback = await feedbackService.create(feedbackData)
      setFeedback(prev => [newFeedback, ...prev])
      toast({
        title: "Success",
        description: "Feedback added successfully"
      })
      return newFeedback
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add feedback",
        variant: "destructive"
      })
      throw err
    }
  }

  const updateFeedback = async (id: string, updates: Partial<Feedback>) => {
    try {
      const updatedFeedback = await feedbackService.update(id, updates)
      setFeedback(prev => prev.map(f => f.id === id ? updatedFeedback : f))
      toast({
        title: "Success",
        description: "Feedback updated successfully"
      })
      return updatedFeedback
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive"
      })
      throw err
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  // Real-time updates for feedback
  useEffect(() => {
    const channel = supabase
      .channel('feedback_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'feedback' },
        (payload) => {
          console.log('Feedback inserted:', payload);
          setFeedback(prev => [payload.new as Feedback, ...prev]);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'feedback' },
        (payload) => {
          console.log('Feedback updated:', payload);
          setFeedback(prev => prev.map(item => 
            item.id === payload.new.id ? payload.new as Feedback : item
          ));
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    feedback,
    loading,
    error,
    addFeedback,
    updateFeedback,
    refetch: fetchFeedback
  }
}

// Doctors hook
export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const data = await doctorService.getAll()
      setDoctors(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors
  }
}

// Services hook
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await serviceService.getAll()
      setServices(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  }
}

// Patient services hook (todo list)
export const usePatientServices = (patientId?: string) => {
  const [patientServices, setPatientServices] = useState<PatientService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPatientServices = async () => {
    if (!patientId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await patientServiceService.getByPatientId(patientId)
      setPatientServices(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patient services')
    } finally {
      setLoading(false)
    }
  }

  const addPatientService = async (serviceData: Omit<PatientService, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newService = await patientServiceService.create(serviceData)
      setPatientServices(prev => [newService, ...prev])
      toast({
        title: "Success",
        description: "Service added to patient successfully"
      })
      return newService
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive"
      })
      throw err
    }
  }

  const updatePatientService = async (id: string, updates: Partial<PatientService>) => {
    try {
      const updatedService = await patientServiceService.update(id, updates)
      setPatientServices(prev => prev.map(s => s.id === id ? updatedService : s))
      toast({
        title: "Success",
        description: "Service updated successfully"
      })
      return updatedService
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive"
      })
      throw err
    }
  }

  const deletePatientService = async (id: string) => {
    try {
      await patientServiceService.delete(id)
      setPatientServices(prev => prev.filter(s => s.id !== id))
      toast({
        title: "Success",
        description: "Service removed successfully"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove service",
        variant: "destructive"
      })
      throw err
    }
  }

  useEffect(() => {
    fetchPatientServices()
  }, [patientId])

  return {
    patientServices,
    loading,
    error,
    addPatientService,
    updatePatientService,
    deletePatientService,
    refetch: fetchPatientServices
  }
}

// Patient financials hook
export const usePatientFinancials = (patientId?: string) => {
  const [financials, setFinancials] = useState<PatientFinancial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchFinancials = async () => {
    if (!patientId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await patientFinancialService.getByPatientId(patientId)
      setFinancials(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial data')
    } finally {
      setLoading(false)
    }
  }

  const updateFinancials = async (updates: Partial<PatientFinancial>) => {
    if (!patientId) return

    try {
      const updatedFinancials = financials 
        ? await patientFinancialService.update(patientId, updates)
        : await patientFinancialService.create({ patient_id: patientId, ...updates } as Omit<PatientFinancial, 'id' | 'created_at' | 'updated_at'>)
      
      setFinancials(updatedFinancials)
      toast({
        title: "Success",
        description: "Financial information updated successfully"
      })
      return updatedFinancials
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update financial information",
        variant: "destructive"
      })
      throw err
    }
  }

  useEffect(() => {
    fetchFinancials()
  }, [patientId])

  return {
    financials,
    loading,
    error,
    updateFinancials,
    refetch: fetchFinancials
  }
}

// Patient appointments hook - fetches upcoming appointments for a patient
export const usePatientAppointments = (patientId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = async () => {
    if (!patientId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      if (fetchError) throw fetchError
      setAppointments(data as Appointment[] || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [patientId])

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments
  }
}

// Bulk fetch all patient appointments - for the patient list view (includes past and future)
export const useAllPatientAppointments = () => {
  const [appointmentsByPatient, setAppointmentsByPatient] = useState<Record<string, { upcoming: Appointment[], past: Appointment[] }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllAppointments = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch ALL appointments (not just upcoming)
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false })

      if (fetchError) throw fetchError

      // Group appointments by patient_id, separating upcoming and past
      const grouped: Record<string, { upcoming: Appointment[], past: Appointment[] }> = {}
      ;(data as Appointment[] || []).forEach(apt => {
        if (apt.patient_id) {
          if (!grouped[apt.patient_id]) {
            grouped[apt.patient_id] = { upcoming: [], past: [] }
          }
          
          // Check if appointment is upcoming or past
          const isUpcoming = apt.appointment_date >= today && 
            (apt.status === 'scheduled' || apt.status === 'confirmed')
          
          if (isUpcoming) {
            grouped[apt.patient_id].upcoming.push(apt)
          } else {
            grouped[apt.patient_id].past.push(apt)
          }
        }
      })

      // Sort upcoming appointments by date ascending (nearest first)
      Object.values(grouped).forEach(patientAppts => {
        patientAppts.upcoming.sort((a, b) => {
          const dateA = `${a.appointment_date}T${a.appointment_time}`
          const dateB = `${b.appointment_date}T${b.appointment_time}`
          return dateA.localeCompare(dateB)
        })
        // Past appointments already sorted by date descending (most recent first)
      })

      setAppointmentsByPatient(grouped)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllAppointments()
  }, [])

  return {
    appointmentsByPatient,
    loading,
    error,
    refetch: fetchAllAppointments
  }
}