import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import DentalNavbar from "@/components/DentalNavbar";
import DentalFooter from "@/components/DentalFooter";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-dental-blue mb-4">404</h1>
            <h2 className="text-3xl font-bold text-foreground mb-6 font-inter">
              Page Not Found
            </h2>
            <p className="text-lg text-dental-gray mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="dental" size="lg">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="dental-outline" size="lg">
              <Link to="/services" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Browse Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <DentalFooter />
    </div>
  );
};

export default NotFound;
