import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useUser } from './hooks/user';
import NotFound from './pages/404';
import { AccessKeys } from './pages/access-keys';
import { AdminAccessKeys } from './pages/admin/access-keys';
import { AdminDestinations } from './pages/admin/destinations';
import { AdminPaymails } from './pages/admin/paymails';
import { AdminRegisterXPub } from './pages/admin/register-xpub';
import { AdminTransactionRecord } from './pages/admin/transaction-record';
import { AdminTransactions } from './pages/admin/transactions';
import { AdminUtxos } from './pages/admin/utxos';
import { AdminXPubs } from './pages/admin/xpubs';
import { Destination } from './pages/destination';
import { DestinationNew } from './pages/destination-new';
import { Destinations } from './pages/destinations';
import Login from './pages/login';
import { Transaction } from './pages/transaction';
import { TransactionNew } from './pages/transaction-new';
import { Transactions } from './pages/transactions';
import { XPub } from './pages/xpub';

export const AppRouter = () => {
  const { logged, admin } = useUser();

  if (!logged) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/xpub" name="xPub" element={<XPub />} />
        <Route exact path="/destination" name="Destination search" element={<Destination />} />
        <Route exact path="/destinations" name="Destinations" element={<Destinations />} />
        <Route exact path="/destination-new" name="New Destinations" element={<DestinationNew />} />
        <Route exact path="/transaction" name="Transaction search" element={<Transaction />} />
        <Route exact path="/transactions" name="Transactions" element={<Transactions />} />
        <Route exact path="/transaction-new" name="New Transactions" element={<TransactionNew />} />
        <Route exact path="/access-keys" name="Access Keys" element={<AccessKeys />} />
        {!admin ? (
          <Route exact path="/" name="xPub" element={<XPub />} />
        ) : (
          <Route exact path="/" name="Admin register xpub" element={<AdminRegisterXPub />} />
        )}
        <Route exact path="/admin/register-xpub" name="Admin register xpub" element={<AdminRegisterXPub />} />
        <Route exact path="/admin/access-keys" name="Admin access keys" element={<AdminAccessKeys />} />
        <Route exact path="/admin/destinations" name="Admin destinations" element={<AdminDestinations />} />
        <Route exact path="/admin/paymails" name="Admin paymails" element={<AdminPaymails />} />
        <Route
          exact
          path="/admin/transaction-record"
          name="Admin record transactions"
          element={<AdminTransactionRecord />}
        />
        <Route exact path="/admin/transactions" name="Admin transactions" element={<AdminTransactions />} />
        <Route exact path="/admin/utxos" name="Admin utxos" element={<AdminUtxos />} />
        <Route exact path="/admin/xpubs" name="Admin xPubs" element={<AdminXPubs />} />
        <Route path="/" name="404" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
