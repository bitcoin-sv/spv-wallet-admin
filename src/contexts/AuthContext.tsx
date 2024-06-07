import React, { createContext, useContext } from 'react';
import { useSpvWalletClient } from '@/contexts/SpvWalletContext.tsx';

export const enum Role {
  Admin = 'admin',
  User = 'user',
}

export type TRole = Role | null | undefined;

export interface AuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { spvWalletClient } = useSpvWalletClient();
  const isAuthenticated = !!spvWalletClient;
  const isAdmin = isAuthenticated && spvWalletClient?.role === Role.Admin;

  return <AuthContext.Provider value={{ isAdmin, isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
