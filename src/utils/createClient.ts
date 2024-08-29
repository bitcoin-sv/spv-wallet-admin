import { Role, SpvWalletClientExtended } from '@/contexts';
import { errorWrapper } from '@/utils/errorWrapper.ts';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';

export const createClient = async (role: Role, key: string, serverUrl: string) => {
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
