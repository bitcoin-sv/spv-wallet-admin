import { SpvWalletClientExtended } from '@/contexts/SpvWalletContext.tsx';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import { Role } from '@/contexts/AuthContext.tsx';
import logger from '@/logger';

export const createClient = async (role: Role, key: string) => {
  const serverUrl = window.localStorage.getItem('login.serverUrl') ?? '';

  let client: SpvWalletClientExtended;

  if (role === Role.Admin && key.startsWith('xprv')) {
    client = new SpvWalletClient(serverUrl, { adminKey: key }, { level: 'disabled' }) as SpvWalletClientExtended;
  } else if (role === Role.User) {
    if (key.startsWith('xprv')) {
      client = new SpvWalletClient(serverUrl, { xPriv: key }, { level: 'disabled' }) as SpvWalletClientExtended;
    } else {
      client = new SpvWalletClient(serverUrl, { accessKey: key }, { level: 'disabled' }) as SpvWalletClientExtended;
    }
  } else {
    throw new Error('Invalid role or key format');
  }

  try {
    if (role === 'admin') {
      await client.AdminGetStatus();
      client.role = Role.Admin;
      return client;
    } else if (role === 'user') {
      await client.GetXPub();
      client.role = Role.User;
      return client;
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ msg: error.message, stack: error.stack, err: error });
      return null;
    } else {
      logger.error({ err: error });
      throw new Error('An unknown error occurred');
    }
  }
};
