import { createContext, useMemo, useState } from 'react';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';

export type Role = 'user' | 'admin' | null;

const initialServerUrl = 'config.serverUrl' || 'some default value';

const defaultValue = {
  serverUrl: initialServerUrl,
  // spvWalletClient: new SpvWalletClient(initialServerUrl, { xPriv: '' }, { level: 'disabled' }),
  spvWalletClient: {},
  // setSpvWalletClient: null,
};

export const SpvWalletContext = createContext(defaultValue);

export const SpvWalletProvider = ({ children }) => {
  // const [serverUrl, _] = useLocalStorage('login.serverUrl', 'config.serverUrl');
  const [serverUrl, setServerUrl] = useState(window.localStorage.getItem('login.serverUrl') ?? 'config.serverUrl');
  const [role, setRole] = useState<Role>(null);

  const [spvWalletClient, setSpvWalletClient] = useState({} as SpvWalletClient);

  const contextValue = useMemo(
    () => ({
      serverUrl,
      setServerUrl,
      spvWalletClient,
      setSpvWalletClient,
        role,
        setRole
    }),
    [serverUrl, spvWalletClient, setSpvWalletClient],
  );
  return <SpvWalletContext.Provider value={contextValue}>{children}</SpvWalletContext.Provider>;
};
