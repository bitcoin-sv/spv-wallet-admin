import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DashboardLayout } from '../components/dashboard-layout';
import { Alert, Card } from '@mui/material';
import { useQueryList } from '../hooks/useQueryList';
import PerfectScrollbar from 'react-perfect-scrollbar';
import logger from '../logger';
import { useUser } from '../hooks/useUser';
import {ContactsList} from "../components/contacts";

export const Contacts = () => {
    const { items, loading, error, setError, Pagination, setRefreshData } = useQueryList({
        modelFunction: 'GetContacts',
    });

    const { spvWalletClient } = useUser();

    const [info, setInfo] = useState('');

    const handleRejectContact = function (contact) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Revoke contact?')) {
            spvWalletClient
                .RejectContact(contact.paymail)
                .then((r) => {
                    setInfo(`Contact ${contact.id} rejected`);
                    logger.info(`Contact ${contact.id} rejected`);
                    setRefreshData(+new Date());
                })
                .catch((e) => {
                    logger.error(e);
                    setError(e.message);
                });
        }
    };

    const handleAcceptContact = function (contact) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Accept contact?')) {
            spvWalletClient
                .AcceptContact(contact.paymail)
                .then((r) => {
                    setInfo(`Contact ${contact.id} accepted`);
                    logger.info(`Contact ${contact.id} accepted`);
                    setRefreshData(+new Date());
                })
                .catch((e) => {
                    logger.error(e);
                    setError(e.message);
                });
        }
    };

    const handleConfirmContact = function (contact) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Confirm contact? Be careful, you don\'t use TOTP to confirm identity')) {
            spvWalletClient
                .ConfirmContact(contact.paymail)
                .then((r) => {
                    setInfo(`Contact ${contact.id} confirmed`);
                    logger.info(`Contact ${contact.id} confirmed`);
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
                Contacts
            </Typography>
            {info && <Alert severity="info">{info}</Alert>}
            {loading ? (
                <>Loading...</>
            ) : (
                <>
                    {!!error && <Alert severity="error">{error}</Alert>}
                    <Card>
                        <PerfectScrollbar>
                            <ContactsList items={items} handleRejectContact={handleRejectContact} handleAcceptContact={handleAcceptContact} handleConfirmContact={handleConfirmContact}/>
                        </PerfectScrollbar>
                        <Pagination />
                    </Card>
                </>
            )}
        </DashboardLayout>
    );
};
