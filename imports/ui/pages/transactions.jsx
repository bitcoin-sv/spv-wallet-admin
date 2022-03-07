import React, { useEffect, useState } from 'react';
import BuxClient from '@buxorg/js-buxclient';

import { Typography } from "@mui/material";
import { Alert } from "@mui/material";

import { DashboardLayout } from "../components/dashboard-layout";
import { useUser } from "../hooks/user";
import { TransactionsList } from "../components/transactions";

export const Transactions = () => {
  const { xPriv, xPub, accessKey, server, transportType } = useUser();

  const [ transactions, setTransactions ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const buxClient = new BuxClient(server, {
    transportType,
    xPriv,
    xPub,
    accessKey,
  });
  buxClient.SetSignRequest(true);

  useEffect(() => {
    setLoading(true);
    buxClient.GetTransactions({}, {}).
      then(txs => {
        setTransactions([...txs].sort((a,b) => {
          return a.created_at > b.created_at ? -1 : 1;
        }));
        setError('');
        setLoading(false);
      }).
      catch(e => {
        setError(e.message);
        setLoading(false);
      });
  },[]);

  return (
    <DashboardLayout>
      <Typography
        color="inherit"
        variant="h4"
      >
        Transactions
      </Typography>
      {loading
      ?
        <>Loading...</>
      :
        <>
          {!!error &&
          <Alert severity="error">{error}</Alert>
          }
          <TransactionsList transactions={transactions}/>
        </>
      }
    </DashboardLayout>
  );
};
