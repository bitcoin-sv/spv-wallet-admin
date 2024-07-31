import React, { createContext, useContext, useState } from 'react';

import { useSpvWalletClient } from '@/contexts';

// TODO [react-refresh]: only 1 export is allowed
// eslint-disable-next-line  react-refresh/only-export-components
export const enum Role {
  Admin = 'admin',
  User = 'user',
}

export type TRole = Role | null | undefined;

export interface AuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  loginKey: string;
  setLoginKey: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { spvWalletClient } = useSpvWalletClient();

  const [loginKey, setLoginKey] = useState<string>('');
  const isAuthenticated = !!spvWalletClient;

  const isAdmin = isAuthenticated && spvWalletClient?.role === Role.Admin;
  const isUser = isAuthenticated && spvWalletClient?.role === Role.User;

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthenticated, loginKey, setLoginKey, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// TODO [react-refresh]: only 1 export is allowed
// eslint-disable-next-line  react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
