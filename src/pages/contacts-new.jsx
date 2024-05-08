import bsv from 'bsv';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {Alert, Box, Button, TextField, Typography} from '@mui/material';
import {useUser} from "../hooks/useUser";
import logger from '../logger';
import {DashboardLayout} from "../components/dashboard-layout";

export const ContactNew = () => {
    const navigate = useNavigate();
    const { spvWalletClient, admin } = useUser();

    const [paymail, setPaymail] = useState('');
    const [fullName, setFullName] = useState('');
    const [requesterPaymail, setRequesterPaymail] = useState('');
    const [metadata, setMetadata] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleNewContact = useCallback(
        (paymail, fullName, requesterPaymail, metadata) => {
            setLoading(true);

            const metadataJSON = metadata ? JSON.parse(metadata) : {};

            spvWalletClient.UpsertContact(paymail, fullName, requesterPaymail, metadataJSON)
                .then(() => {
                    alert('New contact added');
                    logger.info('New contact added');
                })
                .catch((e) => {
                    logger.error(e);
                    alert("ERROR: " + e.message);
                    setError(e.message);
                });
            setLoading(false);
        },
        [spvWalletClient],
    );

    return (
        <DashboardLayout>
            <Typography color="inherit" variant="h4">
                Add new contact
            </Typography>
            <Box display="flex" flexDirection="row">
                <TextField
                    fullWidth
                    label="Paymail"
                    margin="normal"
                    value={paymail}
                    onChange={(e) => setPaymail(e.target.value)}
                    type="text"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    type="text"
                    label="Full name"
                    margin="normal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    variant="outlined"
                />
            </Box>

            <Box display="flex" flexDirection="row">
                <TextField
                    fullWidth
                    label="Requester paymail"
                    margin="normal"
                    value={requesterPaymail}
                    onChange={(e) => setRequesterPaymail(e.target.value)}
                    type="text"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    type="text"
                    label="Metadata"
                    margin="normal"
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                    variant="outlined"
                />
            </Box>
            <Button sx={{ mr: 1 }} onClick={() => handleNewContact(paymail, fullName, requesterPaymail, metadata)}>
                + Add new contact
            </Button>
            {loading ? <>Loading...</> : <>{!!error && <Alert severity="error">{error}</Alert>}</>}
        </DashboardLayout>
    );
};
