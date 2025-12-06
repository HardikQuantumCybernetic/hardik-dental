import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Shield, Clock, Award } from "lucide-react";
import LazyImage from "@/components/optimized/LazyImage";
import SEOHead from "@/components/seo/SEOHead";

const DentalHeroMemo = memo(() => {
  return (
    <>
      <SEOHead
        title="Professional Dental Care - Modern Dental Practice"
        description="Experience exceptional dental care with our state-of-the-art facility. Expert dentists, modern technology, and comprehensive dental services for your entire family."
        keywords="dental care, dentist, dental clinic, family dentist, cosmetic dentistry, dental implants, teeth cleaning"
        type="website"
      />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(217_91%_60%/0.1),_transparent)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Your
                  <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent ml-3">
                    Perfect Smile
                  </span>
                  <br />
                  Starts Here
                </h1>
                
                <p className="text-lg md:text-xl text-dental-gray max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience world-class dental care with our team of expert dentists. 
                  From routine cleanings to advanced cosmetic procedures, we're here to 
                  give you the confident smile you deserve.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-dental-blue to-dental-mint hover:from-dental-blue/90 hover:to-dental-mint/90 shadow-dental-button transition-all duration-300 transform hover:scale-105"
                  onClick={() => window.location.href = '/booking'}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-dental-blue text-dental-blue hover:bg-dental-blue hover:text-white transition-all duration-300"
                  onClick={() => window.location.href = '/services'}
                >
                  Learn More
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {[
                  { icon: Shield, text: "Licensed & Insured", color: "text-dental-blue" },
                  { icon: Clock, text: "Same Day Appointments", color: "text-dental-mint" },
                  { icon: Award, text: "Award Winning Care", color: "text-dental-blue" },
                  { icon: Calendar, text: "Flexible Scheduling", color: "text-dental-mint" }
                ].map((item, index) => (
                  <div key={index} className="text-center space-y-2 group">
                    <item.icon className={`w-8 h-8 mx-auto ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                    <p className="text-sm font-medium text-dental-gray group-hover:text-foreground transition-colors">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Section */}
            <div className="relative animate-scale-in">
              <div className="relative">
                <LazyImage
                  src="/dental-hero-main.jpg"
                  webpSrc="/dental-hero-main.webp"
                  alt="Modern dental office with comfortable patient chair and advanced equipment"
                  className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
                  placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlhOWE5YSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlbnRhbCBPZmZpY2U8L3RleHQ+Cjwvc3ZnPg=="
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg animate-[float_3s_ease-in-out_infinite] hidden lg:block">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-dental-gray">Available Today</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-dental-blue to-dental-mint text-white rounded-2xl p-4 shadow-lg animate-[float_3s_ease-in-out_infinite_1s] hidden lg:block">
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.9★</div>
                    <div className="text-sm opacity-90">Patient Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-dental-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-dental-blue rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    </>
  );
});

DentalHeroMemo.displayName = 'DentalHero';

export default DentalHeroMemo;