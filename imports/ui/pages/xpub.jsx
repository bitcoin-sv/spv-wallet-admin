import bsv from 'bsv';
import React, { useEffect, useState } from 'react';
import BuxClient from '@buxorg/js-buxclient';

import { Alert, TextField, Typography } from "@mui/material";

import { DashboardLayout } from "../components/dashboard-layout";
import { useUser } from "../hooks/user";
import { JsonView } from "../components/json-view";

export const XPub = () => {
  const { xPriv, server, transportType } = useUser();

  const [ xPub, setXPub ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const buxClient = new BuxClient(server, {
    transportType: transportType,
    xPriv,
    signRequest: true,
  });
  buxClient.SetSignRequest(true);

  useEffect(() => {
    setLoading(true);
    buxClient.GetXPub().then(xPub => {
      setXPub(xPub);
      setError('');
      setLoading(false);
    }).catch(e => {
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
        xPub
      </Typography>
      {loading
      ?
        <>Loading...</>
      :
        <>
          {!!error &&
          <Alert severity="error">{error}</Alert>
          }
          {xPub &&
            <JsonView title="xPub" jsonData={xPub} />
          }
        </>
      }
    </DashboardLayout>
  );
};
