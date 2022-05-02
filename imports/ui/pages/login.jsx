import bsv from "bsv";
import React, { useState } from 'react';

import { Box, Button, Container, Select, TextField, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import { setAccessKeyString, setServer, setTransportType, setXPrivString } from "../hooks/user";
import { SeverityPill } from "../components/severity-pill";
import { useLocalStorage } from "../hooks/localstorage";
import { BuxClient } from "@buxorg/js-buxclient";

const Login = () => {

  const [ loginKey, setLoginKey ] = useState('');
  const [ transport, setTransport ] = useLocalStorage('login.transport', 'http');
  const [ serverUrl, setServerUrl ] = useLocalStorage('login.serverUrl', 'http://localhost:3003/v1');
  const [ error, setError ] = useState('');

  const handleSubmit = async function(e) {
    e.preventDefault();
    if (loginKey && serverUrl && transport) {
      try {
        // try to make a connection and get the xpub
        const buxClient = new BuxClient(serverUrl, {
          transportType: transport,
          xPrivString: loginKey.match(/^xprv/) ? loginKey : '',
          accessKeyString: loginKey.match(/^[^xp]/) ? loginKey : '',
          signRequest: true,
        });
        const xPub = await buxClient.GetXPub();

        if (loginKey.match(/^xprv/)) {
          const key = bsv.HDPrivateKey.fromString(loginKey);
          setXPrivString(loginKey);
        } else {
          const key = bsv.PrivateKey.fromString(loginKey);
          setAccessKeyString(loginKey);
        }
        setServer(serverUrl);
        setTransportType(transport);
      } catch (e) {
        console.error(e);
        setError(e.reason || e.message);
      }
    } else {
      setError("Please set a server and an xPriv to connect");
    }
  }

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Box sx={{ my: 3 }}>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              Sign in to a Bux server
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              Sign in using your xPriv or access key
            </Typography>
          </Box>
          <Select
            fullWidth
            label="Server transport"
            margin="dense"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            type="text"
            variant="outlined"
          >
            <MenuItem value="graphql">GraphQL</MenuItem>
            <MenuItem value="http">HTTP</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Server"
            margin="dense"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            type="text"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="xPriv / access key"
            margin="dense"
            value={loginKey}
            onChange={(e) => setLoginKey(e.target.value)}
            type="text"
            variant="outlined"
          />
          {!!error &&
            <SeverityPill color={"error"}>
              {error}
            </SeverityPill>
          }
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Sign In Now
            </Button>
          </Box>
          <Typography
            variant="subtitle2"
          >
            No information is stored or sent to our servers. All actions are done in the client and the xPriv is
            only stored temporarily in memory.
          </Typography>
        </form>
      </Container>
    </Box>
  );
};

export default Login;
