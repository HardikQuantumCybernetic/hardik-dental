import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, TrendingUp, TrendingDown, Edit, Save, X } from "lucide-react";
import { usePatientFinancials } from "@/hooks/useSupabaseExtended";
import { PatientFinancial } from "@/lib/supabase";

interface PatientFinancialManagerProps {
  patientId: string;
}

const PatientFinancialManager = ({ patientId }: PatientFinancialManagerProps) => {
  const { financials, loading, updateFinancials } = usePatientFinancials(patientId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    total_treatment_cost: 0,
    amount_paid_by_patient: 0,
    remaining_from_patient: 0,
    amount_due_to_doctor: 0,
    notes: ""
  });

  useEffect(() => {
    if (financials) {
      setFormData({
        total_treatment_cost: financials.total_treatment_cost,
        amount_paid_by_patient: financials.amount_paid_by_patient,
        remaining_from_patient: financials.remaining_from_patient,
        amount_due_to_doctor: financials.amount_due_to_doctor,
        notes: financials.notes || ""
      });
    }
  }, [financials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFinancials(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating financials:', error);
    }
  };

  const handleCancel = () => {
    if (financials) {
      setFormData({
        total_treatment_cost: financials.total_treatment_cost,
        amount_paid_by_patient: financials.amount_paid_by_patient,
        remaining_from_patient: financials.remaining_from_patient,
        amount_due_to_doctor: financials.amount_due_to_doctor,
        notes: financials.notes || ""
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card className="border-dental-blue-light">
        <CardContent className="p-6">
          <div className="text-center text-dental-gray">Loading financial information...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dental-blue-light">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-dental-blue flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Financial Management</span>
            </CardTitle>
            <CardDescription>Track payments, costs, and financial obligations</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="dental-outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="dental" size="sm" onClick={handleSubmit}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="dental-outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-dental-blue-light bg-gradient-to-br from-dental-blue/5 to-dental-blue/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-dental-blue" />
                  <div className="text-xs text-dental-gray">Total Treatment Cost</div>
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.total_treatment_cost}
                    onChange={(e) => setFormData({...formData, total_treatment_cost: parseFloat(e.target.value) || 0})}
                    className="mt-2 text-lg font-bold border-dental-blue-light"
                  />
                ) : (
                  <div className="text-2xl font-bold text-dental-blue mt-1">
                    ${formData.total_treatment_cost.toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-dental-blue-light bg-gradient-to-br from-success/5 to-success/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <div className="text-xs text-dental-gray">Amount Paid by Patient</div>
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount_paid_by_patient}
                    onChange={(e) => setFormData({...formData, amount_paid_by_patient: parseFloat(e.target.value) || 0})}
                    className="mt-2 text-lg font-bold border-dental-blue-light"
                  />
                ) : (
                  <div className="text-2xl font-bold text-success mt-1">
                    ${formData.amount_paid_by_patient.toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-dental-blue-light bg-gradient-to-br from-warning/5 to-warning/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-warning" />
                  <div className="text-xs text-dental-gray">Remaining from Patient</div>
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.remaining_from_patient}
                    onChange={(e) => setFormData({...formData, remaining_from_patient: parseFloat(e.target.value) || 0})}
                    className="mt-2 text-lg font-bold border-dental-blue-light"
                  />
                ) : (
                  <div className="text-2xl font-bold text-warning mt-1">
                    ${formData.remaining_from_patient.toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-dental-blue-light bg-gradient-to-br from-dental-mint/5 to-dental-mint/10">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-dental-mint" />
                  <div className="text-xs text-dental-gray">Amount Due to Doctor</div>
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount_due_to_doctor}
                    onChange={(e) => setFormData({...formData, amount_due_to_doctor: parseFloat(e.target.value) || 0})}
                    className="mt-2 text-lg font-bold border-dental-blue-light"
                  />
                ) : (
                  <div className="text-2xl font-bold text-dental-mint mt-1">
                    ${formData.amount_due_to_doctor.toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <Card className="border-dental-blue-light">
            <CardHeader>
              <CardTitle className="text-sm text-dental-blue">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dental-gray">Balance Status:</span>
                  <span className={`font-medium ${
                    formData.remaining_from_patient > 0 ? 'text-warning' : 'text-success'
                  }`}>
                    {formData.remaining_from_patient > 0 ? 'Outstanding Balance' : 'Fully Paid'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dental-gray">Payment Progress:</span>
                  <span className="font-medium text-foreground">
                    {formData.total_treatment_cost > 0 
                      ? `${((formData.amount_paid_by_patient / formData.total_treatment_cost) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dental-gray">Doctor Payment Status:</span>
                  <span className={`font-medium ${
                    formData.amount_due_to_doctor > 0 ? 'text-warning' : 'text-success'
                  }`}>
                    {formData.amount_due_to_doctor > 0 ? 'Payment Pending' : 'Settled'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-dental-blue font-medium">Financial Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Add any financial notes, payment plans, or special arrangements..."
                rows={4}
                className="border-dental-blue-light focus:border-dental-blue"
              />
            ) : (
              <div className="p-3 bg-dental-blue-light rounded-lg min-h-[60px]">
                {formData.notes ? (
                  <p className="text-sm text-dental-gray">{formData.notes}</p>
                ) : (
                  <p className="text-sm text-dental-gray italic">No financial notes added yet.</p>
                )}
              </div>
            )}
          </div>

          {financials && (
            <div className="text-xs text-dental-gray text-center pt-4 border-t border-dental-blue-light">
              Last updated: {new Date(financials.updated_at).toLocaleString()}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientFinancialManager;