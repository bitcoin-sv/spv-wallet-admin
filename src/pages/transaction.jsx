import bsv from 'bsv';
import React, { useEffect, useState, useMemo } from 'react';

import { Alert, TextField, Typography } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { useUser } from '../hooks/useUser';
import { useLocation } from 'react-router-dom';
import { JsonView } from '../components/json-view';
import logger from '../logger';

export const Transaction = () => {
  const { spvWalletClient } = useUser();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [txId, setTxId] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tx_id = params.get('tx_id');
    if (tx_id) {
      setTxId(tx_id);
    }
  }, [params]);

  useEffect(() => {
    if (txId) {
      setLoading(true);
      spvWalletClient
        .GetTransaction(txId.trim())
        .then((tx) => {
          setTransaction(tx);
          setError('');
          setLoading(false);
        })
        .catch((e) => {
          setTransaction(null);
          logger.error(e);
          setError(e.message);
          setLoading(false);
        });
    }
  }, [spvWalletClient, txId]);

  return (
    <DashboardLayout>
      <Typography color="inherit" variant="h4">
        Transaction
      </Typography>
      <TextField
        fullWidth
        label="Transaction ID"
        margin="normal"
        value={txId}
        onChange={(e) => setTxId(e.target.value)}
        type="text"
        variant="outlined"
      />
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {!!error && <Alert severity="error">{error}</Alert>}
          {txId && transaction && (
            <>
              <h2>SPV Wallet transaction</h2>
              <JsonView jsonData={transaction} />
              <h2>Bitcoin transaction</h2>
              <JsonView jsonData={new bsv.Transaction(transaction.hex).toObject()} />
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};
