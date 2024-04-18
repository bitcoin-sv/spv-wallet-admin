import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { CredentialsProvider } from './hooks/useCredentials';
import { UserProvider } from './hooks/user';
import { AppRouter } from './routes';
import { theme } from './theme';
import { createEmotionCache } from './utils/create-emotion-cache';
import { ConfigProvider } from '@4chain-ag/react-configuration';

const clientSideEmotionCache = createEmotionCache();

export const App = () => {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ConfigProvider>
        <CredentialsProvider>
          <UserProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppRouter />
            </ThemeProvider>
          </UserProvider>
        </CredentialsProvider>
      </ConfigProvider>
    </CacheProvider>
  );
};
