import { TRole } from './AuthContext';

import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import React, { createContext, useContext, useMemo, useState } from 'react';

import { useServerUrl } from '@/hooks/useServerUrl.tsx';

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
    [serverUrl, spvWalletClient, setSpvWalletClient],
  );
  return <SpvWalletContext.Provider value={contextValue}>{children}</SpvWalletContext.Provider>;
};

export const useSpvWalletClient = () => {
  const spvWalletClient = useContext(SpvWalletContext);

  if (!spvWalletClient) {
    throw new Error('useSpvWalletClient must be used within a SpvWalletProvider');
  }
  return spvWalletClient;
};
