import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Users, 
  Heart, 
  Shield, 
  Clock, 
  Star,
  GraduationCap,
  Zap
} from "lucide-react";

const DentalAbout = () => {
  const stats = [
    { number: "10+", label: "Years Experience", icon: Clock },
    { number: "500+", label: "Happy Patients", icon: Users },
    { number: "5.0", label: "Average Rating", icon: Star },
    { number: "24/7", label: "Emergency Care", icon: Shield }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Lead Dentist & Practice Owner",
      specialization: "General & Cosmetic Dentistry",
      experience: "15+ years",
      education: "DDS from Harvard School of Dental Medicine"
    },
    {
      name: "Dr. Michael Chen",
      role: "Orthodontist",
      specialization: "Braces & Clear Aligners",
      experience: "12+ years",
      education: "Orthodontics Residency at UCSF"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Oral Surgeon",
      specialization: "Dental Implants & Extractions",
      experience: "10+ years",
      education: "Oral Surgery Residency at NYU"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Your comfort and satisfaction are our top priorities. We listen to your concerns and tailor treatments to your needs."
    },
    {
      icon: Zap,
      title: "Advanced Technology",
      description: "We use the latest dental technology and techniques to provide efficient, comfortable, and effective treatments."
    },
    {
      icon: Shield,
      title: "Safe & Sterile",
      description: "We maintain the highest standards of cleanliness and safety protocols to protect your health and well-being."
    },
    {
      icon: Award,
      title: "Excellence in Dentistry",
      description: "Our commitment to continuing education and professional development ensures you receive the best care possible."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-inter">
            About 
            <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent"> Hardik Dental</span>
          </h2>
          <p className="text-lg text-dental-gray max-w-3xl mx-auto leading-relaxed">
            For over a decade, we've been dedicated to providing exceptional dental care 
            with a gentle touch, advanced technology, and personalized treatment plans.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={stat.label} 
                className="text-center border-dental-blue-light hover:shadow-dental-card transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-dental-blue mb-2 font-inter font-black">{stat.number}</div>
                  <div className="text-dental-gray font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in">
            <h3 className="text-3xl font-bold text-foreground mb-6 font-inter">Our Story</h3>
            <div className="space-y-4 text-dental-gray leading-relaxed">
              <p>
                Hardik Dental was founded with a simple mission: to provide exceptional dental care 
                in a comfortable, welcoming environment. What started as a small practice has grown 
                into a comprehensive dental clinic serving hundreds of satisfied patients.
              </p>
              <p>
                Our team of experienced professionals is committed to staying at the forefront of 
                dental technology and techniques. We believe that everyone deserves a healthy, 
                beautiful smile, and we're here to make that a reality for you and your family.
              </p>
              <p>
                From routine cleanings to complex procedures, we approach every treatment with 
                precision, care, and attention to detail. Your comfort and satisfaction are 
                always our top priorities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                variant="dental" 
                size="lg" 
                className="font-inter cursor-pointer"
                onClick={() => {
                  document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Meet Our Team
              </Button>
              <Button 
                variant="dental-outline" 
                size="lg" 
                className="font-inter cursor-pointer"
                onClick={() => window.location.href = '/contact'}
              >
                Schedule a Tour
              </Button>
            </div>
          </div>
          
          <div className="animate-scale-in">
            <div className="bg-gradient-to-br from-dental-blue-light to-dental-mint-light rounded-3xl p-8 shadow-dental-card">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-dental-card mx-auto mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-dental-blue mb-4">Our Mission</h4>
                <p className="text-dental-gray leading-relaxed">
                  To provide compassionate, comprehensive dental care that improves the oral health 
                  and overall well-being of our patients while creating beautiful, confident smiles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12 font-inter">Our Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card 
                  key={value.title} 
                  className="text-center border-dental-blue-light hover:shadow-dental-card transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-dental-blue to-dental-mint rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-3 font-inter">{value.title}</h4>
                    <p className="text-dental-gray text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Meet Our Team */}
        <div id="team-section">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12 font-inter">Meet Our Expert Team</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card 
                key={member.name} 
                className="border-dental-blue-light hover:shadow-dental-card transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Avatar Placeholder */}
                  <div className="w-24 h-24 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-foreground mb-2 font-inter">{member.name}</h4>
                    <p className="text-dental-blue font-medium mb-2">{member.role}</p>
                    <p className="text-dental-gray text-sm mb-4">{member.specialization}</p>
                    
                    <div className="space-y-2 text-left bg-dental-blue-light rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-dental-blue" />
                        <span className="text-sm text-dental-gray">{member.experience}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-dental-blue" />
                        <span className="text-sm text-dental-gray">{member.education}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DentalAbout;