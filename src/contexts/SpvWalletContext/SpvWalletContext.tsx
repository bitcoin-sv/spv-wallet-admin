import { TRole } from '@/contexts';
import { SPVWalletAdminAPI, SPVWalletUserAPI } from '@bsv/spv-wallet-js-client';
import React, { createContext } from 'react';

export interface SpvWalletAdminClientExtended extends SPVWalletAdminAPI {
  role?: TRole;
  userId?: string | null;
}

export interface SpvWalletUserClientExtended extends SPVWalletUserAPI {
  role?: TRole;
  userId?: string | null;
}

export interface SpvWalletContext {
  serverUrl: string;
  setServerUrl: React.Dispatch<React.SetStateAction<string>>;
  spvWalletClient: SpvWalletAdminClientExtended | SpvWalletUserClientExtended | null;
  setSpvWalletClient: React.Dispatch<React.SetStateAction<SpvWalletAdminClientExtended | SpvWalletUserClientExtended | null>>;
}

export const SpvWalletContext = createContext<SpvWalletContext | null>(null);
