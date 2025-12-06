import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Patient, Appointment, patientService, appointmentService } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const data = await patientService.getAll()
      setPatients(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients')
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'patient_id'>) => {
    try {
      const newPatient = await patientService.create(patient)
      setPatients(prev => [newPatient, ...prev])
      toast({
        title: "Success",
        description: "Patient added successfully"
      })
      return newPatient
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive"
      })
      throw err
    }
  }

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updatedPatient = await patientService.update(id, updates)
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p))
      toast({
        title: "Success",
        description: "Patient updated successfully"
      })
      return updatedPatient
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update patient",
        variant: "destructive"
      })
      throw err
    }
  }

  const deletePatient = async (id: string) => {
    try {
      await patientService.delete(id)
      setPatients(prev => prev.filter(p => p.id !== id))
      toast({
        title: "Success",
        description: "Patient deleted successfully"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive"
      })
      throw err
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  // Realtime updates for patients
  useEffect(() => {
    const channel = supabase
      .channel('patients_changes_in_hook')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'patients' },
        (payload) => {
          console.log('Patient inserted:', payload);
          setPatients(prev => [payload.new as Patient, ...prev]);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'patients' },
        (payload) => {
          console.log('Patient updated:', payload);
          setPatients(prev => prev.map(patient => 
            patient.id === payload.new.id ? payload.new as Patient : patient
          ));
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'patients' },
        (payload) => {
          console.log('Patient deleted:', payload);
          setPatients(prev => prev.filter(patient => patient.id !== payload.old.id));
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    patients,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient,
    refetch: fetchPatients
  }
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const data = await appointmentService.getAll()
      console.log('📅 Fetched appointments:', data) // Debug log
      setAppointments(data || [])
      setError(null)
    } catch (err) {
      console.error('❌ Error fetching appointments:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
    try {
      const newAppointment = await appointmentService.create(appointment)
      await fetchAppointments() // Refresh to get populated data
      toast({
        title: "Success",
        description: "Appointment scheduled successfully"
      })
      return newAppointment
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive"
      })
      throw err
    }
  }

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      await appointmentService.update(id, updates)
      await fetchAppointments() // Refresh to get updated data
      toast({
        title: "Success",
        description: "Appointment updated successfully"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive"
      })
      throw err
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      await appointmentService.delete(id)
      setAppointments(prev => prev.filter(a => a.id !== id))
      toast({
        title: "Success",
        description: "Appointment cancelled successfully"
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      })
      throw err
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Realtime updates for appointments
  useEffect(() => {
    const channel = supabase
      .channel('appointments_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Appointment inserted:', payload);
          fetchAppointments(); // Refetch to get populated data
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Appointment updated:', payload);
          fetchAppointments(); // Refetch to get populated data
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Appointment deleted:', payload);
          setAppointments(prev => prev.filter(appointment => appointment.id !== payload.old.id));
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  return {
    appointments,
    loading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments
  }
}

// Real-time subscriptions
export const useRealtimePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    const channel = supabase
      .channel('patients_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patients' },
        (payload) => {
          console.log('Patient change received:', payload)
          // Handle real-time updates
          if (payload.eventType === 'INSERT') {
            setPatients(prev => [payload.new as Patient, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setPatients(prev => prev.map(p => 
              p.id === payload.new.id ? payload.new as Patient : p
            ))
          } else if (payload.eventType === 'DELETE') {
            setPatients(prev => prev.filter(p => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return patients
}