import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import Dashboard from './pages/dashboard';
import { createEmotionCache } from './utils/create-emotion-cache';
import { theme } from './theme';
import { useUser } from "./hooks/user";

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
              <Switch>
                <Route exact path="/" name="Home">
                  <Dashboard/>
                </Route>
                <Route exact path="/xpub" name="xPub">
                  <XPub/>
                </Route>
                <Route exact path="/destination" name="Destination search">
                  <Destination/>
                </Route>
                <Route exact path="/destinations" name="Destinations">
                  <Destinations/>
                </Route>
                <Route exact path="/destination-new" name="New Destinations">
                  <DestinationNew/>
                </Route>
                <Route exact path="/transaction" name="Transaction search">
                  <Transaction/>
                </Route>
                <Route exact path="/transactions" name="Transactions">
                  <Transactions/>
                </Route>
                <Route exact path="/transaction-new" name="New Transactions">
                  <TransactionNew/>
                </Route>
                <Route exact path="/access-keys" name="Access Keys">
                  <AccessKeys/>
                </Route>
                <Route path="/" name="404">
                  <NotFound/>
                </Route>
              </Switch>
            </BrowserRouter>
            :
            <Login/>
          }
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
}
