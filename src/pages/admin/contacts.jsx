import React, { useEffect, useState } from 'react';

import { DashboardLayout } from "../../components/dashboard-layout";
import { Box } from "@mui/material";
import {ContactsList} from "../../components/contacts";
import {NewAdminListing} from "../../components/listing/newAdmin";

export const AdminContacts = () => {
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
            <NewAdminListing
                key="admin_contacts_listing"
                modelFunction="AdminGetContacts"
                title="Contacts"
                ListingComponent={ContactsList}
                filter={filter}
                setFilter={setFilter}
                conditions={conditions}
                additionalFilters={additionalFilters}
            />
        </DashboardLayout>
    );
};
