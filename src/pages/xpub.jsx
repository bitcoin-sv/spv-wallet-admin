import React, { useEffect, useState } from 'react';

import { Alert, Typography } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { useUser } from '../hooks/useUser';
import { JsonView } from '../components/json-view';
import logger from '../logger';

export const XPub = () => {
  const { spvWalletClient } = useUser();

  const [xPubData, setXPubData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    spvWalletClient
      .GetXPub()
      .then((xPub) => {
        setXPubData(xPub);
        setError('');
        setLoading(false);
      })
      .catch((e) => {
        logger.error(e);
        setError(e.message);
        setLoading(false);
      });
  }, [spvWalletClient]);

  return (
    <DashboardLayout>
      <Typography color="inherit" variant="h4">
        xPub
      </Typography>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {!!error && <Alert severity="error">{error}</Alert>}
          {xPubData && <JsonView title="xPub" jsonData={xPubData} />}
        </>
      )}
    </DashboardLayout>
  );
};
