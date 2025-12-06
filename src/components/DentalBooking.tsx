import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/ui/validated-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuickInfoCard from "@/components/common/QuickInfoCard";

const DentalBooking = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState({
    firstName: { value: '', isValid: false },
    lastName: { value: '', isValid: false },
    email: { value: '', isValid: false },
    phone: { value: '', isValid: false },
    date: '',
    time: '',
    service: '',
    doctor: '',
    message: ''
  });
  const { toast } = useToast();

  const updateFormField = (field: string, value: string, isValid: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: { value, isValid }
    }));
  };

  const updateFormValue = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFieldsValid = formData.firstName.isValid && 
                               formData.lastName.isValid && 
                               formData.email.isValid && 
                               formData.phone.isValid &&
                               formData.date && 
                               formData.time && 
                               formData.service &&
                               formData.doctor;

    if (!requiredFieldsValid) {
      toast({
        title: "Please complete all required fields",
        description: "Make sure all required fields are filled out correctly.",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, create or get the patient
      let patientId;
      
      // Check if patient exists
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('email', formData.email.value)
        .single();
      
      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        // Create new patient
        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert({
            name: `${formData.firstName.value} ${formData.lastName.value}`,
            email: formData.email.value,
            phone: formData.phone.value,
            date_of_birth: '1990-01-01', // Default value, should be collected in form
            address: '', // Default value, should be collected in form
            medical_history: formData.message || '',
            insurance_info: '',
            status: 'active'
          })
          .select()
          .single();
        
        if (patientError) throw patientError;
        patientId = newPatient.id;
      }
      
      // Create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          appointment_date: formData.date,
          appointment_time: formData.time,
          service_type: formData.service,
          doctor: formData.doctor,
          status: 'scheduled',
          notes: formData.message || ''
        });
      
      if (appointmentError) throw appointmentError;
      
      setIsSubmitted(true);
      toast({
        title: "Appointment Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your appointment.",
      });
      
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 30; // 09:00 to 17:00 in 30-min steps
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    const labelHours = ((hours + 11) % 12) + 1; // 0->12, 13->1, etc.
    const ampm = hours < 12 ? 'AM' : 'PM';
    const label = `${labelHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    return { value, label };
  });

  const doctors = [
    "Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Davis", "Dr. Miller"
  ];

  const services = [
    "General Checkup", "Teeth Cleaning", "Cosmetic Consultation", "Orthodontic Consultation",
    "Emergency Care", "Oral Surgery Consultation", "Pediatric Checkup", "Other"
  ];

  const bookingInfoItems = [
    { text: "All fields with * are required for processing", icon: "alert" as const },
    { text: "Appointments can be scheduled from today onwards", icon: "clock" as const },
    { text: "Doctor selection ensures proper resource allocation", icon: "users" as const },
    { text: "Real-time updates will notify relevant staff", icon: "info" as const },
    { text: "Confirmation will be sent via email and SMS", icon: "check" as const }
  ];

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-dental-card border-dental-blue-light animate-scale-in">
            <CardContent className="text-center p-12">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4 font-inter">
                Appointment Request Received!
              </h3>
              <p className="text-dental-gray mb-8 text-lg">
                Thank you for choosing SmileCare Dental. Our team will contact you within 24 hours to confirm your appointment details.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left bg-dental-blue-light rounded-xl p-6">
                <div>
                  <h4 className="font-semibold text-dental-blue mb-2">What's Next?</h4>
                  <ul className="space-y-1 text-dental-gray">
                    <li>• Confirmation call within 24 hours</li>
                    <li>• Pre-appointment instructions via email</li>
                    <li>• Reminder call 1 day before</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-dental-blue mb-2">Need Immediate Help?</h4>
                  <ul className="space-y-1 text-dental-gray">
                    <li>• Call: (555) 123-4567</li>
                    <li>• Emergency: (555) 123-4568</li>
                    <li>• Email: info@smilecare.com</li>
                  </ul>
                </div>
              </div>
              <Button 
                variant="dental" 
                size="lg" 
                className="mt-8 font-inter"
                onClick={() => setIsSubmitted(false)}
              >
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-inter">
            Book Your 
            <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent"> Appointment</span>
          </h2>
          <p className="text-lg text-dental-gray max-w-2xl mx-auto">
            Schedule your visit with our expert dental team. We offer flexible scheduling 
            to accommodate your busy lifestyle.
          </p>
        </div>

        {/* Quick Info Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <QuickInfoCard 
            title="Appointment Guidelines" 
            items={bookingInfoItems}
          />
        </div>

        <Card className="shadow-dental-card border-dental-blue-light animate-scale-in">
          <CardHeader className="text-center bg-gradient-to-r from-dental-blue to-dental-mint text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold font-inter flex items-center justify-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>Schedule Your Visit</span>
            </CardTitle>
            <CardDescription className="text-dental-blue-light">
              Fill out the form below and we'll contact you to confirm your appointment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <ValidatedInput
                  id="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  validation={{ type: 'name', required: true, minLength: 2 }}
                  onValueChange={(value, isValid) => updateFormField('firstName', value, isValid)}
                  className="border-dental-blue-light focus:border-dental-blue"
                />
                <ValidatedInput
                  id="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  validation={{ type: 'name', required: true, minLength: 2 }}
                  onValueChange={(value, isValid) => updateFormField('lastName', value, isValid)}
                  className="border-dental-blue-light focus:border-dental-blue"
                />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <ValidatedInput
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  validation={{ type: 'email', required: true }}
                  onValueChange={(value, isValid) => updateFormField('email', value, isValid)}
                  className="border-dental-blue-light focus:border-dental-blue"
                />
                <ValidatedInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  validation={{ type: 'phone', required: true, minLength: 10 }}
                  onValueChange={(value, isValid) => updateFormField('phone', value, isValid)}
                  className="border-dental-blue-light focus:border-dental-blue"
                />
              </div>

              {/* Appointment Details */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-dental-blue font-medium flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Preferred Date</span>
                  </Label>
                  <ValidatedInput 
                    id="date" 
                    type="date" 
                    validation={{ type: 'text', required: true }}
                    onValueChange={(value) => updateFormValue('date', value)}
                    className="border-dental-blue-light focus:border-dental-blue"
                    showValidationIcons={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-dental-blue font-medium flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Preferred Time</span>
                  </Label>
                  <Select required onValueChange={(value) => updateFormValue('time', value)}>
                    <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-dental-blue font-medium">
                    Service Needed
                  </Label>
                  <Select required onValueChange={(value) => updateFormValue('service', value)}>
                    <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor" className="text-dental-blue font-medium">
                    Preferred Doctor
                  </Label>
                  <Select required onValueChange={(value) => updateFormValue('doctor', value)}>
                    <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                      <SelectItem value="manual">Other (specify in notes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-dental-blue font-medium flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Additional Information (Optional)</span>
                </Label>
                <Textarea 
                  id="message" 
                  className="border-dental-blue-light focus:border-dental-blue"
                  placeholder="Please let us know if you have any specific concerns, preferences, or if this is your first visit..."
                  rows={4}
                  onChange={(e) => updateFormValue('message', e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button type="submit" variant="dental" size="xl" className="font-inter w-full md:w-auto">
                  <Calendar className="w-5 h-5" />
                  Request Appointment
                </Button>
                <p className="text-sm text-dental-gray mt-4">
                  We'll contact you within 24 hours to confirm your appointment
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center border-dental-blue-light">
            <CardContent className="p-6">
              <Phone className="w-8 h-8 text-dental-blue mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Call Us</h4>
              <p className="text-dental-gray">(555) 123-4567</p>
            </CardContent>
          </Card>
          <Card className="text-center border-dental-blue-light">
            <CardContent className="p-6">
              <Mail className="w-8 h-8 text-dental-mint mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Email Us</h4>
              <p className="text-dental-gray">info@smilecare.com</p>
            </CardContent>
          </Card>
          <Card className="text-center border-dental-blue-light">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 text-dental-blue mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Hours</h4>
              <p className="text-dental-gray">Mon-Fri: 8AM-6PM</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DentalBooking;