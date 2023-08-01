import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import { CredentialsProvider } from "./hooks/use-credentials";
import { AppRouter } from "./routes";
import { theme } from "./theme";
import { createEmotionCache } from "./utils/create-emotion-cache";
import { ConfigProvider } from "@4chain-ag/react-configuration";

const clientSideEmotionCache = createEmotionCache();

export const App = () => {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ConfigProvider>
          <CredentialsProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppRouter />
            </ThemeProvider>
          </CredentialsProvider>
        </ConfigProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};
