import { useConfig } from '@4chain-ag/react-configuration';
import { useEffect, useState } from 'react';

export const useServerUrl = () => {
  const { config } = useConfig();
  const [serverUrl, setServerUrl] = useState<string>('');

  useEffect(() => {
    setServerUrl(config.serverUrl);
  }, [config.serverUrl]);

  return {
    serverUrl,
    setServerUrl,
  };
};
