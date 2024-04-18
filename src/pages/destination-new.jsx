import React, { useCallback, useState } from 'react';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import QRCode from 'react-qr-code';

import { Alert, Box, Button, Typography } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { useUser } from '../hooks/user';
import { JsonView } from '../components/json-view';
import logger from '../logger';

export const DestinationNew = () => {
  const { spvWalletClient } = useUser();

  const [destination, setDestination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNewDestination = useCallback(() => {
    setLoading(true);
    spvWalletClient
      .NewDestination({})
      .then((d) => {
        setDestination(d);
        setError('');
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        logger.error(e);
        setLoading(false);
      });
  }, [spvWalletClient]);

  return (
    <DashboardLayout>
      <Typography color="inherit" variant="h4">
        New Destination
      </Typography>
      <Button
        onClick={() => {
          handleNewDestination();
        }}
      >
        Create new destination
      </Button>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {!!error && <Alert severity="error">{error}</Alert>}
          {destination && (
            <>
              <h2>SPV Wallet destination</h2>
              <JsonView jsonData={destination} />
              <Box display="flex" justifyContent="center">
                <QRCode value={`bitcoinsv:${destination.address}`} />
              </Box>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};
