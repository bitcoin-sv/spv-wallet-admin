import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const CredTypeXPriv = 'cred-type-xpriv';
export const CredTypeAdmin = 'cred-type-admin';
export const CredTypeAccessKey = 'cred-type-accesskey';
export const CredTypeNone = 'cred-type-none';

const CredentialsContext = createContext(null);

export function CredentialsProvider({ children }) {
  const [type, setType] = useState(CredTypeNone);
  const [cred, setCred] = useState(null);
  const [server, setServer] = useState(null);

  const set = useCallback((newServer, newCred, newType) => {
    console.log('setting', newServer, newCred, newType);
    setServer(newServer);
    setType(newType);
    setCred(newCred);
  }, []);

  const clear = useCallback(() => {
    setServer(null);
    setType(CredTypeNone);
    setCred(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      server,
      cred,
      type,
      set,
      clear,
    }),
    [cred, server, set, clear, type],
  );

  return <CredentialsContext.Provider value={contextValue}>{children}</CredentialsContext.Provider>;
}

export const useCredentials = () => {
  return useContext(CredentialsContext);
};
