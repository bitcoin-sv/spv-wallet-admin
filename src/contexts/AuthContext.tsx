import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SpvWalletClientExtended, SpvWalletContext, SpvWalletContextType } from '@/contexts/SpvWalletContext.tsx';

export const enum Role {
  Admin = 'admin',
  User = 'user',
}

export type TRole = Role | null | undefined;

export interface AuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (client: SpvWalletClientExtended) => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { spvWalletClient } = useContext(SpvWalletContext) as SpvWalletContextType;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(!!spvWalletClient);
    setIsAdmin(isAuthenticated && spvWalletClient?.role === Role.Admin);
  }, [spvWalletClient, spvWalletClient?.role]);

  const login = useCallback(
    (client: SpvWalletClientExtended) => {
      if (client) {
        setIsAuthenticated(true);

        if (client?.role === Role.Admin) {
          setIsAdmin(true);
        }
      }
    },
    [spvWalletClient],
  );

  const logout = useCallback(
    (client: SpvWalletClientExtended) => {
      if (client) {
        setIsAuthenticated(false);

        setIsAdmin(true);
      }
    },
    [spvWalletClient],
  );

  return <AuthContext.Provider value={{ isAdmin, isAuthenticated, login }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
