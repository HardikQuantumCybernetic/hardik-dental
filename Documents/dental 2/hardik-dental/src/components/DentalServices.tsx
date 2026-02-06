import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Zap, 
  Eye,
  Calendar,
  ArrowRight
} from "lucide-react";

const DentalServices = () => {
  const services = [
    {
      icon: ShieldCheck,
      title: "General Dentistry",
      description: "Comprehensive dental care including checkups, cleanings, and preventive treatments to maintain your oral health.",
      features: ["Regular Checkups", "Professional Cleaning", "Cavity Fillings", "Oral Health Education"],
      price: "From₹150"
    },
    {
      icon: Sparkles,
      title: "Cosmetic Dentistry",
      description: "Transform your smile with our advanced cosmetic procedures designed to enhance your confidence.",
      features: ["Teeth Whitening", "Veneers", "Bonding", "Smile Makeover"],
      price: "From ₹300"
    },
    {
      icon: Zap,
      title: "Orthodontics",
      description: "Straighten your teeth with traditional braces or modern clear aligners for a perfect smile.",
      features: ["Metal Braces", "Clear Aligners", "Retainers", "Bite Correction"],
      price: "From ₹2,500"
    },
    {
      icon: Heart,
      title: "Oral Surgery",
      description: "Expert surgical procedures performed with precision and care in our state-of-the-art facility.",
      features: ["Tooth Extraction", "Dental Implants", "Wisdom Teeth", "Gum Surgery"],
      price: "From ₹800"
    },
    {
      icon: Eye,
      title: "Emergency Care",
      description: "Immediate dental care when you need it most. We're here for your dental emergencies.",
      features: ["24/7 Availability", "Pain Relief", "Urgent Repairs", "Same-Day Treatment"],
      price: "From ₹200"
    },
    {
      icon: Smile,
      title: "Pediatric Dentistry",
      description: "Gentle, kid-friendly dental care to ensure your child develops healthy oral hygiene habits.",
      features: ["Child-Friendly Approach", "Preventive Care", "Fluoride Treatments", "Dental Education"],
      price: "From ₹120"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-inter">
            Comprehensive 
            <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent font-black"> Dental Services</span>
          </h2>
          <p className="text-lg text-dental-gray max-w-3xl mx-auto leading-relaxed">
            From routine cleanings to advanced procedures, we offer a full range of dental services 
            using the latest technology and techniques for optimal patient care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.title} 
                className="group hover:shadow-dental-card transition-all duration-300 hover:-translate-y-2 border-dental-blue-light glow-effect color-shift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 gradient-interactive rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 floating-animation" style={{ animationDelay: `${index * 200}ms` }}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground font-inter group-hover:text-dental-blue transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-dental-gray">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-dental-gray">
                        <div className="w-2 h-2 bg-dental-mint rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-dental-blue-light">
                    <span className="text-lg font-bold text-dental-blue">{service.price}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-dental-blue hover:text-white hover:bg-dental-blue group pulse-glow cursor-pointer transition-all duration-200 pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Learn more about:', service.title);
              window.location.href = '/booking';
            }}
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center animated-bg rounded-3xl p-8 md:p-12 animate-scale-in glow-effect relative overflow-hidden">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-inter">
            Ready to Schedule Your Visit?
          </h3>
          <p className="text-dental-gray mb-8 max-w-2xl mx-auto">
            Don't wait to achieve the healthy, beautiful smile you deserve. 
            Book your appointment today and take the first step towards optimal oral health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="dental" 
              size="xl" 
              className="font-inter group pulse-glow cursor-pointer"
              onClick={() => window.location.href = '/booking'}
            >
              <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Book Appointment Now
            </Button>
            <Button 
              variant="dental-outline" 
              size="xl" 
              className="font-inter color-shift cursor-pointer"
              onClick={() => window.location.href = 'tel:8080950921'}
            >
              Call (808) 095-0921
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DentalServices;
