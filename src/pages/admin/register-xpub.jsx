import { HD } from '@bsv/sdk';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, TextField, Typography } from '@mui/material';

import { DashboardLayout } from '../../components/dashboard-layout';
import { useUser } from '../../hooks/useUser';
import logger from '../../logger';

export const AdminRegisterXPub = () => {
  const navigate = useNavigate();
  const { spvWalletClient, admin } = useUser();

  const [newXPub, setNewXPub] = useState('');
  const [xPrivInput, setXPrivInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!admin) {
      navigate('/');
    }
  }, [navigate, admin]);

  useEffect(() => {
    if (!xPrivInput) {
      return;
    }
    try {
      const xPrivHD = HD.fromString(xPrivInput);
      setNewXPub(xPrivHD.toPublic().toString());
      setXPrivInput('');
    } catch (e) {
      logger.error(e);
      setError(e.message);
    }
  }, [xPrivInput]);

  const handleRegisterXPub = async () => {
    setError('');
    if (!newXPub) {
      setError('No xPub to add');
      logger.info('No xPub to add');
      return;
    }
    if (!checkXPub(newXPub)) {
      setError('Wrong format of your xPub');
      return;
    }
    setLoading(true);
    try {
      await spvWalletClient.AdminNewXpub(newXPub);
      alert('XPub added');
      logger.info('XPub added');
      setNewXPub('');
    } catch (e) {
      logger.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Typography color="inherit" variant="h4">
        Register xPub
      </Typography>
      <Typography
        color="error"
        variant="subtitle1"
        style={{
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        Only register xPub's that are new or not registered with another server. If multiple servers are managing an
        xPub, the xPub state can get out of synch.
      </Typography>
      <TextField
        fullWidth
        label="xPriv"
        margin="normal"
        value={xPrivInput}
        onChange={(e) => setXPrivInput(e.target.value)}
        type="text"
        variant="outlined"
      />
      <Typography
        color="inherit"
        variant="subtitle2"
        style={{
          marginLeft: 20,
          marginRight: 20,
        }}
      >
        Paste an xPriv to convert to xPub. The xPriv will be converted and discarded.
      </Typography>
      <TextField
        fullWidth
        label="xPub"
        margin="normal"
        value={newXPub}
        onChange={(e) => setNewXPub(e.target.value)}
        type="text"
        variant="outlined"
      />
      <Button sx={{ mr: 1 }} onClick={handleRegisterXPub}>
        + Register xPub
      </Button>
      {loading ? <>Loading...</> : <>{!!error && <Alert severity="error">{error}</Alert>}</>}
    </DashboardLayout>
  );
};

const checkXPub = (xpub) => {
  try {
    HD.fromString(xpub);
    return true;
  } catch {
    return false;
  }
};
