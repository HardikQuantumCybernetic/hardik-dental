import DentalNavbar from "@/components/DentalNavbar";
import DentalBooking from "@/components/DentalBooking";
import DentalFooter from "@/components/DentalFooter";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16">
        <DentalBooking />
      </div>
      <DentalFooter />
    </div>
  );
};

export default Booking;