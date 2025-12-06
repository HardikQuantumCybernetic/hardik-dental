import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { 
  Users, 
  Calendar, 
  IndianRupee, 
  Activity,
  UserCheck,
  CalendarCheck,
  CreditCard,
  FileBarChart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatients, useAppointments } from "@/hooks/useSupabase";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { patients, loading: patientsLoading } = usePatients();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const [revenue, setRevenue] = useState(45678);
  const [activeUsers, setActiveUsers] = useState(12);

  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'active').length;
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'scheduled').length;
  const todaysAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.appointment_date === today;
  }).length;

  const handleQuickAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} feature is ready to use!`,
    });
  };

  if (patientsLoading || appointmentsLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        <LoadingSkeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-3">
          <Activity className="w-8 h-8 text-dental-blue" />
          <span>Dashboard Overview</span>
        </h1>
        <p className="text-dental-gray text-lg">Welcome back! Here's what's happening with your practice today.</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Patients */}
        <Card className="border-l-4 border-l-dental-blue bg-gradient-to-br from-white to-dental-blue/5 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-dental-gray">Total Patients</p>
                <p className="text-3xl font-bold text-dental-blue">{totalPatients}</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">+12% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-dental-blue/10 rounded-full">
                <Users className="w-8 h-8 text-dental-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="border-l-4 border-l-dental-mint bg-gradient-to-br from-white to-dental-mint/5 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-dental-gray">Today's Appointments</p>
                <p className="text-3xl font-bold text-dental-mint">{todaysAppointments}</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">+5% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-dental-mint/10 rounded-full">
                <Calendar className="w-8 h-8 text-dental-mint" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Patients */}
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-dental-gray">Active Patients</p>
                <p className="text-3xl font-bold text-green-600">{activePatients}</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">+8% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-dental-gray">Total Appointments</p>
                <p className="text-3xl font-bold text-blue-600">{totalAppointments}</p>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">+15% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CalendarCheck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-dental-blue/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-dental-blue to-dental-mint text-white">
          <CardTitle className="text-xl flex items-center space-x-2">
            <CheckCircle className="w-6 h-6" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription className="text-dental-blue-light">
            Commonly used functions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 hover:bg-dental-blue hover:text-white transition-all duration-200 border-dental-blue/20"
              onClick={() => handleQuickAction("Add New Patient")}
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Add New Patient</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 hover:bg-dental-mint hover:text-white transition-all duration-200 border-dental-mint/20"
              onClick={() => handleQuickAction("Schedule Appointment")}
            >
              <CalendarCheck className="w-6 h-6" />
              <span className="text-sm font-medium">Schedule Appointment</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 hover:bg-green-500 hover:text-white transition-all duration-200 border-green-200"
              onClick={() => handleQuickAction("Generate Report")}
            >
              <FileBarChart className="w-6 h-6" />
              <span className="text-sm font-medium">Generate Report</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 hover:bg-blue-500 hover:text-white transition-all duration-200 border-blue-200"
              onClick={() => handleQuickAction("View Analytics")}
            >
              <Eye className="w-6 h-6" />
              <span className="text-sm font-medium">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="border-dental-blue/20">
        <CardHeader>
          <CardTitle className="text-xl text-dental-blue flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Recent Notifications</span>
          </CardTitle>
          <CardDescription>Latest updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <CalendarCheck className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-800">{pendingAppointments} appointments scheduled for today</p>
              <p className="text-sm text-green-600">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <IndianRupee className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-blue-800">Payment received from John Smith</p>
              <p className="text-sm text-blue-600">4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">Appointment reminder sent to 12 patients</p>
              <p className="text-sm text-yellow-600">6 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <FileBarChart className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <p className="font-medium text-purple-800">Monthly report is ready</p>
              <p className="text-sm text-purple-600">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;