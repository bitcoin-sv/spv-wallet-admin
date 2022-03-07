import React, { useEffect, useState } from 'react';
import BuxClient from '@buxorg/js-buxclient';

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { DashboardLayout } from "../components/dashboard-layout";
import { useUser } from "../hooks/user";
import { Alert } from "@mui/material";
import { AccessKeysList } from "../components/access-keys";

export const AccessKeys = () => {
  const { xPriv, server, transportType } = useUser();

  const [ accessKeys, setAccessKeys ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');
  const [ info, setInfo ] = useState('');

  const [ refreshData, setRefreshData ] = useState(0);

  const buxClient = new BuxClient(server, {
    transportType: transportType,
    xPriv,
    signRequest: true,
  });

  useEffect(() => {
    setLoading(true);
    buxClient.GetAccessKeys({}).
      then(keys => {
        setAccessKeys([...keys].sort((a,b) => {
          return a.created_at > b.created_at ? -1 : 1;
        }));
        setError('');
        setLoading(false);
      }).
      catch(e => {
        setError(e.message);
        setLoading(false);
      });
  },[refreshData]);

  const handleRevokeAccessKey = function (accessKey) {
    if (confirm('Revoke access key?')) {
      buxClient.RevokeAccessKey(accessKey.id).then(r => {
        setInfo(`Access key ${accessKey.id} revoked`);
        setRefreshData(+new Date());
      }).catch(e => {
        setError(e.message);
      });
    }
  }

  return (
    <DashboardLayout>
      <Typography
        color="inherit"
        variant="h4"
      >
        Access keys
        <span style={{ float: 'right'}}>
          <Button
            color="primary"
            onClick={async () => {
              const accessKey = await buxClient.CreateAccessKey();
              setInfo(`New access key created!\n Your key is ${accessKey?.key}.\n Please make sure to save this key, it is not possible to give it out again.`);
              setRefreshData(+new Date());
            }}
          >
            + add
          </Button>
        </span>
      </Typography>
      {info &&
        <Alert severity="info">
          {info}
        </Alert>
      }
      {loading
      ?
        <>Loading...</>
      :
        <>
          {!!error &&
            <Alert severity="error">{error}</Alert>
          }
          <AccessKeysList
            accessKeys={accessKeys}
            handleRevokeAccessKey={handleRevokeAccessKey}
          />
        </>
      }
    </DashboardLayout>
  );
};
