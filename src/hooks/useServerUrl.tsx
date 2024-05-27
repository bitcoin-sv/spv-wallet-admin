import { useEffect, useState } from 'react';
import { useConfig } from '@4chain-ag/react-configuration';

export const useServerUrl = () => {
  const { config } = useConfig();
  const { localStorage } = window
  const storedUrl = localStorage.getItem('login.serverUrl');
  const [serverUrl, setServerUrl] = useState<string>(storedUrl ?? config.serverUrl);

  useEffect(() => {
    setServerUrl(config.serverUrl);
    localStorage.setItem('login.serverUrl', config.serverUrl);
  }, [config.serverUrl]);

  useEffect(() => {
    localStorage.setItem('login.serverUrl', serverUrl);
  }, [serverUrl]);

  return {
    serverUrl,
    setServerUrl,
  };
};
