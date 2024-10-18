import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import logger from '@/logger';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components';

export const PageRefreshButton = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      // Wait for all queries invalidation (data refetching)
      // and a minimum delay of 0.5sec before proceeding to make sure the UI doesn't flicker
      await Promise.all([queryClient.invalidateQueries(), new Promise((resolve) => setTimeout(resolve, 500))]);
      toast.success('Data refreshed');
    } catch {
      logger.error('Failed to refresh');
      toast.error('Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button variant="ghost" className="ml-auto" disabled={isRefreshing} onClick={onRefreshClick}>
      <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
      Refresh
    </Button>
  );
};
