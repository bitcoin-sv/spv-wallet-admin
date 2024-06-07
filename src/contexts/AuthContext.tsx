import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SpvWalletClientExtended, useSpvWalletClient } from '@/contexts/SpvWalletContext.tsx';
import { getShortXprv } from '@/utils/getShortXprv.ts';

export const enum Role {
  Admin = 'admin',
  User = 'user',
}

export type TRole = Role | null | undefined;

export interface AuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (client: SpvWalletClientExtended, key: string) => void;
  logout: () => void;
  loginKey: string;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { spvWalletClient, setSpvWalletClient } = useSpvWalletClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loginKey, setLoginKey] = useState<string>('');

  useEffect(() => {
    setIsAuthenticated(!!spvWalletClient);
    setIsAdmin(isAuthenticated && spvWalletClient?.role === Role.Admin);
  }, [spvWalletClient, spvWalletClient?.role]);

  const login = useCallback(
    (client: SpvWalletClientExtended, key: string) => {
      if (client) {
        setIsAuthenticated(true);
        const shortenedKey = getShortXprv(key);
        setLoginKey(shortenedKey);

        if (client?.role === Role.Admin) {
          setIsAdmin(true);
        }
      }
    },
    [spvWalletClient],
  );

  const logout = useCallback(() => {
    setSpvWalletClient(null);
    setIsAuthenticated(false);

    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthenticated, login, logout, loginKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
