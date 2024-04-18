import { SpvWalletClient } from '@bsv/spv-wallet-js-client';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { SeverityPill } from '../components/severity-pill';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useConfig } from '@4chain-ag/react-configuration';
import { CredTypeAccessKey, CredTypeAdmin, CredTypeXPriv, useCredentials } from '../hooks/useCredentials';
import logger from '../logger';

const Login = () => {
  const { config } = useConfig();
  const [loginKey, setLoginKey] = useState('');
  const [serverUrl, setServerUrl] = useLocalStorage('login.serverUrl', config.serverUrl);
  const [error, setError] = useState('');
  const { set: setCredentials } = useCredentials();

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (!loginKey || !(config.serverUrl || serverUrl)) {
      setError('Please set a server and an xPriv to connect');
      logger.warn('Please set a server and an xPriv to connect');
      return;
    }

    const currentServerUrl = config.serverUrl || serverUrl;

    // NOTE: the login procedure is as follows:
    // 1. If the loginKey fits the xpriv pattern, then try to login with it:
    // --- a. as xpriv
    // --- b. if it fails, as admin key
    // 2. If the login key does not fit the xpriv pattern, then try use loginKey as an access key

    if (loginKey.match(/^xprv/)) {
      try {
        const testerClient = new SpvWalletClient(currentServerUrl, { xPriv: loginKey }, { level: 'disabled' });
        await testerClient.GetXPub(); //should throw an error if the xpriv is invalid

        setCredentials(currentServerUrl, loginKey, CredTypeXPriv);
        return;
      } catch (e) {
        // check whether this is an admin only login
        try {
          const testerClient = new SpvWalletClient(currentServerUrl, { adminKey: loginKey }, { level: 'disabled' });
          await testerClient.AdminGetStatus(); //should throw an error if the admin key is invalid

          setCredentials(currentServerUrl, loginKey, CredTypeAdmin);
          return;
        } catch (e) {
          logger.error(e);
        }
      }
    }

    //if the login is not an xpriv nor an admin key, then it must be an access key (or invalid)
    try {
      const testerClient = new SpvWalletClient(currentServerUrl, { accessKey: loginKey }, { level: 'disabled' });
      await testerClient.GetXPub(); //should throw an error if the accessKey is invalid

      setCredentials(currentServerUrl, loginKey, CredTypeAccessKey);
      return;
    } catch (e) {
      setError('Please set a server and a valid key to connect');
      logger.error(e);
      return;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography color="textPrimary" variant="h4">
              {config.loginTitle || 'Sign in to a SPV Wallet'}
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {config.loginSubtitle || 'Sign in using your xPriv or access key'}
            </Typography>
          </Box>
          <Box>
            <img
              src="/svg/my-password.svg"
              alt="Login"
              style={{
                width: '100%',
                marginTop: '-35%',
                marginBottom: '-25%',
                zIndex: -1,
              }}
            />
          </Box>
          {!!config.serverUrl ? (
            !config.hideServerUrl && (
              <TextField
                fullWidth
                label="http"
                margin="dense"
                value={config.serverUrl}
                type="text"
                variant="outlined"
                disabled={true}
              />
            )
          ) : (
            <TextField
              fullWidth
              label="Server"
              margin="dense"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              type="text"
              variant="outlined"
            />
          )}
          <TextField
            fullWidth
            label="xPriv / access key"
            margin="dense"
            value={loginKey}
            onChange={(e) => setLoginKey(e.target.value)}
            type="text"
            variant="outlined"
          />
          {!!error && <SeverityPill color={'error'}>{error}</SeverityPill>}
          <Box sx={{ py: 2 }}>
            <Button color="primary" fullWidth size="large" type="submit" variant="contained">
              Sign In Now
            </Button>
          </Box>
          <Typography variant="subtitle2">
            No information is stored or sent to our servers. All actions are done in the client and the xPriv is only
            stored temporarily in memory.
          </Typography>
        </form>
      </Container>
    </Box>
  );
};

export default Login;
