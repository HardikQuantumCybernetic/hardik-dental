
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  PieChart
} from "lucide-react";
import { downloadPDF, downloadCSV, downloadExcel, generateReportPDF } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";

const ReportsAnalytics = () => {
  const { toast } = useToast();
  const reportTypes = [
    {
      title: "Patient Demographics",
      description: "Age groups, insurance types, and geographic distribution",
      icon: Users,
      color: "text-dental-blue",
      bgColor: "bg-dental-blue-light"
    },
    {
      title: "Appointment Statistics",
      description: "Booking trends, cancellation rates, and peak times",
      icon: Calendar,
      color: "text-dental-mint",
      bgColor: "bg-dental-mint-light"
    },
    {
      title: "Revenue Reports",
      description: "Monthly income, treatment profitability, and payment trends",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Treatment Analysis",
      description: "Most common procedures and success rates",
      icon: BarChart3,
      color: "text-dental-blue",
      bgColor: "bg-dental-blue-light"
    }
  ];

  const quickStats = [
    { label: "This Month", value: "₹34,560", change: "+12.5%", positive: true },
    { label: "New Patients", value: "47", change: "+8.2%", positive: true },
    { label: "Appointments", value: "234", change: "-2.1%", positive: false },
    { label: "Revenue Growth", value: "18.4%", change: "+3.2%", positive: true }
  ];

  const recentReports = [
    { name: "Monthly Revenue Report - December 2023", date: "2024-01-01", size: "2.4 MB" },
    { name: "Patient Demographics Q4 2023", date: "2023-12-31", size: "1.8 MB" },
    { name: "Appointment Statistics - Week 52", date: "2023-12-24", size: "956 KB" },
    { name: "Treatment Success Rates - 2023", date: "2023-12-20", size: "3.1 MB" }
  ];

  const handleGenerateCustomReport = () => {
    console.log("Generate custom report functionality would be implemented here");
  };

  const handleGenerateReport = (reportType: string) => {
    console.log(`Generate ${reportType} report functionality would be implemented here`);
  };

  const handleViewReport = (reportType: string) => {
    console.log(`View ${reportType} report functionality would be implemented here`);
  };

  const handleDownloadReport = (reportName: string) => {
    const reportData = {
      reportName,
      generatedDate: new Date().toISOString(),
      stats: quickStats,
      period: "Last 30 days"
    };
    
    const pdfContent = generateReportPDF(reportName, reportData);
    downloadPDF(pdfContent, `report-${reportName.replace(/\s+/g, '-').toLowerCase()}`);
    
    toast({
      title: "Report Downloaded",
      description: `${reportName} report has been downloaded as PDF.`,
    });
  };

  const handleExportFormat = (format: string) => {
    const exportData = quickStats.map(stat => ({
      Metric: stat.label,
      Value: stat.value,
      Change: stat.change,
      Trend: stat.positive ? 'Positive' : 'Negative'
    }));
    
    if (format === 'PDF') {
      const pdfContent = generateReportPDF('Analytics Summary', exportData);
      downloadPDF(pdfContent, 'analytics-summary');
    } else if (format === 'Excel') {
      downloadExcel(exportData, 'analytics-summary');
    } else if (format === 'CSV') {
      downloadCSV(exportData, 'analytics-summary');
    }
    
    toast({
      title: "Data Exported",
      description: `Analytics data has been exported as ${format}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-dental-gray">Generate insights and track practice performance</p>
        </div>
        <Button variant="dental" size="lg" className="font-inter" onClick={handleGenerateCustomReport}>
          <FileText className="w-5 h-5 mr-2" />
          Generate Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-dental-blue-light hover:shadow-dental-card transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dental-gray text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                    {stat.change} from last period
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${stat.positive ? 'text-success' : 'text-destructive'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <Card className="lg:col-span-2 border-dental-blue-light">
          <CardHeader>
            <CardTitle className="text-dental-blue flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Available Reports</span>
            </CardTitle>
            <CardDescription>Select a report type to generate detailed analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportTypes.map((report, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 p-4 rounded-lg border border-dental-blue-light hover:bg-dental-blue-light/30 transition-all duration-300 cursor-pointer"
                onClick={() => handleGenerateReport(report.title)}
              >
                <div className={`p-3 rounded-full ${report.bgColor}`}>
                  <report.icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{report.title}</h3>
                  <p className="text-dental-gray text-sm">{report.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-dental-blue hover:bg-dental-blue-light"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewReport(report.title);
                    }}
                  >
                    <PieChart className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-dental-mint hover:bg-dental-mint-light"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadReport(report.title);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="border-dental-blue-light">
          <CardHeader>
            <CardTitle className="text-dental-blue flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Recent Reports</span>
            </CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-dental-blue-light/30">
                <FileText className="w-5 h-5 text-dental-blue mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{report.name}</p>
                  <p className="text-dental-gray text-xs">{report.date} • {report.size}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-dental-mint hover:bg-dental-mint-light"
                  onClick={() => handleDownloadReport(report.name)}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-dental-blue-light">
        <CardHeader>
          <CardTitle className="text-dental-blue">Export Options</CardTitle>
          <CardDescription>Choose your preferred format for report exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              variant="dental-outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleExportFormat('PDF')}
            >
              <div className="text-left">
                <div className="font-medium">PDF Report</div>
                <div className="text-sm text-dental-gray">Professional formatted documents</div>
              </div>
            </Button>
            <Button 
              variant="dental-outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleExportFormat('Excel')}
            >
              <div className="text-left">
                <div className="font-medium">Excel Spreadsheet</div>
                <div className="text-sm text-dental-gray">Raw data for further analysis</div>
              </div>
            </Button>
            <Button 
              variant="dental-outline" 
              className="justify-start h-auto p-4"
              onClick={() => handleExportFormat('CSV')}
            >
              <div className="text-left">
                <div className="font-medium">CSV Data</div>
                <div className="text-sm text-dental-gray">Simple comma-separated values</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
