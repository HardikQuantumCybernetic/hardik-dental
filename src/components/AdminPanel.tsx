
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield,
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  LogOut,
  User,
  MessageSquare,
  Mail
} from "lucide-react";
import AdminDashboard from "./admin/AdminDashboard";
import PatientManagementSupabase from "./admin/PatientManagementSupabase";
import AppointmentManagement from "./admin/AppointmentManagement";
import ReportsAnalytics from "./admin/ReportsAnalytics";
import FeedbackManagement from "./admin/FeedbackManagement";
import MessagesManagement from "./admin/MessagesManagement";

interface AdminPanelProps {
  onLogout?: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [userRole] = useState("Admin"); // This would come from authentication

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "patients", label: "Patient Management", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "messages", label: "Contact Messages", icon: Mail },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "patients":
        return <PatientManagementSupabase />;
      case "appointments":
        return <AppointmentManagement />;
      case "messages":
        return <MessagesManagement />;
      case "feedback":
        return <FeedbackManagement />;
      case "reports":
        return <ReportsAnalytics />;
      default:
        return <AdminDashboard />;
    }
  };

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <section className="py-4 md:py-20 bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-4">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-dental-blue" />
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground font-inter">
              Admin 
              <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent"> Panel</span>
            </h1>
          </div>
          <p className="text-sm md:text-lg text-dental-gray max-w-2xl mx-auto leading-relaxed px-4">
            Comprehensive dental practice management system
          </p>
        </div>

        {/* User Info Bar */}
        <Card className="mb-4 md:mb-8 border-dental-blue-light">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-dental-blue-light rounded-full">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-dental-blue" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm md:text-base">Welcome back, Dr. Admin</p>
                  <p className="text-dental-gray text-xs md:text-sm">Role: {userRole} • Last login: Today, 9:30 AM</p>
                </div>
              </div>
              <Button variant="dental-outline" size="sm" onClick={handleLogout} className="text-xs md:text-sm">
                <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Navigation */}
        <div className="lg:hidden mb-4">
          <Card className="border-dental-blue-light">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "dental" : "ghost"}
                    className="w-full justify-center text-xs p-2 h-auto flex-col gap-1"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="leading-tight">{item.label.split(' ')[0]}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 md:gap-8">
          {/* Desktop Navigation Sidebar */}
          <Card className="hidden lg:block lg:col-span-1 border-dental-blue-light h-fit">
            <CardContent className="p-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "dental" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-4 w-full">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
