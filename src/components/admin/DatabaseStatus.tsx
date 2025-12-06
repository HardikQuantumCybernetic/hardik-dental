import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const checkConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection
      const { error } = await supabase.from('patients').select('*', { count: 'exact', head: true });
      
      if (error) {
        setIsConnected(false);
        toast({
          title: "Database Connection Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setIsConnected(true);
        toast({
          title: "Database Connected",
          description: "Successfully connected to Supabase database",
        });
      }
    } catch (err) {
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkTables = async () => {
    const tables = ['patients', 'appointments', 'treatments', 'practice_settings'];
    const status: Record<string, boolean> = {};
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table as any).select('*', { count: 'exact', head: true });
        status[table] = !error;
      } catch {
        status[table] = false;
      }
    }
    
    setTableStatus(status);
  };

  const createSampleData = async () => {
    try {
      // Add a sample patient
      const { error } = await supabase.from('patients').insert([
        {
          name: 'Test Patient',
          email: `test.patient.${Date.now()}@example.com`,
          phone: '(555) 123-4567',
          date_of_birth: '1990-01-01',
          address: '123 Test St, Test City, TS 12345',
          medical_history: 'Test medical history',
          insurance_info: 'Test Insurance',
          status: 'active'
        }
      ]);

      if (error) throw error;

      toast({
        title: "Sample Data Created",
        description: "Test patient added successfully",
      });
      
      checkConnection();
    } catch (err: any) {
      toast({
        title: "Error Creating Sample Data",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    checkConnection();
    checkTables();
  }, []);

  return (
    <Card className="border-dental-blue-light">
      <CardHeader>
        <CardTitle className="text-dental-blue flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Database Status</span>
        </CardTitle>
        <CardDescription>Monitor Supabase connection and table status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isConnected === null ? (
              <RefreshCw className="w-5 h-5 text-dental-gray animate-spin" />
            ) : isConnected ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <span className="font-medium">
              {isConnected === null ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button 
            variant="dental-outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={loading}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Test Connection'}
          </Button>
        </div>

        {/* Table Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Table Status:</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(tableStatus).map(([table, exists]) => (
              <div key={table} className="flex items-center justify-between p-2 border border-dental-blue-light rounded">
                <span className="text-sm">{table}</span>
                <Badge variant={exists ? "default" : "destructive"}>
                  {exists ? 'OK' : 'Missing'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="dental" 
            size="sm" 
            onClick={createSampleData}
            disabled={!isConnected}
          >
            Add Sample Data
          </Button>
          <Button 
            variant="dental-outline" 
            size="sm" 
            onClick={checkTables}
          >
            Refresh Tables
          </Button>
        </div>

        {/* Setup Instructions */}
        {!isConnected && (
          <div className="p-4 bg-dental-blue-light rounded-lg">
            <h4 className="font-medium text-dental-blue mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-dental-gray space-y-1 list-decimal list-inside">
              <li>Copy the SQL schema from docs/supabase-schema.sql</li>
              <li>Run it in your Supabase SQL Editor</li>
              <li>Ensure Row Level Security is properly configured</li>
              <li>Test the connection again</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseStatus;