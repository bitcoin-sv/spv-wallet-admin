import React, { useState } from 'react';

import Typography from '@mui/material/Typography';

import { DashboardLayout } from '../components/dashboard-layout';
import { Alert, Card } from '@mui/material';
import { useNewQueryList } from '../hooks/useNewQueryList';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {ContactsList} from "../components/contacts";

export const Contacts = () => {
    const { items, loading, error, setError, Pagination, setRefreshData } = useNewQueryList({
        modelFunction: 'GetContacts',
    });
    const [info, setInfo] = useState('');


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
                            <ContactsList items={items} refetch={() => setRefreshData(+new Date())}/>
                        </PerfectScrollbar>
                        <Pagination />
                    </Card>
                </>
            )}
        </DashboardLayout>
    );
};
