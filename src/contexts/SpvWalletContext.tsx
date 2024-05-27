import React, { createContext, useMemo, useState } from 'react';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import { useServerUrl } from '@/hooks/useServerUrl.tsx';

export type Role = 'user' | 'admin' | null;

export interface SpvWalletClientExtended extends SpvWalletClient {
  role?: Role;
}

export interface SpvWalletContextType {
  serverUrl: string;
  setServerUrl: React.Dispatch<React.SetStateAction<string>>;
  spvWalletClient: SpvWalletClientExtended | null;
  setSpvWalletClient: React.Dispatch<React.SetStateAction<SpvWalletClientExtended | null>>;
  userRole: Role;
  setUserRole: React.Dispatch<React.SetStateAction<Role>>;
}

export const SpvWalletContext = createContext<SpvWalletContextType | null>(null);

export const SpvWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { serverUrl, setServerUrl } = useServerUrl();
  const [userRole, setUserRole] = useState<Role | null>(null);

  const [spvWalletClient, setSpvWalletClient] = useState<SpvWalletClientExtended | null>(null);

  const isAuthenticated = !!spvWalletClient;

  const contextValue = useMemo(
    () => ({
      serverUrl,
      setServerUrl,
      spvWalletClient,
      setSpvWalletClient,
      userRole,
      setUserRole,
      isAuthenticated
    }),
    [serverUrl, spvWalletClient, setSpvWalletClient],
  );
  return <SpvWalletContext.Provider value={contextValue}>{children}</SpvWalletContext.Provider>;
};
