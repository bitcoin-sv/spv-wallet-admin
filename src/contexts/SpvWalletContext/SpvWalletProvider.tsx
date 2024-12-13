import { SpvWalletClientExtended, SpvWalletContext, useServerUrl } from '@/contexts';
import React, { useMemo, useState } from 'react';

export const SpvWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { serverUrl, setServerUrl } = useServerUrl();

  const [spvWalletClient, setSpvWalletClient] = useState<SpvWalletClientExtended | null>(null);

  const contextValue = useMemo(
    () => ({
      serverUrl,
      setServerUrl,
      spvWalletClient,
      setSpvWalletClient,
    }),
    [serverUrl, setServerUrl, spvWalletClient, setSpvWalletClient],
  );
  return <SpvWalletContext.Provider value={contextValue}>{children}</SpvWalletContext.Provider>;
};
