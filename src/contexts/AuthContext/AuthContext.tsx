import React, { createContext, useState } from 'react';

import { Role, useSpvWalletClient } from '@/contexts';

export interface AuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  loginKey: string;
  setLoginKey: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContext | null>(null);

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
