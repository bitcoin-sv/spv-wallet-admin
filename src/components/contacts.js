import {Button, Table, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {JsonView} from "./json-view";
import {useUser} from "../hooks/useUser";
import logger from "../logger";


const RejectContactButton = ({contactToReject, handleRejectContact}) => {
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

const AcceptContactButton = ({contactToAccept, handleAcceptContact}) => {
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


const ConfirmContactButton = ({contactToConfirm, handleConfirmContact}) => {
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

export const ContactsList = ({items, handleRejectContact, handleAcceptContact, handleConfirmContact}) => {
    const [selectedContacts, setSelectedContacts] = useState([]);

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
                                        : <RejectContactButton contactToReject={contact} handleRejectContact={handleRejectContact} />
                                }
                            </TableCell>

                            <TableCell>
                                {contact.status !== 'awaiting'
                                    ? contact.status === 'unconfirmed'
                                        ? <span>Already accepted</span>
                                        : <span title={`Status have to be awaiting to perform this operation`}>Wrong status</span>
                                    : <AcceptContactButton contactToAccept={contact} handleAcceptContact={handleAcceptContact} />
                                }
                            </TableCell>

                            <TableCell>
                                {contact.status !== 'unconfirmed'
                                    ? contact.status === 'confirmed'
                                        ? <span>Already confirmed</span>
                                        : <span title={`Status have to be unconfirmed to perform this operation`}>Wrong status</span>
                                    : <ConfirmContactButton contactToConfirm={contact} handleConfirmContact={handleConfirmContact}/>
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

ContactsList.propTypes = {
    items: PropTypes.array.isRequired,
    handleRejectContact: PropTypes.func,
    handleAcceptContact: PropTypes.func,
    handleConfirmContact: PropTypes.func,
};
