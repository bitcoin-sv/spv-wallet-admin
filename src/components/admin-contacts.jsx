import {Button, Table, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useState} from 'react';
import {JsonView} from "./json-view";
import {useUser} from "../hooks/useUser";
import logger from "../logger";


const AdminRejectContactButton = ({contactToReject, handleRejectContact}) => {
    if(handleRejectContact) {
        return <Button
            onClick={() => handleRejectContact(contactToReject)}
        >
            Reject contact
        </Button>
    } else {
        return null;
    }
}

const AdminAcceptContactButton = ({contactToAccept, handleAcceptContact}) => {
    if(handleAcceptContact) {
        return <Button
            onClick={() => handleAcceptContact(contactToAccept)}
        >
            Accept contact
        </Button>
    } else {
        return null;
    }
}


const AdminConfirmContactButton = ({contactToConfirm, handleConfirmContact}) => {
    if(handleConfirmContact) {
        return <Button
            onClick={() => handleConfirmContact(contactToConfirm)}
        >
            Confirm contact
        </Button>
    } else {
        return null;
    }
}

export const AdminContactsList = ({items, refetch}) => {
    const { spvWalletClient } = useUser();
    // const [info, setInfo] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);

    const handleRejectContact = function (contact) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Revoke contact?')) {
            spvWalletClient
                .AdminRejectContact(contact.id)
                .then((r) => {
                    // setInfo(`Contact ${contact.id} rejected`);
                    logger.info(`Contact ${contact.id} rejected`);
                    refetch();
                    // setRefreshData(+new Date());
                })
                .catch((e) => {
                    logger.error(e);
                    alert("ERROR: Could not reject contact "+e.message);
                });
        }
    };


    const handleAcceptContact = function (contact) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Accept contact?')) {
            spvWalletClient
                .AdminAcceptContact(contact.id)
                .then((r) => {
                    // setInfo(`Contact ${contact.id} accepted`);
                    logger.info(`Contact ${contact.id} accepted`);
                    refetch();
                    // setRefreshData(+new Date());
                })
                .catch((e) => {
                    logger.error(e);
                    alert("ERROR: Could not accept contact "+e.message);
                });
        }
    };

    const handleConfirmContact = function (contact) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Confirm contact?')) {
            spvWalletClient
                .AdminConfirmContact(contact.id)
                .then((r) => {
                    // setInfo(`Contact ${contact.id} confirmed`);
                    logger.info(`Contact ${contact.id} confirmed`);
                    refetch();
                    // setRefreshData(+new Date());
                })
                .catch((e) => {
                    logger.error(e);
                    alert("ERROR: Could not confirm contact "+e.message);
                });
        }
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Full name</TableCell>
                    <TableCell>Paymail</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Reject</TableCell>
                    <TableCell>Accept</TableCell>
                    <TableCell>Confirm</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map(contact => (
                    <>
                        <TableRow
                            hover
                            key={`contact_${contact.id}`}
                            selected={selectedContacts.indexOf(contact.id) !== -1}
                            style={{
                                opacity: contact.deleted_at ? 0.5 : 1
                            }}
                            onClick={() => {
                                if (selectedContacts.indexOf(contact.id) !== -1) {
                                    setSelectedContacts([])
                                } else {
                                    setSelectedContacts([contact.id])
                                }
                            }}
                        >
                            <TableCell>{contact.id}</TableCell>
                            <TableCell>{contact.fullName}</TableCell>
                            <TableCell>{contact.paymail}</TableCell>
                            <TableCell>{contact.status}</TableCell>
                            <TableCell>
                                {new Date(contact.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                {contact.deleted_at
                                    ? <span title={`Rejected at ${contact.deleted_at}`}>Already rejected</span>
                                    : contact.status !== 'awaiting'
                                        ? <span title={`Status have to be awaiting to perform this operation`}>Wrong status</span>
                                        : <AdminRejectContactButton contactToReject={contact} handleRejectContact={handleRejectContact} />
                                }
                            </TableCell>

                            <TableCell>
                                {contact.status !== 'awaiting'
                                    ? contact.status === 'unconfirmed'
                                        ? <span>Already accepted</span>
                                        : <span title={`Status have to be awaiting to perform this operation`}>Wrong status</span>
                                    : <AdminAcceptContactButton contactToAccept={contact} handleAcceptContact={handleAcceptContact} />
                                }
                            </TableCell>

                            <TableCell>
                                {contact.status !== 'unconfirmed'
                                    ? contact.status === 'confirmed'
                                        ? <span>Already confirmed</span>
                                        : <span title={`Status have to be unconfirmed to perform this operation`}>Wrong status</span>
                                    : <AdminConfirmContactButton contactToConfirm={contact} handleConfirmContact={handleConfirmContact}/>
                                }
                            </TableCell>
                        </TableRow>
                        {selectedContacts.indexOf(contact.id) !== -1 &&
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <JsonView jsonData={contact}/>
                                </TableCell>
                            </TableRow>
                        }
                    </>
                ))}
            </TableBody>
        </Table>
    );
};

AdminContactsList.propTypes = {
    items: PropTypes.array.isRequired,
};
