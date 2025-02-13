import { SpvWalletContext, SpvWalletAdminClientExtended, SpvWalletUserClientExtended, useServerUrl } from '@/contexts';
import { useStore } from '@tanstack/react-store';
import React, { useState, useMemo, useEffect } from 'react';
import { clientStore } from '@/store/clientStore';

export const SpvWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { serverUrl, setServerUrl } = useServerUrl();
  const [spvWalletClient, setSpvWalletClient] = useState<
    SpvWalletAdminClientExtended | SpvWalletUserClientExtended | null
  >(null);

  const adminClient = useStore(clientStore, (state) => state.adminClient);
  const userClient = useStore(clientStore, (state) => state.userClient);

  // Update spvWalletClient when store changes
  useEffect(() => {
    if (adminClient) {
      setSpvWalletClient(adminClient);
    } else if (userClient) {
      setSpvWalletClient(userClient);
    } else {
      setSpvWalletClient(null);
    }
  }, [adminClient, userClient]);

  const contextValue = useMemo(
    () => ({
      serverUrl,
      setServerUrl,
      spvWalletClient,
      setSpvWalletClient,
    }),
    [serverUrl, setServerUrl, spvWalletClient],
  );

  return <SpvWalletContext.Provider value={contextValue}>{children}</SpvWalletContext.Provider>;
};
