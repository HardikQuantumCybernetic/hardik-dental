import DentalNavbar from "@/components/DentalNavbar";
import DentalHero from "@/components/DentalHero";
import DentalFooter from "@/components/DentalFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Award, Shield } from "lucide-react";
import { Link } from "react-router-dom";
const Home = () => {
  const highlights = [{
    icon: Users,
    title: "500+ Happy Patients",
    description: "Join our growing family of satisfied patients"
  }, {
    icon: Award,
    title: "Award Winning Practice",
    description: "Recognized for excellence in dental care"
  }, {
    icon: Shield,
    title: "Insurance Accepted",
    description: "We work with most major insurance providers"
  }, {
    icon: Calendar,
    title: "Same Day Appointments",
    description: "Flexible scheduling to fit your busy life"
  }];
  return <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <DentalHero />
      
      {/* Quick Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-inter">
              Why Choose 
              <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent"> Hardik Dental?</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return <Card key={highlight.title} className="text-center border-dental-blue-light hover:shadow-dental-card transition-all duration-300 hover:-translate-y-2 glow-effect color-shift" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 gradient-interactive rounded-2xl flex items-center justify-center mx-auto mb-4 floating-animation" style={{
                  animationDelay: `${index * 150}ms`
                }}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 font-inter font-black">{highlight.title}</h3>
                    <p className="text-dental-gray text-sm">{highlight.description}</p>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* CTA Section */}
          <div className="text-center animated-bg rounded-3xl p-8 md:p-12 glow-effect">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-inter">
              Ready to Get Started?
            </h3>
            <p className="text-dental-gray mb-8 max-w-2xl mx-auto">
              Take the first step towards a healthier, more beautiful smile. 
              Our expert team is here to provide the best dental care for you and your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button variant="dental" size="xl" className="font-inter pulse-glow">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="dental-outline" size="xl" className="font-inter color-shift">
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <DentalFooter />
    </div>;
};
export default Home;