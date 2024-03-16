import DeleteIcon from '@mui/icons-material/Delete'

import {Button, Table, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom'

import {useUser} from "../hooks/user";
import logger from "../logger";
import {JsonView} from "./json-view";

export const PaymailsList = (
  {
    items,
    refetch,
  }
) => {
  const { spvWalletAdminClient } = useUser();

  const [selectedPaymails, setSelectedPaymails] = useState([]);

  const handleDeletePaymail = useCallback(async paymailAddress => {
    // eslint-disable-next-line no-restricted-globals
    if (paymailAddress && confirm('Are you sure you want to delete the paymail address from this user?')) {
      const paymailDeleted = await spvWalletAdminClient.AdminDeletePaymail(`${paymailAddress.alias}@${paymailAddress.domain}`).catch(e => {
        logger.error("Could not delete paymail" + e.message)
        alert("ERROR: Could not delete paymail: " + e.message);
      });
      if (paymailDeleted) {
        logger.info("Paymail deleted")
        alert("Paymail deleted");
        refetch();
      }
    }
  }, [spvWalletAdminClient, refetch]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Avatar</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Alias</TableCell>
          <TableCell>Domain</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>XPubID</TableCell>
          <TableCell>Revoke</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(paymail => (
          <React.Fragment key={`paymail_${paymail.id}`}>
            <TableRow
              hover
              selected={selectedPaymails.indexOf(paymail.id) !== -1}
              style={{
                opacity: paymail.deleted_at ? 0.5 : 1
              }}
              onClick={() => {
                if (selectedPaymails.indexOf(paymail.id) !== -1) {
                  setSelectedPaymails([])
                } else {
                  setSelectedPaymails([paymail.id])
                }
              }}
            >
              <TableCell>{paymail.avatar ? <img alt="avatar" src={paymail.avatar} style={{ height: '24px' }}/> : ''}</TableCell>
              <TableCell>{paymail.public_name}</TableCell>
              <TableCell>{paymail.alias}</TableCell>
              <TableCell>{paymail.deleted_at ? '' : paymail.domain}</TableCell>
              <TableCell>
                {new Date(paymail.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link to={`/admin/xpubs?search=${paymail.xpub_id}`}>
                  {paymail.xpub_id.substr(0, 5) + '...'}
                </Link>
              </TableCell>
              <TableCell>
                {paymail.deleted_at
                  ?
                  <span title={`Revoked at ${paymail.deleted_at}`}>Deleted</span>
                  :
                  <Button
                    onClick={() => handleDeletePaymail(paymail)}
                  >
                    <DeleteIcon fontSize="small"/>
                  </Button>
                }
              </TableCell>
            </TableRow>
            {selectedPaymails.indexOf(paymail.id) !== -1 &&
              <TableRow>
                <TableCell colSpan={5}>
                  <JsonView jsonData={paymail}/>
                </TableCell>
              </TableRow>
            }
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

PaymailsList.propTypes = {
  items: PropTypes.array.isRequired
};
