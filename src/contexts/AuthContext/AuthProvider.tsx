import React, { useState } from 'react';
import { AuthContext, Role } from '@/contexts';
import { useStore } from '@tanstack/react-store';
import { clientStore } from '@/store/clientStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const adminClient = useStore(clientStore, (state) => state.adminClient);
  const userClient = useStore(clientStore, (state) => state.userClient);
  const [loginKey, setLoginKey] = useState<string>('');

  const isAuthenticated = !!(adminClient || userClient);
  const isAdmin = isAuthenticated && adminClient?.role === Role.Admin;
  const isUser = isAuthenticated && userClient?.role === Role.User;

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthenticated, loginKey, setLoginKey, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};
