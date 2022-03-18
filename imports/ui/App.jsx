import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { createEmotionCache } from './utils/create-emotion-cache';
import { theme } from './theme';
import { useUser } from "./hooks/user";

import Dashboard from './pages/dashboard';
import Login from "./pages/login";
import { Transactions } from "./pages/transactions";
import NotFound from "./pages/404";
import { Transaction } from "./pages/transaction";
import { XPub } from "./pages/xpub";
import { AccessKeys } from "./pages/access-keys";
import { Destinations } from "./pages/destinations";
import { Destination } from "./pages/destination";
import { DestinationNew } from "./pages/destination-new";
import { TransactionNew } from "./pages/transaction-new";

const clientSideEmotionCache = createEmotionCache();

export const App = () => {
  const user = useUser();

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          {(!!user.xPub || !!user.accessKeyString)
            ?
            <BrowserRouter>
              <Routes>
                <Route exact path="/" name="Home" element={<Dashboard/>} />
                <Route exact path="/xpub" name="xPub" element={<XPub/>} />
                <Route exact path="/destination" name="Destination search" element={<Destination/>} />
                <Route exact path="/destinations" name="Destinations" element={<Destinations/>} />
                <Route exact path="/destination-new" name="New Destinations" element={<DestinationNew/>} />
                <Route exact path="/transaction" name="Transaction search" element={<Transaction/>} />
                <Route exact path="/transactions" name="Transactions" element={<Transactions/>} />
                <Route exact path="/transaction-new" name="New Transactions" element={<TransactionNew/>} />
                <Route exact path="/access-keys" name="Access Keys" element={<AccessKeys/>} />
                <Route path="/" name="404" element={<NotFound/>} />
              </Routes>
            </BrowserRouter>
            :
            <Login/>
          }
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
}
