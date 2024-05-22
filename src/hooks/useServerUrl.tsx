import { useEffect, useState } from 'react';
import { useConfig } from '@4chain-ag/react-configuration';

export const useServerUrl = () => {
  const { config } = useConfig();
  const [serverUrl, setServerUrl] = useState(config.serverUrl);

  useEffect(() => {
    setServerUrl(config.serverUrl);
    window.localStorage.setItem('login.serverUrl', config.serverUrl);
  }, [config.serverUrl]);

  useEffect(() => {
    window.localStorage.setItem('login.serverUrl', config.serverUrl);
  }, [serverUrl]);

  return {
    serverUrl,
    setServerUrl,
  };
};
