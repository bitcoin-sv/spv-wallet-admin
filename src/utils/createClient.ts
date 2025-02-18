import { LoginType, Role, SpvWalletClientExtended } from '@/contexts';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';

export const createClient = async (role: Role, key: string, serverUrl: string, type?: LoginType) => {
  const client = newSPVWalletClient(role, key, serverUrl, type);

  //checks connection (serverURL) and authentication (key)
  //throws exception on failure
  if (role === Role.Admin) {
    await client.AdminGetStatus();
    client.role = Role.Admin;
    return client;
  }

  if (role === Role.User) {
    const userInfo = await client.GetUserInfo();
    client.role = Role.User;
    client.userId = userInfo?.id || null;
    return client;
  }

  throw new Error('Invalid role');
};

function newSPVWalletClient(role: Role, key: string, serverUrl: string, type?: LoginType): SpvWalletClientExtended {
  if (role === Role.Admin) {
    return new SpvWalletClient(serverUrl, { adminKey: key }, { level: 'disabled' });
  }

  if (role === Role.User) {
    if (type === LoginType.AccessKey) {
      return new SpvWalletClient(serverUrl, { accessKey: key }, { level: 'disabled' });
    }

    if (type === LoginType.Xprv) {
      return new SpvWalletClient(serverUrl, { xPriv: key }, { level: 'disabled' });
    }

    return new SpvWalletClient(serverUrl, { xPriv: key }, { level: 'disabled' });
  }

  throw new Error('Invalid key format');
}
