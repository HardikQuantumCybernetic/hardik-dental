import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, CheckCircle, Clock, Users, AlertCircle } from 'lucide-react';

interface QuickInfoItem {
  text: string;
  icon?: 'check' | 'clock' | 'users' | 'alert' | 'info';
}

interface QuickInfoCardProps {
  title?: string;
  items: QuickInfoItem[];
  className?: string;
}

const iconMap = {
  check: CheckCircle,
  clock: Clock,
  users: Users,
  alert: AlertCircle,
  info: Info,
};

const QuickInfoCard: React.FC<QuickInfoCardProps> = ({ 
  title = "Quick Info", 
  items, 
  className = "" 
}) => {
  return (
    <Card className={`border-l-4 border-l-dental-blue bg-gradient-to-r from-dental-blue/5 to-transparent ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-dental-blue text-lg">
          <Info className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon || 'info'];
            return (
              <li key={index} className="flex items-start gap-3 text-sm text-dental-gray">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-dental-accent" />
                <span>{item.text}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default QuickInfoCard;