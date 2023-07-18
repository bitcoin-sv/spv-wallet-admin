import { createContext, useContext, useEffect, useState } from "react";
import { loadConfigFromFile } from "../utils/load-config";

export const ConfigContext = createContext(undefined);
ConfigContext.displayName = "ConfigContext";

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    loginTitle: undefined,
    loginSubtitle: undefined,
    transportType: undefined,
    serverUrl: undefined,
    hideServerUrl: undefined,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      const mergedConfig = await loadConfigFromFile();
      setConfig(mergedConfig);
    };

    fetchConfig().catch(console.error);
  }, []);

  const value = { config, setConfig };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useConfig must be use within ConfigProvider");
  }
  return ctx;
};
