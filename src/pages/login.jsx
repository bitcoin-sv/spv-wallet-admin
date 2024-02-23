import { SpvWalletClient} from "@bsv/spv-wallet-js-client";
import {Box, Button, Container, Select, TextField, Typography} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import bsv from "bsv";
import React, {useState} from 'react';
import {SeverityPill} from "../components/severity-pill";
import {useLocalStorage} from "../hooks/localstorage";
import {useConfig} from "@4chain-ag/react-configuration";
import {useModifyCredentials} from "../hooks/use-credentials";
import logger from "../logger";

const Login = () => {

  const { config } = useConfig();
  const [loginKey, setLoginKey] = useState('');
  const [transport, setTransport] = useLocalStorage('login.transport', config.transportType);
  const [serverUrl, setServerUrl] = useLocalStorage('login.serverUrl', config.serverUrl);
  const [error, setError] = useState('');
  const {setAccessKeyString, setAdminKey, setServer, setTransportType, setXPrivString} = useModifyCredentials();

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (loginKey && (config.serverUrl || serverUrl) && (config.transportType || transport)) {
      let spvWalletClient;
      let useTransport = transport || config.transportType;
      let useServerUrl = serverUrl || config.serverUrl
      try {
        if (config.transportType && config.serverUrl) {
          // use the hardcoded defaults for transport and server url
          useTransport = config.transportType;
          useServerUrl = config.serverUrl;
        }

        // try to make a connection and get the xpub
        spvWalletClient = new SpvWalletClient(useServerUrl, {
          transportType: useTransport,
          xPrivString: loginKey.match(/^xprv/) ? loginKey : '',
          accessKeyString: loginKey.match(/^[^xp]/) ? loginKey : '',
          signRequest: true,
        });
        await spvWalletClient.GetXPub();

        if (loginKey.match(/^xprv/)) {
          bsv.HDPrivateKey.fromString(loginKey);
          setXPrivString(loginKey);
        } else {
          bsv.PrivateKey.fromString(loginKey);
          setAccessKeyString(loginKey);
        }
        setServer(useServerUrl);
        setTransportType(useTransport);
      } catch (e) {
        // check whether this is an admin only login
        try {
          if (loginKey.match(/^xprv/)) {
            spvWalletClient.SetAdminKey(loginKey);
            const admin = await spvWalletClient.AdminGetStatus();
            if (admin === true) {
              setAdminKey(loginKey);
              setServer(useServerUrl);
              setTransportType(useTransport);
            }
          }
          return
        } catch (e) {
          logger.error(e)
        }

        logger.error(e)
        setError(e.reason || e.message);
      }
    } else {
      setError("Please set a server and an xPriv to connect");
      logger.warn("Please set a server and an xPriv to connect")
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
          <Box sx={{my: 3}}>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {config.loginTitle || "Sign in to a SPV Wallet"}
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              {config.loginSubtitle || "Sign in using your xPriv or access key"}
            </Typography>
          </Box>
          <Box>
            <img
              src="/svg/my-password.svg"
              alt="Login"
              style={{
                width: "100%",
                marginTop: '-35%',
                marginBottom: '-25%',
                zIndex: -1
              }}
            />
          </Box>
          {!!(config.transportType && config.serverUrl)
            ?
            (!config.hideServerUrl &&
              <>
                <TextField
                  fullWidth
                  label={config.transportType}
                  margin="dense"
                  value={config.serverUrl}
                  type="text"
                  variant="outlined"
                  disabled={true}
                />
              </>
            )
            :
            <>
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
            </>
          }
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
          <Box sx={{py: 2}}>
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
