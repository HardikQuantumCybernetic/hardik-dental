import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import PatientDashboard from "@/components/auth/PatientDashboard";

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/login");
    }
  }, [isLoaded, user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <div className="text-dental-blue">Loading...</div>
      </div>
    );
  }

  return <PatientDashboard user={user} onLogout={handleLogout} />;
};

export default PatientDashboardPage;