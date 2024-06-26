import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DashboardLayout } from '../components/dashboard-layout';
import { Alert, Card } from '@mui/material';
import { AccessKeysList } from '../components/access-keys';
import { useQueryList } from '../hooks/useQueryList';
import PerfectScrollbar from 'react-perfect-scrollbar';
import logger from '../logger';
import { useUser } from '../hooks/useUser';

export const AccessKeys = () => {
  const { items, loading, error, setError, Pagination, setRefreshData } = useQueryList({
    modelFunction: 'GetAccessKeys',
  });

  const { spvWalletClient } = useUser();

  const [info, setInfo] = useState('');

  const handleRevokeAccessKey = function (accessKey) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Revoke access key?')) {
      spvWalletClient
        .RevokeAccessKey(accessKey.id)
        .then((r) => {
          setInfo(`Access key ${accessKey.id} revoked`);
          logger.info(`Access key ${accessKey.id} revoked`);
          setRefreshData(+new Date());
        })
        .catch((e) => {
          logger.error(e);
          setError(e.message);
        });
    }
  };

  return (
    <DashboardLayout>
      <Typography color="inherit" variant="h4">
        Access keys
        <span style={{ float: 'right' }}>
          <Button
            color="primary"
            onClick={async () => {
              const accessKey = await spvWalletClient.CreateAccessKey();
              setInfo(
                `New access key created!\n Your key is ${accessKey?.key}.\n Please make sure to save this key, it is not possible to give it out again.`,
              );
              setRefreshData(+new Date());
            }}
          >
            + add
          </Button>
        </span>
      </Typography>
      {info && <Alert severity="info">{info}</Alert>}
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {!!error && <Alert severity="error">{error}</Alert>}
          <Card>
            <PerfectScrollbar>
              <AccessKeysList items={items} handleRevokeAccessKey={handleRevokeAccessKey} />
            </PerfectScrollbar>
            <Pagination />
          </Card>
        </>
      )}
    </DashboardLayout>
  );
};
