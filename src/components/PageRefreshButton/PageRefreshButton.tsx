import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import logger from '@/logger';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components';

export const PageRefreshButton = () => {
  const refreshButtonRef = useRef<HTMLButtonElement>(null);

  return <RefreshButtonComponent ref={refreshButtonRef} />;
};

export const RefreshButtonComponent = forwardRef<HTMLButtonElement>((_, ref) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [catchEye, setCatchEye] = useState(false);

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

  const catchUserEye = (elem: HTMLButtonElement) => {
    elem.scrollIntoView({ behavior: 'smooth' });
    setCatchEye(true);
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
    setTimeout(() => setCatchEye(false), 5000);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault(); // Recommended by MDN
      event.returnValue = true; // Included for legacy support, e.g. Chrome/Edge < 119

      onRefreshClick().then(() => {
        if (ref && 'current' in ref && ref.current) {
          catchUserEye(ref.current);
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [ref]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn('ml-auto', catchEye && 'animate-pulse bg-violet-400 ')}
      disabled={isRefreshing}
      onClick={onRefreshClick}
    >
      <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
      Refresh
    </Button>
  );
});
