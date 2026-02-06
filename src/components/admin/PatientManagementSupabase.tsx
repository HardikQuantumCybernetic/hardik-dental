import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Shield,
  Loader2,
  Download,
  DollarSign,
  ClipboardList,
  MessageCircle,
  Clock,
  Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatients } from "@/hooks/useSupabase";
import { Patient, Appointment } from "@/lib/supabase";
import PatientServicesManager from "./PatientServicesManager";
import PatientFinancialManager from "./PatientFinancialManager";
import { generatePatientPDF } from "@/utils/pdfGenerator";
import { usePatientServices, usePatientFinancials, useAllPatientAppointments } from "@/hooks/useSupabaseExtended";
import EnhancedPatientPDFGenerator from "./EnhancedPatientPDFGenerator";

const PatientManagementSupabase = () => {
  const { toast } = useToast();
  const { patients, loading, addPatient, updatePatient, deletePatient } = usePatients();
  const { appointmentsByPatient, loading: appointmentsLoading } = useAllPatientAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    address: string;
    medical_history: string;
    insurance_info: string;
    status: "active" | "inactive";
  }>({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    medical_history: "",
    insurance_info: "",
    status: "active"
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
        setEditingPatient(null);
      } else {
        await addPatient(formData);
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        medical_history: "",
        insurance_info: "",
        status: "active"
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.date_of_birth,
      address: patient.address,
      medical_history: patient.medical_history,
      insurance_info: patient.insurance_info,
      status: patient.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      await deletePatient(id);
    }
  };

  const handleCancel = () => {
    setEditingPatient(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
      medical_history: "",
      insurance_info: "",
      status: "active"
    });
    setShowAddForm(false);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleDownloadPDF = async (patient: Patient) => {
    try {
      // Use a simpler approach - just generate PDF with patient data for now
      // In a real implementation, you'd fetch the related data properly
      generatePatientPDF({
        patient,
        services: [], // TODO: Fetch actual services when needed
        financials: null // TODO: Fetch actual financials when needed
      });

      toast({
        title: "PDF Generated",
        description: `Patient report for ${patient.name} has been downloaded.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = (patient: Patient) => {
    // Get patient's appointments (both upcoming and past)
    const patientAppointments = appointmentsByPatient[patient.id];
    const upcomingAppointment = patientAppointments?.upcoming?.[0];
    const lastAppointment = patientAppointments?.past?.[0];
    
    // Format appointment info for message
    let appointmentInfo = '';
    
    if (upcomingAppointment) {
      const formattedDate = new Date(upcomingAppointment.appointment_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      appointmentInfo += `
📅 *Upcoming Appointment*
🗓️ *Date:* ${formattedDate}
⏰ *Time:* ${upcomingAppointment.appointment_time}
👨‍⚕️ *Doctor:* Dr. ${upcomingAppointment.doctor}
🦷 *Service:* ${upcomingAppointment.service_type}
📋 *Status:* ${upcomingAppointment.status}
${upcomingAppointment.notes ? `📝 *Notes:* ${upcomingAppointment.notes}` : ''}`;
    }

    if (lastAppointment) {
      const formattedDate = new Date(lastAppointment.appointment_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      appointmentInfo += `

📜 *Last Appointment*
🗓️ *Date:* ${formattedDate}
⏰ *Time:* ${lastAppointment.appointment_time}
👨‍⚕️ *Doctor:* Dr. ${lastAppointment.doctor}
🦷 *Service:* ${lastAppointment.service_type}
📋 *Status:* ${lastAppointment.status}
${lastAppointment.notes ? `📝 *Notes:* ${lastAppointment.notes}` : ''}`;
    }

    // Format patient data for WhatsApp message
    const message = `
*Patient Information*

👤 *Name:* ${patient.name}
📧 *Email:* ${patient.email}
📞 *Phone:* ${patient.phone}
🎂 *Date of Birth:* ${patient.date_of_birth}
${patient.patient_id ? `🆔 *Patient ID:* ${patient.patient_id}` : ''}
${patient.address ? `📍 *Address:* ${patient.address}` : ''}
${patient.insurance_info ? `🛡️ *Insurance:* ${patient.insurance_info}` : ''}
${patient.medical_history ? `📋 *Medical History:* ${patient.medical_history}` : ''}
✅ *Status:* ${patient.status}
${appointmentInfo}
    `.trim();

    // Remove special characters from phone and ensure +91 prefix for Indian numbers
    let cleanPhone = patient.phone.replace(/[^\d+]/g, '');
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`;
    }
    
    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Opening WhatsApp",
      description: `Sending message to ${patient.name}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-dental-blue" />
        <span className="ml-2 text-dental-gray">Loading patients...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Users className="w-6 h-6 text-dental-blue" />
            <span>Patient Management</span>
          </h2>
          <p className="text-dental-gray">Manage patient records with Supabase integration</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-dental-gray" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-dental-blue-light focus:border-dental-blue"
            />
          </div>
          
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button variant="dental" onClick={() => setShowAddForm(true)} className="w-full sm:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                <DialogDescription>
                  {editingPatient ? 'Update patient information' : 'Enter patient details to add them to the system'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                </div>
                
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dental-blue-light bg-muted text-muted-foreground text-sm">
                        +91
                      </span>
                      <Input
                        id="phone"
                        value={formData.phone.replace(/^\+91/, '')}
                        onChange={(e) => setFormData({...formData, phone: `+91${e.target.value.replace(/^\+91/, '')}`})}
                        required
                        placeholder="9876543210"
                        className="border-dental-blue-light focus:border-dental-blue rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      required
                      className="border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insurance_info">Insurance Information</Label>
                  <Input
                    id="insurance_info"
                    value={formData.insurance_info}
                    onChange={(e) => setFormData({...formData, insurance_info: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medical_history">Medical History</Label>
                  <Textarea
                    id="medical_history"
                    value={formData.medical_history}
                    onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" variant="dental" className="flex-1">
                    {editingPatient ? 'Update Patient' : 'Add Patient'}
                  </Button>
                  <Button type="button" variant="dental-outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-dental-blue">{patients.length}</p>
              <p className="text-dental-gray text-sm">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {patients.filter(p => p.status === 'active').length}
              </p>
              <p className="text-dental-gray text-sm">Active Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-dental-mint">{filteredPatients.length}</p>
              <p className="text-dental-gray text-sm">Search Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card className="border-dental-blue-light">
        <CardHeader>
          <CardTitle className="text-dental-blue">Patient Records</CardTitle>
          <CardDescription>Complete list of all registered patients from Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="border-dental-blue-light">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-dental-blue-light rounded-full">
                            <Users className="w-4 h-4 text-dental-blue" />
                          </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{patient.name}</h3>
                          <p className="text-sm text-dental-gray">
                            ID: {patient.patient_id || 'Not assigned'} • Born: {patient.date_of_birth}
                          </p>
                        </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-dental-gray" />
                            <span className="text-dental-gray">{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-dental-gray" />
                            <span className="text-dental-gray">{patient.phone}</span>
                          </div>
                          {patient.address && (
                            <div className="flex items-center space-x-2 md:col-span-2">
                              <MapPin className="w-4 h-4 text-dental-gray" />
                              <span className="text-dental-gray">{patient.address}</span>
                            </div>
                          )}
                          {patient.insurance_info && (
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-dental-gray" />
                              <span className="text-dental-gray">{patient.insurance_info}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Upcoming Appointment Info */}
                        {appointmentsByPatient[patient.id]?.upcoming?.[0] && (
                          <div className="mt-3 p-3 bg-dental-blue-light/50 rounded-lg border border-dental-blue/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-dental-blue" />
                              <span className="text-sm font-medium text-dental-blue">Upcoming Appointment</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5 text-dental-gray" />
                                <span className="text-foreground font-medium">
                                  {new Date(appointmentsByPatient[patient.id].upcoming[0].appointment_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3.5 h-3.5 text-dental-gray" />
                                <span className="text-foreground font-medium">
                                  {appointmentsByPatient[patient.id].upcoming[0].appointment_time}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Stethoscope className="w-3.5 h-3.5 text-dental-gray" />
                                <span className="text-foreground font-medium">
                                  Dr. {appointmentsByPatient[patient.id].upcoming[0].doctor}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <ClipboardList className="w-3.5 h-3.5 text-dental-gray" />
                                <span className="text-dental-gray">
                                  {appointmentsByPatient[patient.id].upcoming[0].service_type}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Last/Past Appointment Info */}
                        {appointmentsByPatient[patient.id]?.past?.[0] && (
                          <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-dental-gray" />
                              <span className="text-sm font-medium text-dental-gray">Last Appointment</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5 text-dental-gray" />
                                <span className="text-muted-foreground">
                                  {new Date(appointmentsByPatient[patient.id].past[0].appointment_date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3.5 h-3.5 text-dental-gray" />
                                <span className="text-muted-foreground">
                                  {appointmentsByPatient[patient.id].past[0].appointment_time}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Stethoscope className="w-3.5 h-3.5 text-dental-gray" />
                                <span className="text-muted-foreground">
                                  Dr. {appointmentsByPatient[patient.id].past[0].doctor}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {appointmentsByPatient[patient.id].past[0].status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {patient.medical_history && (
                          <div className="mt-2">
                            <div className="flex items-start space-x-2">
                              <FileText className="w-4 h-4 text-dental-gray mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Medical History:</p>
                                <p className="text-sm text-dental-gray">{patient.medical_history}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-2">
                        <Badge variant={patient.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                          {patient.status}
                        </Badge>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPatient(patient)}
                            className="text-dental-blue hover:bg-dental-blue-light"
                            title="View Details"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(patient)}
                            className="text-dental-blue hover:bg-dental-blue-light"
                            title="Edit Patient"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendWhatsApp(patient)}
                            className="text-success hover:bg-success/10"
                            title="Send WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <EnhancedPatientPDFGenerator patient={patient} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(patient.id)}
                            className="text-destructive hover:bg-destructive/10"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-dental-gray mx-auto mb-4" />
              <p className="text-dental-gray">No patients found. Add your first patient to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Modal */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-dental-blue" />
              <span>{selectedPatient?.name}</span>
              <Badge variant={selectedPatient?.status === 'active' ? 'default' : 'secondary'}>
                {selectedPatient?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Patient ID: {selectedPatient?.patient_id || 'Not assigned'} • Member since {selectedPatient ? new Date(selectedPatient.created_at).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 overflow-y-auto max-h-[60vh]">
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-dental-blue-light">
                      <CardHeader>
                        <CardTitle className="text-sm text-dental-blue">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-dental-gray" />
                          <span>{selectedPatient.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-dental-gray" />
                          <span>{selectedPatient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-dental-gray" />
                          <span>Born: {selectedPatient.date_of_birth}</span>
                        </div>
                        {selectedPatient.address && (
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-dental-gray mt-0.5" />
                            <span>{selectedPatient.address}</span>
                          </div>
                        )}
                        {selectedPatient.insurance_info && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-dental-gray" />
                            <span>{selectedPatient.insurance_info}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {selectedPatient.medical_history && (
                      <Card className="border-dental-blue-light">
                        <CardHeader>
                          <CardTitle className="text-sm text-dental-blue">Medical History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-dental-gray">{selectedPatient.medical_history}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="services">
                  <PatientServicesManager patientId={selectedPatient.id} />
                </TabsContent>
                
                <TabsContent value="financials">
                  <PatientFinancialManager patientId={selectedPatient.id} />
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EnhancedPatientPDFGenerator patient={selectedPatient} />
                    <Button
                      variant="dental-outline"
                      onClick={() => {
                        handleEdit(selectedPatient);
                        setSelectedPatient(null);
                      }}
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Patient Information
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagementSupabase;