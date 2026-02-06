import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

const InstallPrompt = memo(() => {
  const { isInstallable, installApp } = useServiceWorker();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after a delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsVisible(false);
    }
  };

  if (!isVisible || !isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-right">
      <Card className="border-dental-blue-light shadow-dental-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-dental-blue to-dental-mint rounded-lg flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-sm font-semibold">Install App</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-dental-gray mb-4">
            Install DentalCare Pro for quick access to appointments and better offline experience.
          </p>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-dental-blue to-dental-mint hover:from-dental-blue/90 hover:to-dental-mint/90"
            >
              <Download className="w-4 h-4 mr-1" />
              Install
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="border-dental-blue-light"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

InstallPrompt.displayName = 'InstallPrompt';

export default InstallPrompt;