import React, { useEffect, useState } from 'react';

import { DashboardLayout } from "../../components/dashboard-layout";
import { AdminListing } from "../../components/listing/admin";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import {AdminContactsList} from "../../components/admin-contacts";

export const AdminContacts = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-restricted-globals
    const params = new URLSearchParams(location.search)

    const [ filter, setFilter ] = useState('');
    const [ showRejected, setShowRejected ] = useState(false);
    const [ conditions, setConditions ] = useState(null);

    // TODO: SPV-699 - refactor this to filter by more parameters
    useEffect(() => {
        const conditions = {}
        if (filter) {
            conditions.paymail = filter;
        }

        conditions.include_deleted = showRejected

        setConditions(conditions)
    }, [filter, showRejected]);

    const additionalFilters = function() {
        return (
            <Box style={{ marginLeft: 20 }}>
                Show Rejected <input type="checkbox" checked={showRejected} onClick={() => setShowRejected(!showRejected)}/>
            </Box>
        )
    }

    return (
        <DashboardLayout>
            <AdminListing
                key="admin_contacts_listing"
                modelFunction="AdminGetContacts"
                title="Contacts"
                ListingComponent={AdminContactsList}
                filter={filter}
                setFilter={setFilter}
                conditions={conditions}
                additionalFilters={additionalFilters}
            />
        </DashboardLayout>
    );
};
