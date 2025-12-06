import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, AlertCircle, XCircle, Plus, Edit, Trash2 } from "lucide-react";
import { usePatientServices, useServices } from "@/hooks/useSupabaseExtended";
import { PatientService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface PatientServicesManagerProps {
  patientId: string;
}

const PatientServicesManager = ({ patientId }: PatientServicesManagerProps) => {
  const { patientServices, loading, addPatientService, updatePatientService, deletePatientService } = usePatientServices(patientId);
  const { services } = useServices();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingService, setEditingService] = useState<PatientService | null>(null);
  const [formData, setFormData] = useState<{
    service_id: string;
    assigned_cost: number;
    notes: string;
    scheduled_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  }>({
    service_id: "",
    assigned_cost: 0,
    notes: "",
    scheduled_date: "",
    status: "pending"
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-warning" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <AlertCircle className="w-4 h-4 text-dental-blue" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-white';
      case 'in_progress': return 'bg-warning text-white';
      case 'cancelled': return 'bg-destructive text-white';
      default: return 'bg-dental-blue text-white';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const serviceData = {
        patient_id: patientId,
        service_id: formData.service_id,
        assigned_cost: formData.assigned_cost,
        notes: formData.notes,
        scheduled_date: formData.scheduled_date || null,
        completed_date: formData.status === 'completed' ? new Date().toISOString().split('T')[0] : null,
        status: formData.status
      };

      if (editingService) {
        await updatePatientService(editingService.id, serviceData);
        setEditingService(null);
      } else {
        await addPatientService(serviceData);
      }

      setFormData({
        service_id: "",
        assigned_cost: 0,
        notes: "",
        scheduled_date: "",
        status: "pending"
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: PatientService) => {
    setEditingService(service);
    setFormData({
      service_id: service.service_id,
      assigned_cost: service.assigned_cost,
      notes: service.notes || "",
      scheduled_date: service.scheduled_date || "",
      status: service.status
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm('Are you sure you want to remove this service?')) {
      await deletePatientService(serviceId);
    }
  };

  const handleCancel = () => {
    setEditingService(null);
    setFormData({
      service_id: "",
      assigned_cost: 0,
      notes: "",
      scheduled_date: "",
      status: "pending"
    });
    setShowAddDialog(false);
  };

  const completedServices = patientServices.filter(s => s.status === 'completed');
  const pendingServices = patientServices.filter(s => s.status !== 'completed');

  if (loading) {
    return (
      <Card className="border-dental-blue-light">
        <CardContent className="p-6">
          <div className="text-center text-dental-gray">Loading services...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dental-blue-light">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-dental-blue">Treatment Plan & Services</CardTitle>
            <CardDescription>Manage patient's treatment plan and service history</CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="dental-outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Update service information' : 'Add a new service to the patient\'s treatment plan'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service_id">Service</Label>
                  <Select 
                    value={formData.service_id} 
                    onValueChange={(value) => {
                      const selectedService = services.find(s => s.id === value);
                      setFormData({
                        ...formData, 
                        service_id: value,
                        assigned_cost: selectedService?.default_cost || 0
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.default_cost}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assigned_cost">Cost</Label>
                    <Input
                      id="assigned_cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.assigned_cost}
                      onChange={(e) => setFormData({...formData, assigned_cost: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: "pending" | "in_progress" | "completed" | "cancelled") => 
                        setFormData({...formData, status: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Scheduled Date</Label>
                  <Input
                    id="scheduled_date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional notes about this service..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button type="submit" variant="dental" className="flex-1">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </Button>
                  <Button type="button" variant="dental-outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-dental-blue-light rounded-lg">
            <div className="text-lg font-bold text-dental-blue">{patientServices.length}</div>
            <div className="text-sm text-dental-gray">Total Services</div>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg">
            <div className="text-lg font-bold text-warning">{pendingServices.length}</div>
            <div className="text-sm text-dental-gray">Pending</div>
          </div>
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <div className="text-lg font-bold text-success">{completedServices.length}</div>
            <div className="text-sm text-dental-gray">Completed</div>
          </div>
        </div>

        {patientServices.length === 0 ? (
          <div className="text-center py-8 text-dental-gray">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No services assigned yet. Click "Add Service" to start building the treatment plan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {patientServices.map((service) => (
              <Card key={service.id} className="border-dental-blue-light">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(service.status)}
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {service.service_name || 'Unknown Service'}
                          </h4>
                          <p className="text-sm text-dental-gray">
                            Cost: ${service.assigned_cost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {service.service_description && (
                        <p className="text-sm text-dental-gray mb-2">
                          {service.service_description}
                        </p>
                      )}
                      
                      {service.notes && (
                        <p className="text-sm text-dental-gray bg-dental-blue-light p-2 rounded">
                          <strong>Notes:</strong> {service.notes}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-dental-gray">
                        {service.scheduled_date && (
                          <span>Scheduled: {service.scheduled_date}</span>
                        )}
                        {service.completed_date && (
                          <span>Completed: {service.completed_date}</span>
                        )}
                        <span>Added: {new Date(service.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={`${getStatusColor(service.status)} text-xs`}>
                        {service.status.toUpperCase()}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          className="text-dental-blue hover:bg-dental-blue-light h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientServicesManager;