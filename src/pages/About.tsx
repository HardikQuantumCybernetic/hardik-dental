import DentalNavbar from "@/components/DentalNavbar";
import DentalAbout from "@/components/DentalAbout";
import DentalFooter from "@/components/DentalFooter";

const About = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16">
        <DentalAbout />
      </div>
      <DentalFooter />
    </div>
  );
};

export default About;