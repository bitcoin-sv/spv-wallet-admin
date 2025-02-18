import React, { useState } from 'react';
import { AuthContext, Role, useSpvWalletClient } from '@/contexts';

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
