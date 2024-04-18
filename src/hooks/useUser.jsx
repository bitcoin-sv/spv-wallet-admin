import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import { useCredentials, CredTypeAdmin, CredTypeXPriv, CredTypeAccessKey } from './useCredentials';
import { createContext, useContext, useMemo } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { cred, type, server } = useCredentials();

  const spvWalletClient = useMemo(() => {
    if (!server) {
      return undefined;
    }
    const options = makeClientOptions(cred, type);
    if (!options) {
      return undefined;
    }
    return new SpvWalletClient(server, options, { level: 'warn' });
  }, [cred, server, type]);

  const contextValue = useMemo(() => {
    const logged = spvWalletClient != null;
    return {
      spvWalletClient,
      logged,
      admin: logged && type === CredTypeAdmin,
    };
  }, [spvWalletClient, type]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  return useContext(UserContext);
};

// creates a proper key object for SpvWalletClient constructor
// e.g { xPriv: cred} or { adminKey: cred } or { accessKey: cred }
const makeClientOptions = (cred, type) => {
  const clientOptionsKey = keyObjectMapper?.[type];
  return clientOptionsKey
    ? {
        [clientOptionsKey]: cred,
      }
    : undefined;
};

const keyObjectMapper = {
  [CredTypeAdmin]: 'adminKey',
  [CredTypeXPriv]: 'xPriv',
  [CredTypeAccessKey]: 'accessKey',
};
