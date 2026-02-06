import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppointments, usePatients } from "@/hooks/useSupabase";
import { Doctor } from "@/lib/supabase";

interface AppointmentSchedulingProps {
  doctors?: Doctor[];
  onClose?: () => void;
}

const AppointmentScheduling = ({ doctors = [], onClose }: AppointmentSchedulingProps) => {
  const { toast } = useToast();
  const { addAppointment } = useAppointments();
  const { patients } = usePatients();
  const [formData, setFormData] = useState<{
    patient_id: string;
    appointment_date: string;
    appointment_time: string;
    service_type: string;
    doctor: string;
    notes: string;
    status: 'scheduled' | 'confirmed';
  }>({
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    service_type: '',
    doctor: '',
    notes: '',
    status: 'scheduled'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    'Regular Cleaning',
    'Cavity Filling',
    'Root Canal',
    'Crown Installation',
    'Tooth Extraction',
    'Teeth Whitening',
    'Orthodontic Consultation',
    'Emergency Care',
    'Cosmetic Consultation',
    'Dental Implant',
    'Gum Treatment',
    'Pediatric Checkup'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.patient_id || !formData.appointment_date || 
          !formData.appointment_time || !formData.service_type || !formData.doctor) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const appointmentData = {
        patient_id: formData.patient_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        service_type: formData.service_type,
        doctor: formData.doctor,
        notes: formData.notes,
        status: formData.status
      };

      await addAppointment(appointmentData);
      
      // Reset form
      setFormData({
        patient_id: "",
        appointment_date: "",
        appointment_time: "",
        service_type: "",
        doctor: "",
        notes: "",
        status: "scheduled"
      });

      // Close dialog if onClose is provided
      onClose?.();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.patient_id && formData.appointment_date && 
                     formData.appointment_time && formData.service_type && formData.doctor;

  return (
    <Card className="border-dental-blue-light">
      <CardHeader>
        <CardTitle className="text-dental-blue flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Schedule New Appointment</span>
        </CardTitle>
        <CardDescription>Create a new appointment for a patient with doctor selection</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patient_id" className="text-dental-blue font-medium">
                Patient <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.patient_id} 
                onValueChange={(value) => setFormData({...formData, patient_id: value})}
              >
                <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.patient_id || 'No ID'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor" className="text-dental-blue font-medium">
                Assigned Doctor <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.doctor} 
                onValueChange={(value) => setFormData({...formData, doctor: value})}
              >
                <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.name}>
                      {doctor.name} - {doctor.specialty || 'General Dentistry'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="appointment_date" className="text-dental-blue font-medium">
                Appointment Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="border-dental-blue-light focus:border-dental-blue"
                required
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="appointment_time" className="text-dental-blue font-medium">
                Appointment Time <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.appointment_time} 
                onValueChange={(value) => setFormData({...formData, appointment_time: value})}
              >
                <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time + ':00'}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Service Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="service_type" className="text-dental-blue font-medium">
              Service Type <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.service_type} 
              onValueChange={(value) => setFormData({...formData, service_type: value})}
            >
              <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-dental-blue font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any special instructions or notes for this appointment..."
              className="border-dental-blue-light focus:border-dental-blue min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-dental-blue font-medium">
              Initial Status
            </Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'scheduled' | 'confirmed') => setFormData({...formData, status: value})}
            >
              <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              variant="dental" 
              className="flex-1"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </>
              )}
            </Button>
            {onClose && (
              <Button 
                type="button" 
                variant="dental-outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Quick Info */}
        <div className="mt-6 p-4 bg-dental-blue-light rounded-lg">
          <h4 className="font-medium text-dental-blue mb-2">Quick Info:</h4>
          <ul className="text-sm text-dental-gray space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Appointments can be scheduled from today onwards</li>
            <li>• Doctor selection ensures proper resource allocation</li>
            <li>• Real-time updates will notify relevant staff</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentScheduling;