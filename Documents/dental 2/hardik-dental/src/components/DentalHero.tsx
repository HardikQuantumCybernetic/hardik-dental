import { Button } from "@/components/ui/button";
import { Calendar, Star, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Scene3D from "./3d/Scene3D";
import { Suspense } from "react";

const DentalHero = () => {
  return (
    <section id="home" className="relative pt-16 animated-bg min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-dental-blue text-dental-blue" />
                ))}
              </div>
              <span className="text-dental-gray font-medium">5.0 • 500+ Happy Patients</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-inter leading-tight">
              Your Perfect
              <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent"> Smile </span>
              Starts Here
            </h1>
            
            <p className="text-lg text-dental-gray mb-8 leading-relaxed">
              Experience exceptional dental care with our team of expert dentists. 
              From routine checkups to advanced treatments, we're committed to your oral health and beautiful smile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/booking">
                <Button variant="dental" size="xl" className="font-inter group glow-effect pulse-glow">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Book Your Appointment
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="dental-outline" size="xl" className="font-inter color-shift">
                  Learn More About Us
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Enhanced Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center floating-animation">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-dental-card mb-2 mx-auto color-shift hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-dental-blue" />
                </div>
                <p className="text-sm text-dental-gray font-medium">Insurance<br />Accepted</p>
              </div>
              <div className="text-center floating-animation" style={{ animationDelay: '0.3s' }}>
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-dental-card mb-2 mx-auto color-shift hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-dental-mint" />
                </div>
                <p className="text-sm text-dental-gray font-medium">Award Winning<br />Practice</p>
              </div>
              <div className="text-center floating-animation" style={{ animationDelay: '0.6s' }}>
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-dental-card mb-2 mx-auto color-shift hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-dental-blue" />
                </div>
                <p className="text-sm text-dental-gray font-medium">Same Day<br />Appointments</p>
              </div>
              <div className="text-center floating-animation" style={{ animationDelay: '0.9s' }}>
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-dental-card mb-2 mx-auto color-shift hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 text-dental-mint" />
                </div>
                <p className="text-sm text-dental-gray font-medium">10+ Years<br />Experience</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Section */}
          <div className="animate-scale-in">
            <div className="relative">
              {/* Hero Content with 3D Animation */}
              <div className="bg-gradient-to-br from-dental-blue-light to-dental-mint-light rounded-3xl shadow-dental-card overflow-hidden mb-6 glow-effect">
                <div className="aspect-video bg-gradient-to-br from-dental-blue/10 to-dental-mint/10 flex items-center justify-center relative">
                  {/* 3D DNA Animation */}
                  <div className="absolute inset-0 z-10">
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-blue"></div>
                      </div>
                    }>
                      <Scene3D autoRotate={true} />
                    </Suspense>
                  </div>
                  
                  {/* Overlay Content */}
                  <div className="text-center p-8 relative z-20 bg-white/80 backdrop-blur-sm rounded-2xl m-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center mx-auto mb-4 shadow-dental-card floating-animation">
                      <span className="text-white text-xl font-bold">🧬</span>
                    </div>
                    <h3 className="text-lg font-bold text-dental-blue mb-2">Advanced Genetics</h3>
                    <p className="text-dental-gray text-xs">Personalized care based on your genetic profile</p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-dental-card p-4 floating-animation pulse-glow">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-dental-gray">Online Booking</span>
                </div>
              </div>
              
              
              {/* Additional decorative element */}
              <div className="absolute top-1/2 -left-12 w-24 h-24 opacity-20 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DentalHero;