import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

const UpdatePrompt = memo(() => {
  const { updateAvailable, updateApp } = useServiceWorker();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (updateAvailable) {
      setIsVisible(true);
    }
  }, [updateAvailable]);

  const handleUpdate = () => {
    updateApp();
    setIsVisible(false);
  };

  if (!isVisible || !updateAvailable) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-slide-in-right">
      <Card className="border-dental-blue-light shadow-dental-card bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-dental-blue to-dental-mint rounded-lg flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-sm font-semibold">Update Available</CardTitle>
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
            A new version of DentalCare Pro is available with improvements and bug fixes.
          </p>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleUpdate}
              className="flex-1 bg-gradient-to-r from-dental-blue to-dental-mint hover:from-dental-blue/90 hover:to-dental-mint/90"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Update Now
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

UpdatePrompt.displayName = 'UpdatePrompt';

export default UpdatePrompt;