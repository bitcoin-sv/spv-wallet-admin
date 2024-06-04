import React, { createContext, useMemo, useState } from 'react';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import { useServerUrl } from '@/hooks/useServerUrl.tsx';
import { TRole } from './AuthContext';

export interface SpvWalletClientExtended extends SpvWalletClient {
  role?: TRole;
}

export interface SpvWalletContextType {
  serverUrl: string;
  setServerUrl: React.Dispatch<React.SetStateAction<string>>;
  spvWalletClient: SpvWalletClientExtended | null;
  setSpvWalletClient: React.Dispatch<React.SetStateAction<SpvWalletClientExtended | null>>;
  userRole: TRole;
  setUserRole: React.Dispatch<React.SetStateAction<TRole>>;
}

export const SpvWalletContext = createContext<SpvWalletContextType | null>(null);

export const SpvWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { serverUrl, setServerUrl } = useServerUrl();
  const [userRole, setUserRole] = useState<TRole | null>(null);

  const [spvWalletClient, setSpvWalletClient] = useState<SpvWalletClientExtended | null>(null);

  const contextValue = useMemo(
    () => ({
      serverUrl,
      setServerUrl,
      spvWalletClient,
      setSpvWalletClient,
      userRole,
      setUserRole,
    }),
    [serverUrl, spvWalletClient, setSpvWalletClient],
  );
  return <SpvWalletContext.Provider value={contextValue}>{children}</SpvWalletContext.Provider>;
};
