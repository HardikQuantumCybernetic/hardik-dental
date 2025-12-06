import DentalNavbar from "@/components/DentalNavbar";
import DentalHero from "@/components/DentalHero";
import DentalServices from "@/components/DentalServices";
import DentalAbout from "@/components/DentalAbout";
import DentalBooking from "@/components/DentalBooking";
import DentalContact from "@/components/DentalContact";
import DentalFooter from "@/components/DentalFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <DentalHero />
      <DentalServices />
      <DentalAbout />
      <DentalBooking />
      <DentalContact />
      <DentalFooter />
    </div>
  );
};

export default Index;
