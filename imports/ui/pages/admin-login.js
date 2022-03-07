import bsv from "bsv";
import React, { useState } from 'react';

import { Box, Button, Container, Select, TextField, Typography } from '@mui/material';

import { setAdminKey } from "../hooks/user";
import { SeverityPill } from "../components/severity-pill";

const AdminLogin = () => {

  const [ xPriv, setXPriv ] = useState('');
  const [ error, setError ] = useState('');

  const handleSubmit = function(e) {
    e.preventDefault();
    if (xPriv) {
      try {
        const key = bsv.HDPrivateKey.fromString(xPriv);
        setAdminKey(xPriv);
      } catch (e) {
        setError(e.reason || e.message);
      }
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
              Set admin key
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="xPriv"
            margin="normal"
            value={xPriv}
            onChange={(e) => setXPriv(e.target.value)}
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
              Set key
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default AdminLogin;
