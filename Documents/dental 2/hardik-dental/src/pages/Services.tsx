import DentalNavbar from "@/components/DentalNavbar";
import DentalServices from "@/components/DentalServices";
import DentalFooter from "@/components/DentalFooter";

const Services = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16">
        <DentalServices />
      </div>
      <DentalFooter />
    </div>
  );
};

export default Services;