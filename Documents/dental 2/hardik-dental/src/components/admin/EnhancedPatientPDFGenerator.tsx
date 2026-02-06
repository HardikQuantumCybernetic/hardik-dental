import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, Loader2 } from "lucide-react";
import { Patient } from "@/lib/supabase";
import { usePatientServices, usePatientFinancials } from "@/hooks/useSupabaseExtended";
import { generatePatientPDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface EnhancedPatientPDFGeneratorProps {
  patient: Patient;
}

const EnhancedPatientPDFGenerator = ({ patient }: EnhancedPatientPDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { patientServices } = usePatientServices(patient.id);
  const { financials } = usePatientFinancials(patient.id);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF with all available data
      generatePatientPDF({
        patient,
        services: patientServices,
        financials
      });

      toast({
        title: "PDF Generated Successfully",
        description: `Complete patient report for ${patient.name} has been downloaded.`
      });

      setShowDialog(false);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-success hover:bg-success/10"
          title="Download PDF Report"
        >
          <Download className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-dental-blue" />
            <span>Generate Patient Report</span>
          </DialogTitle>
          <DialogDescription>
            Generate a comprehensive PDF report for {patient.name} including all treatment history, financial information, and personal details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-dental-blue-light p-4 rounded-lg">
            <h4 className="font-medium text-dental-blue mb-2">Report will include:</h4>
            <ul className="text-sm text-dental-gray space-y-1">
              <li>• Patient personal information and contact details</li>
              <li>• Medical history and insurance information</li>
              <li>• Complete treatment history ({patientServices.length} services)</li>
              <li>• Financial summary and payment status</li>
              <li>• Appointment history and notes</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-dental-mint/10 rounded">
              <div className="font-bold text-dental-mint">{patientServices.length}</div>
              <div className="text-dental-gray">Services Recorded</div>
            </div>
            <div className="text-center p-3 bg-success/10 rounded">
              <div className="font-bold text-success">
                {financials ? `$${financials.total_treatment_cost.toFixed(2)}` : '$0.00'}
              </div>
              <div className="text-dental-gray">Total Treatment Cost</div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="flex-1"
              variant="dental"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </>
              )}
            </Button>
            <Button
              variant="dental-outline"
              onClick={() => setShowDialog(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPatientPDFGenerator;