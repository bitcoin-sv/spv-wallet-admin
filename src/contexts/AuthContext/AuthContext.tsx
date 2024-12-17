import React, { createContext } from 'react';

export interface AuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  loginKey: string;
  setLoginKey: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContext | null>(null);
