import { clientStore } from '@/store/clientStore.ts';
import { useStore } from '@tanstack/react-store';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useSharedConfig() {
  const userClient = useStore(clientStore, (state) => state.userClient || state.adminClient);
  if (!userClient) {
    throw new Error('Client is not initialized');
  }

  const { data: sharedConfig } = useSuspenseQuery({
    queryKey: ['sharedConfig'],
    queryFn: async () => {
      return await userClient.sharedConfig();
    },
  });

  return sharedConfig;
}

export function useSupportedDomains() {
  const { paymailDomains } = useSharedConfig();

  return useMemo(() => {
    return paymailDomains.filter((domain) => domain !== 'localhost');
  }, []);
}
