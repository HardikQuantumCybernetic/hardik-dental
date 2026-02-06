import jsPDF from 'jspdf'
import { Patient, PatientService, PatientFinancial } from '@/lib/supabase'

interface PatientPDFData {
  patient: Patient
  services?: PatientService[]
  financials?: PatientFinancial
}

export const generatePatientPDF = (data: PatientPDFData) => {
  const pdf = new jsPDF()
  const { patient, services, financials } = data
  
  // Header
  pdf.setFontSize(20)
  pdf.setTextColor(41, 128, 185) // Dental blue color
  pdf.text('SmileCare Dental - Patient Report', 20, 30)
  
  // Patient ID
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text(`Patient ID: ${patient.patient_id || 'Not assigned'}`, 20, 45)
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55)
  
  // Patient Information
  pdf.setFontSize(16)
  pdf.setTextColor(41, 128, 185)
  pdf.text('Patient Information', 20, 75)
  
  pdf.setFontSize(11)
  pdf.setTextColor(0, 0, 0)
  let yPos = 90
  
  const patientInfo = [
    ['Name:', patient.name],
    ['Email:', patient.email],
    ['Phone:', patient.phone],
    ['Date of Birth:', patient.date_of_birth],
    ['Address:', patient.address || 'Not provided'],
    ['Insurance:', patient.insurance_info || 'Not provided'],
    ['Status:', patient.status.toUpperCase()],
    ['Member Since:', new Date(patient.created_at).toLocaleDateString()]
  ]
  
  patientInfo.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold')
    pdf.text(label, 20, yPos)
    pdf.setFont('helvetica', 'normal')
    pdf.text(value, 60, yPos)
    yPos += 8
  })
  
  // Medical History
  if (patient.medical_history) {
    yPos += 10
    pdf.setFontSize(16)
    pdf.setTextColor(41, 128, 185)
    pdf.text('Medical History', 20, yPos)
    yPos += 15
    
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    const splitHistory = pdf.splitTextToSize(patient.medical_history, 170)
    pdf.text(splitHistory, 20, yPos)
    yPos += splitHistory.length * 5 + 10
  }
  
  // Financial Information
  if (financials) {
    if (yPos > 250) {
      pdf.addPage()
      yPos = 30
    }
    
    pdf.setFontSize(16)
    pdf.setTextColor(41, 128, 185)
    pdf.text('Financial Summary', 20, yPos)
    yPos += 15
    
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    
    const financialInfo = [
      ['Total Treatment Cost:', `$${financials.total_treatment_cost.toFixed(2)}`],
      ['Amount Paid by Patient:', `$${financials.amount_paid_by_patient.toFixed(2)}`],
      ['Remaining from Patient:', `$${financials.remaining_from_patient.toFixed(2)}`],
      ['Amount Due to Doctor:', `$${financials.amount_due_to_doctor.toFixed(2)}`]
    ]
    
    financialInfo.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, 20, yPos)
      pdf.setFont('helvetica', 'normal')
      pdf.text(value, 100, yPos)
      yPos += 8
    })
    
    if (financials.notes) {
      yPos += 5
      pdf.setFont('helvetica', 'bold')
      pdf.text('Financial Notes:', 20, yPos)
      yPos += 8
      pdf.setFont('helvetica', 'normal')
      const splitNotes = pdf.splitTextToSize(financials.notes, 170)
      pdf.text(splitNotes, 20, yPos)
      yPos += splitNotes.length * 5 + 10
    }
  }
  
  // Services/Treatment History
  if (services && services.length > 0) {
    if (yPos > 230) {
      pdf.addPage()
      yPos = 30
    }
    
    pdf.setFontSize(16)
    pdf.setTextColor(41, 128, 185)
    pdf.text('Treatment History', 20, yPos)
    yPos += 15
    
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    
    // Table headers
    pdf.setFont('helvetica', 'bold')
    pdf.text('Service', 20, yPos)
    pdf.text('Status', 80, yPos)
    pdf.text('Cost', 120, yPos)
    pdf.text('Date', 150, yPos)
    yPos += 5
    
    // Draw line under headers
    pdf.line(20, yPos, 190, yPos)
    yPos += 10
    
    pdf.setFont('helvetica', 'normal')
    
    services.forEach((service) => {
      if (yPos > 270) {
        pdf.addPage()
        yPos = 30
      }
      
      const serviceName = service.service_name || 'Unknown Service'
      const statusColor: [number, number, number] = service.status === 'completed' ? [34, 139, 34] : 
                         service.status === 'in_progress' ? [255, 165, 0] : [128, 128, 128]
      
      pdf.text(serviceName, 20, yPos)
      
      const [r, g, b] = statusColor
      pdf.setTextColor(r, g, b)
      pdf.text(service.status.toUpperCase(), 80, yPos)
      pdf.setTextColor(0, 0, 0)
      
      pdf.text(`$${service.assigned_cost.toFixed(2)}`, 120, yPos)
      
      const dateText = service.completed_date || service.scheduled_date || 'Not scheduled'
      pdf.text(dateText, 150, yPos)
      
      if (service.notes) {
        yPos += 6
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        const splitNotes = pdf.splitTextToSize(`Note: ${service.notes}`, 170)
        pdf.text(splitNotes, 20, yPos)
        yPos += splitNotes.length * 4
        pdf.setFontSize(11)
        pdf.setTextColor(0, 0, 0)
      }
      
      yPos += 10
    })
  }
  
  // Footer
  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(128, 128, 128)
    pdf.text(`Page ${i} of ${pageCount}`, 180, 290)
    pdf.text('SmileCare Dental - Confidential Patient Information', 20, 290)
  }
  
  // Save the PDF
  const fileName = `patient-${patient.patient_id || patient.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}