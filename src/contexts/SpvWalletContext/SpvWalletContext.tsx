import { TRole, useServerUrl } from '@/contexts';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import React, { createContext, useMemo, useState } from 'react';

export interface SpvWalletClientExtended extends SpvWalletClient {
  role?: TRole;
}

export interface SpvWalletContext {
  serverUrl: string;
  setServerUrl: React.Dispatch<React.SetStateAction<string>>;
  spvWalletClient: SpvWalletClientExtended | null;
  setSpvWalletClient: React.Dispatch<React.SetStateAction<SpvWalletClientExtended | null>>;
}

export const SpvWalletContext = createContext<SpvWalletContext | null>(null);

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
