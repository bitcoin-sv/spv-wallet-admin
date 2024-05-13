import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { JsonView } from './json-view';
import { useUser } from '../hooks/useUser';
import logger from '../logger';

const EventButton = ({ contact, event, handleContactEvent, admin }) => {
  if (handleContactEvent) {
    let method = `${event}Contact`;
    let param = contact.paymail;
    if (admin) {
      method = `Admin${event}Contact`;
      param = contact.id;
    }
    return <Button onClick={() => handleContactEvent(param, method, `${event} contact?`)}>{event} contact</Button>;
  }
};

export const ContactsList = ({ items, refetch }) => {
  const { spvWalletClient, admin } = useUser();
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleContactEvent = function (param, method, msg) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(msg)) {
      spvWalletClient[`${method}`](param)
        .then((r) => {
          logger.info(`Operation performed successfully`);
          refetch();
        })
        .catch((e) => {
          logger.error(e);
          alert('ERROR: Could not perform operation ' + e.message);
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
          {admin ? null : <TableCell>Confirm</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((contact) => (
          <>
            <TableRow
              hover
              key={`contact_${contact.id}`}
              selected={selectedContacts.indexOf(contact.id) !== -1}
              style={{
                opacity: contact.deleted_at ? 0.5 : 1,
              }}
              onClick={() => {
                if (selectedContacts.indexOf(contact.id) !== -1) {
                  setSelectedContacts([]);
                } else {
                  setSelectedContacts([contact.id]);
                }
              }}
            >
              <TableCell>{contact.id}</TableCell>
              <TableCell>{contact.fullName}</TableCell>
              <TableCell>{contact.paymail}</TableCell>
              <TableCell>{contact.status}</TableCell>
              <TableCell>{new Date(contact.created_at).toLocaleString()}</TableCell>
              <TableCell>
                {contact.deleted_at ? (
                  <span title={`Rejected at ${contact.deleted_at}`}>Already rejected</span>
                ) : contact.status !== 'awaiting' ? (
                  <span title={`Status have to be awaiting to perform this operation`}>Wrong status</span>
                ) : (
                  <EventButton contact={contact} event="Reject" handleContactEvent={handleContactEvent} admin={admin} />
                )}
              </TableCell>

              <TableCell>
                {contact.status !== 'awaiting' ? (
                  contact.status === 'unconfirmed' ? (
                    <span>Already accepted</span>
                  ) : (
                    <span title={`Status have to be awaiting to perform this operation`}>Wrong status</span>
                  )
                ) : (
                  <EventButton contact={contact} event="Accept" handleContactEvent={handleContactEvent} admin={admin} />
                )}
              </TableCell>
              {admin ? null : (
                <TableCell>
                  {contact.status !== 'unconfirmed' ? (
                    contact.status === 'confirmed' ? (
                      <span>Already confirmed</span>
                    ) : (
                      <span title={`Status have to be unconfirmed to perform this operation`}>Wrong status</span>
                    )
                  ) : (
                    <EventButton
                      contact={contact}
                      event="Confirm"
                      handleContactEvent={handleContactEvent}
                      admin={admin}
                    />
                  )}
                </TableCell>
              )}
            </TableRow>
            {selectedContacts.indexOf(contact.id) !== -1 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <JsonView jsonData={contact} />
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
};

ContactsList.propTypes = {
  items: PropTypes.array.isRequired,
};
