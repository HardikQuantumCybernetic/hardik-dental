import DentalNavbar from "@/components/DentalNavbar";
import DentalFooter from "@/components/DentalFooter";
import AdminPanel from "@/components/AdminPanel";
import AdminLogin from "@/components/admin/AdminLogin";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading, signIn, signOut } = useAdminAuth();

  const handleLogin = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying admin access..." />
      </div>
    );
  }

  // Show login page if not authenticated or not an admin
  if (!user || !isAdmin) {
    return (
      <>
        <AdminLogin onLogin={handleLogin} />
        {user && !isAdmin && (
          <div className="fixed bottom-4 right-4 max-w-md">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You don't have admin privileges. Please contact your system administrator.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16">
        <AdminPanel onLogout={handleLogout} />
      </div>
      <DentalFooter />
    </div>
  );
};

export default Admin;
