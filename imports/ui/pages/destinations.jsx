import React, { useEffect, useState } from 'react';
import BuxClient from '@buxorg/js-buxclient';

import { Alert, Typography } from "@mui/material";

import { DashboardLayout } from "../components/dashboard-layout";
import { useUser } from "../hooks/user";
import { DestinationsList } from "../components/destinations";

export const Destinations = () => {
  const { xPriv, server, transportType } = useUser();

  const [ destinations, setDestinations ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const buxClient = new BuxClient(server, {
    transportType: transportType,
    xPriv,
  });
  buxClient.SetSignRequest(true);

  useEffect(() => {
    setLoading(true);
    buxClient.GetDestinations({}).
      then(dests => {
        setDestinations([...dests].sort((a,b) => {
          return a.created_at > b.created_at ? -1 : 1;
        }));
        setError('');
        setLoading(false);
      }).
      catch(e => {
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
        Destinations
      </Typography>
      {loading
      ?
        <>Loading...</>
      :
        <>
          {!!error &&
          <Alert severity="error">{error}</Alert>
          }
          <DestinationsList destinations={destinations}/>
        </>
      }
    </DashboardLayout>
  );
};
