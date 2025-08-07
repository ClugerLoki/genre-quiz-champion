import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { migrateDataToFirebase, checkFirebaseData } from '@/utils/dataMigration';
import { Database, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const DataMigrationButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleMigration = async () => {
    setLoading(true);
    setStatus('idle');
    
    try {
      // First check existing data
      const dataCheck = await checkFirebaseData();
      
      if (dataCheck.questions > 0 && dataCheck.genres > 0) {
        toast({
          title: "Data Already Exists",
          description: `Found ${dataCheck.questions} questions and ${dataCheck.genres} genres in Firebase.`,
        });
        setStatus('success');
        setLoading(false);
        return;
      }

      // Perform migration
      const result = await migrateDataToFirebase();
      
      if (result.success) {
        toast({
          title: "Migration Successful",
          description: result.message,
        });
        setStatus('success');
      } else {
        toast({
          title: "Migration Failed",
          description: result.message,
          variant: "destructive"
        });
        setStatus('error');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration Error",
        description: "An unexpected error occurred during migration.",
        variant: "destructive"
      });
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (loading) return <Upload className="mr-2 h-4 w-4 animate-bounce" />;
    if (status === 'success') return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
    if (status === 'error') return <AlertCircle className="mr-2 h-4 w-4 text-red-500" />;
    return <Database className="mr-2 h-4 w-4" />;
  };

  const getButtonText = () => {
    if (loading) return 'Migrating...';
    if (status === 'success') return 'Migration Complete';
    if (status === 'error') return 'Migration Failed - Retry';
    return 'Migrate Data to Firebase';
  };

  return (
    <Button 
      onClick={handleMigration}
      disabled={loading || status === 'success'}
      variant={status === 'error' ? 'destructive' : 'default'}
      className="w-full"
    >
      {getIcon()}
      {getButtonText()}
    </Button>
  );
};

export default DataMigrationButton;