import {Role, SpvWalletClientExtended} from '@/contexts/SpvWalletContext.tsx';
import { AccessKeyWithSigning, AdminKey, SpvWalletClient, XprivWithSigning } from '@bsv/spv-wallet-js-client';
import logger from '@/logger/intex.ts';

export const createClient = async (role: Role, key: string) => {
  const serverUrl = window.localStorage.getItem('login.serverUrl') ?? '';

  let clientOptions: any = {};

  if (role === 'admin' && key.startsWith('xprv')) {
    clientOptions = { adminKey: key } as AdminKey;
  } else if (role === 'user') {
    if (key.startsWith('xprv')) {
      clientOptions = { xPriv: key } as XprivWithSigning;
    } else {
      clientOptions = { accessKey: key } as AccessKeyWithSigning;
    }
  }

  if (!clientOptions) {
    throw new Error('Invalid role or key format');
  }

  const client = new SpvWalletClient(serverUrl, clientOptions, { level: 'disabled' }) as SpvWalletClientExtended;

  try {
    if (role === 'admin') {
      await client.AdminGetStatus();
      client.role = "admin";
      return client;
    } else if (role === 'user') {
      await client.GetXPub();
      client.role = "user";
      return client;
    } else {
      return null
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ msg: error.message, stack: error.stack, err: error });
      return null
    } else {
      console.error('Unknown error', error);
      throw new Error('An unknown error occurred');
    }
  }
};
