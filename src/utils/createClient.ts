import { SpvWalletClientExtended } from '@/contexts/SpvWalletContext.tsx';
import { AccessKeyWithSigning, AdminKey, SpvWalletClient, XprivWithSigning } from '@bsv/spv-wallet-js-client';
import { Role } from '@/contexts/AuthContext.tsx';
import { errorWrapper } from '@/utils/errorWrapper.ts';

export const createClient = async (role: Role, key: string) => {
  const serverUrl = window.localStorage.getItem('login.serverUrl') ?? '';

  let clientOptions: any = {};

  if (role === Role.Admin && key.startsWith('xprv')) {
    clientOptions = { adminKey: key } as AdminKey;
  } else if (role === Role.User) {
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
    if (role === Role.Admin) {
      await client.AdminGetStatus();
      client.role = Role.Admin;
      return client;
    } else if (role === Role.User) {
      await client.GetXPub();
      client.role = Role.User;
      return client;
    } else {
      return client;
    }
  } catch (error) {
    errorWrapper(error);
    return client;
  }
};
