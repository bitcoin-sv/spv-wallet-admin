import { TRole } from '@/contexts';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import React, { createContext } from 'react';

export interface SpvWalletClientExtended extends SpvWalletClient {
  role?: TRole;
}

export interface SpvWalletContext {
  serverUrl: string;
  setServerUrl: React.Dispatch<React.SetStateAction<string>>;
  spvWalletClient: SpvWalletClientExtended | null;
  setSpvWalletClient: React.Dispatch<React.SetStateAction<SpvWalletClientExtended | null>>;
}

export const SpvWalletContext = createContext<SpvWalletContext | null>(null);
