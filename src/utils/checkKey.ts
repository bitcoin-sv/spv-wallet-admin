import { Role } from '@/contexts/SpvWalletContext.tsx';
import { AccessKeyWithSigning, AdminKey, SpvWalletClient, XprivWithSigning } from '@bsv/spv-wallet-js-client';
import logger from '@/logger/intex.ts';

export const checkKey = async (role: Role, key: string) => {
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

  const checkClient = new SpvWalletClient(serverUrl, clientOptions, { level: 'disabled' });

  try {
    if (role === 'admin') {
      await checkClient.AdminGetStatus();
      return checkClient;
    } else if (role === 'user') {
      await checkClient.GetXPub();
      return checkClient;
    }
  } catch (error) {
    console.log('Error', error);
    logger.error({ msg: error.message, stack: error.stack, err: error });
  }
};
