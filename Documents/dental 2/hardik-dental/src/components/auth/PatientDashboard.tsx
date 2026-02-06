import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Phone, Mail, Clock, FileText, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import DentalNavbar from "@/components/DentalNavbar";
import DentalFooter from "@/components/DentalFooter";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface PatientDashboardProps {
  user: any;
  onLogout: () => void;
}

const PatientDashboard = ({ user, onLogout }: PatientDashboardProps) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAppointments();
  }, [user]);

  const fetchUserAppointments = async () => {
    try {
      setLoading(true);
      
      const userEmail = user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress;
      
      if (!userEmail) {
        console.error('No email found for user');
        setLoading(false);
        return;
      }

      // First, check if patient exists in our database
      const { data: patients, error: patientError } = await supabase
        .from('patients')
        .select('id, name, email')
        .eq('email', userEmail)
        .limit(1);

      if (patientError) {
        console.error('Error fetching patient:', patientError);
        toast({
          title: "Error",
          description: "Failed to load patient information",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!patients || patients.length === 0) {
        // Patient doesn't exist, create them
        const newPatient = {
          name: user?.fullName || user?.firstName + ' ' + user?.lastName || 'Unknown',
          email: userEmail,
          phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
          date_of_birth: '1990-01-01', // Default date, should be updated by patient
          address: '',
          medical_history: '',
          insurance_info: '',
          status: 'active' as const
        };

        const { data: createdPatient, error: createError } = await supabase
          .from('patients')
          .insert([newPatient])
          .select()
          .single();

        if (createError) {
          console.error('Error creating patient:', createError);
          toast({
            title: "Error",
            description: "Failed to create patient profile",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log('Created new patient:', createdPatient);
      }

      // Now get appointments for this patient
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .in('patient_id', patients?.map(p => p.id) || [])
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } else {
        setAppointments(appointments || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // For Clerk, we just call the onLogout function
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      onLogout();
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) >= new Date() && apt.status === 'scheduled'
  );

  const pastAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) < new Date() || apt.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      
      <div className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-inter">
                Welcome, {user?.fullName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
              </h1>
              <p className="text-dental-gray mt-2">
                Manage your appointments and dental records
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <Card className="border-dental-blue-light">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-dental-blue" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-dental-gray" />
                  <span className="text-sm">{user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                {user?.phoneNumbers?.[0]?.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-dental-gray" />
                    <span className="text-sm">{user.phoneNumbers[0].phoneNumber}</span>
                  </div>
                )}
                <div className="pt-4">
                  <Button 
                    variant="dental" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/booking')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book New Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="lg:col-span-2 border-dental-blue-light">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-dental-blue" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSkeleton type="appointment" count={3} />
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-dental-blue-light/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{appointment.service_type}</h4>
                            <p className="text-sm text-dental-gray">Dr. {appointment.doctor}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-dental-gray" />
                                <span className="text-sm">{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-dental-gray" />
                                <span className="text-sm">{appointment.appointment_time}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {appointment.status}
                          </Badge>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-dental-gray mt-2 italic">
                            Notes: {appointment.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-dental-gray mx-auto mb-4" />
                    <p className="text-dental-gray">No upcoming appointments</p>
                    <Button 
                      variant="dental" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => navigate('/booking')}
                    >
                      Schedule Your First Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <Card className="lg:col-span-3 border-dental-blue-light">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-dental-blue" />
                    <span>Appointment History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pastAppointments.slice(0, 6).map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-foreground">{appointment.service_type}</h5>
                          <Badge 
                            variant={appointment.status === 'completed' ? 'default' : 'secondary'}
                            className={appointment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-dental-gray">Dr. {appointment.doctor}</p>
                        <p className="text-sm text-dental-gray">
                          {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                        </p>
                      </div>
                    ))}
                  </div>
                  {pastAppointments.length > 6 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" size="sm">
                        View All History
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <DentalFooter />
    </div>
  );
};

export default PatientDashboard;