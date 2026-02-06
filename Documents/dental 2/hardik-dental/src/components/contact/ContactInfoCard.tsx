import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Navigation } from "lucide-react";

interface ContactInfoCardProps {
  icon: LucideIcon;
  title: string;
  details: string[];
  action: string;
  onClick: () => void;
  delay?: number;
}

export const ContactInfoCard = ({ icon: IconComponent, title, details, action, onClick, delay = 0 }: ContactInfoCardProps) => (
  <Card 
    className="border-dental-blue-light hover:shadow-dental-card transition-all duration-300 animate-scale-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-2 font-inter">{title}</h3>
          <div className="space-y-1">
            {details.map((detail, idx) => (
              <p key={idx} className="text-dental-gray">{detail}</p>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-3 text-dental-blue hover:text-white hover:bg-dental-blue p-0"
            onClick={onClick}
          >
            <div className="flex items-center space-x-2">
              <span>{action}</span>
              <Navigation className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
