import { LoginType, Role, SpvWalletAdminClientExtended, SpvWalletUserClientExtended } from '@/contexts';
import { SPVWalletAdminAPI, SPVWalletUserAPI} from '@bsv/spv-wallet-js-client';

export const createClient = async (role: Role, key: string, serverUrl: string, type?: LoginType) => {
  //checks connection (serverURL) and authentication (key)
  //throws exception on failure
  if (role === Role.Admin) {
    const client = newSPVWalletAdminClient(key, serverUrl)
    await client.status();
    client.role = Role.Admin;
    return client;
  }

  if (role === Role.User) {
    const client = newSPVWalletUserClient(key, serverUrl, type)
    const userInfo = await client.xPub();
    client.role = Role.User;
    client.userId = userInfo?.id || null;
    return client;
  }

  throw new Error('Invalid role');
};

function newSPVWalletAdminClient(key: string, serverUrl: string): SpvWalletAdminClientExtended {
  return new SPVWalletAdminAPI(serverUrl, { adminKey: key }, { level: 'disabled' });
}

function newSPVWalletUserClient(key: string, serverUrl: string, type?: LoginType): SpvWalletUserClientExtended {
  if (type === LoginType.AccessKey) {
    return new SPVWalletUserAPI(serverUrl, { accessKey: key }, { level: 'disabled' });
  }

  if (type === LoginType.Xprv) {
    return new SPVWalletUserAPI(serverUrl, { xPriv: key }, { level: 'disabled' });
  }
  throw new Error('Invalid key format');
}
