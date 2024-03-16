import { SpvWalletClient} from "@bsv/spv-wallet-js-client";
import {Box, Button, Container, TextField, Typography} from '@mui/material';
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
  const [serverUrl, setServerUrl] = useLocalStorage('login.serverUrl', config.serverUrl);
  const [error, setError] = useState('');
  const {setAccessKeyString, setAdminKey, setServer, setXPrivString} = useModifyCredentials();

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (loginKey && (config.serverUrl || serverUrl)) {
      let spvWalletClient;
      let useServerUrl = serverUrl || config.serverUrl
      try {
        if (config.serverUrl) {
          // use the hardcoded defaults for server url
          useServerUrl = config.serverUrl;
        }

        // try to make a connection and get the xpub
        spvWalletClient = new SpvWalletClient(useServerUrl, {
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
      } catch (e) {
        // check whether this is an admin only login
        try {
          if (loginKey.match(/^xprv/)) {
            spvWalletClient.SetAdminKey(loginKey);
            const admin = await spvWalletClient.AdminGetStatus();
            if (admin === true) {
              setAdminKey(loginKey);
              setServer(useServerUrl);
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
          {!!config.serverUrl
            ?
            (!config.hideServerUrl &&
              <>
                <TextField
                  fullWidth
                  label={"http"}
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
