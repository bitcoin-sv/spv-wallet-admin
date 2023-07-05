import {CacheProvider} from '@emotion/react';
import {CssBaseline} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';
import {CredentialsProvider} from "./hooks/use-credentials";
import {AppRouter} from "./routes";
import {theme} from './theme';
import {createEmotionCache} from './utils/create-emotion-cache';

const clientSideEmotionCache = createEmotionCache();

export const App = () => {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CredentialsProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
              <AppRouter />
          </ThemeProvider>
        </CredentialsProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
}
