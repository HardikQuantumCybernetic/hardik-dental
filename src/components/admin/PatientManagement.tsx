
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  User,
  Phone,
  Mail,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Calendar,
  FileText,
  Download,
  FileUser
} from "lucide-react";
import { downloadCSV, downloadExcel, generatePatientCV, downloadPDF } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";

// Mock patient data - would come from database
const mockPatients = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main St, City, State",
    lastVisit: "2024-01-10",
    nextAppointment: "2024-01-25",
    status: "active",
    insurance: "Delta Dental"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 987-6543",
    dateOfBirth: "1992-03-22",
    address: "456 Oak Ave, City, State",
    lastVisit: "2024-01-08",
    nextAppointment: "2024-01-30",
    status: "active",
    insurance: "Blue Cross"
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1978-11-08",
    address: "789 Pine Rd, City, State",
    lastVisit: "2023-12-15",
    nextAppointment: null,
    status: "inactive",
    insurance: "Aetna"
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.brown@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1990-09-12",
    address: "321 Elm St, City, State",
    lastVisit: "2024-01-05",
    nextAppointment: "2024-02-01",
    status: "active",
    insurance: "MetLife"
  }
];

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": 
        return "text-success bg-success/10";
      case "inactive": 
        return "text-dental-gray bg-dental-gray/10";
      default: 
        return "text-dental-gray bg-dental-gray/10";
    }
  };

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient => {
      const matchesSearch = searchTerm === "" || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''));
      
      const matchesFilter = filterStatus === "all" || patient.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus]);

  const handleAddPatient = () => {
    // Show doctor selection form
    const doctors = [
      "Dr. Smith - General Dentistry",
      "Dr. Johnson - Orthodontics", 
      "Dr. Brown - Oral Surgery",
      "Dr. Davis - Pediatric Dentistry",
      "Dr. Wilson - Endodontics"
    ];
    
    const doctorList = doctors.join('\n');
    const selectedDoctor = prompt(`Select a doctor for the new patient:\n\n${doctorList}\n\nOr enter a custom doctor name:`);
    
    if (selectedDoctor) {
      toast({
        title: "Patient Assignment",
        description: `New patient would be assigned to: ${selectedDoctor}`,
      });
    }
  };

  const handleViewPatient = (patientId: number) => {
    console.log(`View patient ${patientId} functionality would be implemented here`);
  };

  const handleEditPatient = (patientId: number) => {
    console.log(`Edit patient ${patientId} functionality would be implemented here`);
  };

  const handleScheduleAppointment = (patientId: number) => {
    console.log(`Schedule appointment for patient ${patientId} functionality would be implemented here`);
  };

  const handleAdvancedFilter = () => {
    console.log("Advanced filter functionality would be implemented here");
  };

  const handleDownloadPatientCV = (patient: any) => {
    const cvContent = generatePatientCV(patient);
    downloadPDF(cvContent, `patient-cv-${patient.name.replace(/\s+/g, '-').toLowerCase()}`);
    toast({
      title: "CV Downloaded",
      description: `Patient CV for ${patient.name} has been downloaded successfully.`,
    });
  };

  const handleExportPatients = (format: 'csv' | 'excel') => {
    const exportData = filteredPatients.map(patient => ({
      Name: patient.name,
      Email: patient.email,
      Phone: patient.phone,
      'Date of Birth': patient.dateOfBirth,
      Address: patient.address,
      'Last Visit': patient.lastVisit,
      'Next Appointment': patient.nextAppointment || 'Not scheduled',
      Status: patient.status,
      Insurance: patient.insurance
    }));

    if (format === 'csv') {
      downloadCSV(exportData, 'patients-export');
    } else {
      downloadExcel(exportData, 'patients-export');
    }
    
    toast({
      title: "Patients Exported",
      description: `Patient data has been exported as ${format.toUpperCase()} successfully.`,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Patient Management</h2>
          <p className="text-dental-gray text-sm md:text-base">Manage patient records and information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="dental-outline" size="sm" className="font-inter text-xs md:text-sm" onClick={() => handleExportPatients('csv')}>
            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button variant="dental-outline" size="sm" className="font-inter text-xs md:text-sm" onClick={() => handleExportPatients('excel')}>
            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
          <Button variant="dental" size="sm" className="font-inter text-xs md:text-sm" onClick={handleAddPatient}>
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Add New Patient</span>
            <span className="sm:hidden">Add Patient</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-dental-blue-light">
        <CardContent className="p-3 md:p-6">
          <div className="space-y-3 md:space-y-0 md:flex md:gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-dental-blue font-medium mb-2 block text-xs md:text-sm">
                Search Patients
              </Label>
              <div className="relative">
                <Search className="absolute left-2 md:left-3 top-2.5 md:top-3 w-3 h-3 md:w-4 md:h-4 text-dental-gray" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 md:pl-10 text-xs md:text-sm border-dental-blue-light focus:border-dental-blue"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <Label htmlFor="filter" className="text-dental-blue font-medium mb-2 block text-xs md:text-sm">
                Filter by Status
              </Label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 text-xs md:text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-white"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="dental-outline" size="sm" className="font-inter text-xs md:text-sm" onClick={handleAdvancedFilter}>
                <Filter className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Advanced Filter</span>
                <span className="sm:hidden">Filter</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Statistics */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 md:p-4">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-dental-blue">{mockPatients.length}</p>
              <p className="text-dental-gray text-xs md:text-sm">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 md:p-4">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-success">{mockPatients.filter(p => p.status === 'active').length}</p>
              <p className="text-dental-gray text-xs md:text-sm">Active Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 md:p-4">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-dental-mint">{filteredPatients.length}</p>
              <p className="text-dental-gray text-xs md:text-sm">Filtered Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table */}
      <Card className="border-dental-blue-light">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-dental-blue text-base md:text-lg">Patient Records</CardTitle>
          <CardDescription className="text-xs md:text-sm">Complete list of all registered patients</CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {filteredPatients.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block rounded-lg border border-dental-blue-light overflow-hidden">
                <Table>
                  <TableHeader className="bg-dental-blue-light">
                    <TableRow>
                      <TableHead className="font-semibold text-dental-blue">Patient Info</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Contact</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Insurance</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Last Visit</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Status</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-dental-blue-light/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-dental-blue" />
                              <span className="font-medium text-foreground">{patient.name}</span>
                            </div>
                            <div className="text-sm text-dental-gray">DOB: {patient.dateOfBirth}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="w-3 h-3 text-dental-gray" />
                              <span className="text-dental-gray">{patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="w-3 h-3 text-dental-gray" />
                              <span className="text-dental-gray">{patient.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-dental-gray">{patient.insurance}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">{patient.lastVisit}</div>
                            {patient.nextAppointment && (
                              <div className="text-sm text-dental-mint">Next: {patient.nextAppointment}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-dental-blue hover:bg-dental-blue-light"
                              onClick={() => handleViewPatient(patient.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-dental-blue hover:bg-dental-blue-light"
                              onClick={() => handleEditPatient(patient.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-dental-mint hover:bg-dental-mint-light"
                              onClick={() => handleScheduleAppointment(patient.id)}
                            >
                              <Calendar className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-success hover:bg-success/10"
                              onClick={() => handleDownloadPatientCV(patient)}
                            >
                              <FileUser className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="border-dental-blue-light">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-dental-blue flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-foreground text-sm">{patient.name}</h4>
                            <p className="text-xs text-dental-gray">DOB: {patient.dateOfBirth}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-xs">
                          <Mail className="w-3 h-3 text-dental-gray flex-shrink-0" />
                          <span className="text-dental-gray truncate">{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <Phone className="w-3 h-3 text-dental-gray flex-shrink-0" />
                          <span className="text-dental-gray">{patient.phone}</span>
                        </div>
                        <div className="text-xs text-dental-gray">
                          <span className="font-medium">Insurance:</span> {patient.insurance}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-foreground">Last Visit:</span> 
                          <span className="text-dental-gray"> {patient.lastVisit}</span>
                          {patient.nextAppointment && (
                            <div className="text-dental-mint">Next: {patient.nextAppointment}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-dental-blue hover:bg-dental-blue-light flex-1 text-xs"
                          onClick={() => handleViewPatient(patient.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-dental-blue hover:bg-dental-blue-light flex-1 text-xs"
                          onClick={() => handleEditPatient(patient.id)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-dental-mint hover:bg-dental-mint-light flex-1 text-xs"
                          onClick={() => handleScheduleAppointment(patient.id)}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-success hover:bg-success/10"
                          onClick={() => handleDownloadPatientCV(patient)}
                        >
                          <FileUser className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 md:w-16 md:h-16 text-dental-gray mx-auto mb-4 opacity-50" />
              <h3 className="text-base md:text-lg font-semibold text-dental-gray mb-2">No patients found</h3>
              <p className="text-dental-gray text-sm md:text-base">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria." 
                  : "Add your first patient to get started."}
              </p>
              {(!searchTerm && filterStatus === "all") && (
                <Button variant="dental" className="mt-4" onClick={handleAddPatient}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Patient
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientManagement;
