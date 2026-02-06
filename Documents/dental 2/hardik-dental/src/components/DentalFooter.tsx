
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { handlePhoneCall, handleEmail } from "@/utils/buttonActions";

const DentalFooter = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "General Dentistry", href: "/services" },
    { name: "Cosmetic Dentistry", href: "/services" },
    { name: "Orthodontics", href: "/services" },
    { name: "Oral Surgery", href: "/services" },
    { name: "Emergency Care", href: "/services" },
    { name: "Pediatric Dentistry", href: "/services" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  ];

  return (
    <footer className="bg-gradient-to-br from-dental-blue to-dental-mint text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-dental-blue font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold font-inter">Hardik Dental</span>
            </Link>
              <p className="text-dental-blue-light mb-6 leading-relaxed">
                Your trusted dental care provider for over 10 years. We're committed to helping you achieve 
                and maintain a healthy, beautiful smile through exceptional dental care.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-dental-blue transition-all duration-300"
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 font-inter">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-dental-blue-light hover:text-white transition-colors duration-300 flex items-center space-x-2"
                    >
                      <span>•</span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to="/booking">
                  <Button variant="dental-outline" size="lg" className="font-inter bg-white/10 border-white text-white hover:bg-white hover:text-dental-blue">
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-6 font-inter">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      to={service.href}
                      className="text-dental-blue-light hover:text-white transition-colors duration-300 flex items-center space-x-2"
                    >
                      <span>•</span>
                      <span>{service.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 font-inter">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-dental-blue-light mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-dental-blue-light">
                      123 Smile Street<br />
                      Downtown District<br />
                      City, ST 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-dental-blue-light flex-shrink-0" />
                  <div>
                    <button 
                      onClick={() => handlePhoneCall("8080950921")}
                      className="text-dental-blue-light hover:text-white transition-colors"
                    >
                      Main: (555) 123-4567
                    </button>
                    <br />
                    <button 
                      onClick={() => handlePhoneCall("8080950921")}
                      className="text-dental-blue-light hover:text-white transition-colors"
                    >
                      Emergency: (555) 123-4568
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-dental-blue-light flex-shrink-0" />
                  <button 
                    onClick={() => handleEmail("info@smilecare.com")}
                    className="text-dental-blue-light hover:text-white transition-colors"
                  >
                    info@smilecare.com
                  </button>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-dental-blue-light mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-dental-blue-light">Mon-Fri: 8AM-6PM</p>
                    <p className="text-dental-blue-light">Sat: 9AM-3PM</p>
                    <p className="text-dental-blue-light">Sun: Emergency Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-dental-blue-light text-sm">
              © {new Date().getFullYear()} Hardik Dental. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-dental-blue-light hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-dental-blue-light hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-dental-blue-light hover:text-white transition-colors duration-300">
                HIPAA Notice
              </a>
            </div>
            
            <div className="flex items-center space-x-2 text-dental-blue-light text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for healthy smiles</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DentalFooter;
