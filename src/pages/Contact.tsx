
import DentalNavbar from "@/components/DentalNavbar";
import DentalContact from "@/components/DentalContact";
import DentalFooter from "@/components/DentalFooter";
import { Button } from "@/components/ui/button";
import { Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16">
        <DentalContact />
        
        {/* Admin Access Section */}
        <div className="py-8 bg-dental-blue-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-dental-blue" />
              <span className="text-dental-gray text-sm font-medium">Administrative Access</span>
            </div>
            <Link to="/admin">
              <Button 
                variant="dental-outline" 
                size="lg" 
                className="font-inter shadow-dental-card hover:shadow-dental-button transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <DentalFooter />
    </div>
  );
};

export default Contact;
