import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Trash2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useSupabase";
import { useDoctors } from "@/hooks/useSupabaseExtended";
import AppointmentScheduling from "./AppointmentScheduling";

const AppointmentManagement = () => {
  const { toast } = useToast();
  const { appointments, loading, updateAppointment, deleteAppointment } = useAppointments();
  const { doctors } = useDoctors();
  const [open, setOpen] = useState(false);

  const handleStatusChange = async (appointmentId: string, newStatus: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show") => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });
      toast({
        title: "Success",
        description: `Appointment status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (window.confirm("Are you sure you want to delete this appointment? This action cannot be undone.")) {
      try {
        await deleteAppointment(appointmentId);
        toast({
          title: "Success",
          description: "Appointment deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete appointment",
          variant: "destructive"
        });
      }
    }
  };

  const handleSendWhatsApp = (appointment: any) => {
    let phone = appointment.patient_phone?.replace(/[\s\-\(\)]/g, '') || '';
    
    if (!phone) {
      toast({
        title: "Phone number missing",
        description: "No phone number available for this patient. Please update patient details.",
        variant: "destructive"
      });
      return;
    }

    // Ensure +91 prefix for Indian numbers
    if (!phone.startsWith('+')) {
      phone = phone.startsWith('91') ? `+${phone}` : `+91${phone}`;
    }

    const message = `🦷 *Dental Appointment Reminder*

Hello ${appointment.patient_name || 'Patient'},

Your appointment details:
📅 Date: ${appointment.appointment_date}
⏰ Time: ${appointment.appointment_time}
👨‍⚕️ Doctor: Dr. ${appointment.doctor}
🏥 Service: ${appointment.service_type}
📋 Status: ${appointment.status}
${appointment.notes ? `📝 Notes: ${appointment.notes}` : ''}

Please arrive 10 minutes before your scheduled time.

Thank you for choosing Hardik Dental!`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "Message prepared for sending via WhatsApp",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appointment Management</h2>
          <p className="text-dental-gray">Manage and track patient appointments ({appointments.length} total)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Calendar className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Fill in the details to create a new appointment.</DialogDescription>
            </DialogHeader>
            <AppointmentScheduling doctors={doctors} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {appointments.length === 0 ? (
        <Card className="border-dental-blue-light">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-dental-gray mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Appointments Found</h3>
            <p className="text-dental-gray">No appointments have been scheduled yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 max-h-[55vh] overflow-y-auto pr-2">
          {appointments.map((appointment) => (
            <Card 
              key={appointment.id} 
              className="border-dental-blue-light hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Header with patient info and status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Patient: {appointment.patient_name || `ID: ${appointment.patient_id?.slice(0, 8)}...`}
                      </h3>
                      <p className="text-dental-gray">{appointment.service_type}</p>
                    </div>

                    <Badge className={`${getStatusColor(appointment.status)} flex items-center space-x-1 w-fit`}>
                      {getStatusIcon(appointment.status)}
                      <span className="capitalize">{appointment.status}</span>
                    </Badge>
                  </div>
                  
                  {/* Appointment details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-dental-gray">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-dental-blue" />
                      <span>{appointment.appointment_date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-dental-blue" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-dental-blue" />
                      <span>Dr. {appointment.doctor}</span>
                    </div>
                  </div>
                  
                  {/* Phone number display */}
                  {appointment.patient_phone && (
                    <div className="flex items-center space-x-2 text-sm text-dental-gray">
                      <Phone className="w-4 h-4 text-dental-blue" />
                      <span>{appointment.patient_phone}</span>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {appointment.notes && (
                    <div className="p-3 bg-dental-blue-light rounded-lg">
                      <p className="text-sm text-dental-gray">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button
                          size="sm"
                          variant="dental"
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <>
                        <Button
                          size="sm"
                          variant="dental"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Reschedule
                      </Button>
                    )}
                    
                    {/* WhatsApp Button - Always visible */}
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleSendWhatsApp(appointment)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Send WhatsApp
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;