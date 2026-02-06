import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFeedback } from "@/hooks/useSupabaseExtended";

export const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();
  const { addFeedback } = useFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both first and last name.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in subject and message fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addFeedback({
        patient_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        patient_email: formData.email.trim(),
        patient_id: null,
        message: `Subject: ${formData.subject.trim()}\nPhone: ${formData.phone.trim() || 'Not provided'}\n\nMessage:\n${formData.message.trim()}`,
        rating: 5,
        category: 'contact',
        status: 'new'
      });

      setIsSubmitted(true);
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-dental-card border-dental-blue-light animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-dental-blue to-dental-mint text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold font-inter flex items-center space-x-2">
          <Send className="w-6 h-6" />
          <span>Send Us a Message</span>
        </CardTitle>
        <CardDescription className="text-dental-blue-light">
          We'll respond to your inquiry within 24 hours
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactFirstName" className="text-dental-blue font-medium">
                  First Name *
                </Label>
                <Input 
                  id="contactFirstName" 
                  required 
                  className="border-dental-blue-light focus:border-dental-blue"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactLastName" className="text-dental-blue font-medium">
                  Last Name *
                </Label>
                <Input 
                  id="contactLastName" 
                  required 
                  className="border-dental-blue-light focus:border-dental-blue"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-dental-blue font-medium">
                  Email Address *
                </Label>
                <Input 
                  id="contactEmail" 
                  type="email" 
                  required 
                  className="border-dental-blue-light focus:border-dental-blue"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-dental-blue font-medium">
                  Phone Number
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dental-blue-light bg-muted text-muted-foreground text-sm">
                    +91
                  </span>
                  <Input 
                    id="contactPhone" 
                    type="tel" 
                    className="border-dental-blue-light focus:border-dental-blue rounded-l-none"
                    placeholder="9876543210"
                    value={formData.phone.replace(/^\+91/, '')}
                    onChange={(e) => setFormData({...formData, phone: `+91${e.target.value.replace(/^\+91/, '')}`})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactSubject" className="text-dental-blue font-medium">
                Subject *
              </Label>
              <Input 
                id="contactSubject" 
                required 
                className="border-dental-blue-light focus:border-dental-blue"
                placeholder="What is your inquiry about?"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactMessage" className="text-dental-blue font-medium">
                Message *
              </Label>
              <Textarea 
                id="contactMessage" 
                required 
                className="border-dental-blue-light focus:border-dental-blue"
                placeholder="Please describe your question or concern..."
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <div className="text-center pt-4">
              <Button type="submit" variant="dental" size="xl" className="font-inter w-full md:w-auto">
                <Send className="w-5 h-5" />
                Send Message
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2 font-inter">
              Message Sent Successfully!
            </h3>
            <p className="text-dental-gray">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
