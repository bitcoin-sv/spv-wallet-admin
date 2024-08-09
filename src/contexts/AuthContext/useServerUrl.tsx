import { useConfig } from '@4chain-ag/react-configuration';
import { useEffect, useState } from 'react';

export const useServerUrl = () => {
  const { config } = useConfig();
  const { localStorage } = window;
  const storedUrl = localStorage.getItem('login.serverUrl');
  const [serverUrl, setServerUrl] = useState<string>('');

  useEffect(() => {
    setServerUrl(config.serverUrl);
    localStorage.setItem('login.serverUrl', config.serverUrl);
  }, [config.serverUrl]);

  useEffect(() => {
    if (storedUrl) {
      setServerUrl(storedUrl);
    }
  }, [storedUrl]);

  return {
    serverUrl,
    setServerUrl,
  };
};
