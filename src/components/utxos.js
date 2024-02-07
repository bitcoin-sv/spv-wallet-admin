import {Table, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";

import {JsonView} from "./json-view";

export const UtxosList = (
  {
    items,
  }
) => {

  const [selectedXPubs, setSelectedXPubs] = useState([]);

  useEffect(() => {
    if (items && items.length === 1) {
      setSelectedXPubs([items[0].id]);
    }
  }, [items]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Script Pub Key</TableCell>
          <TableCell>Sats</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Spent</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(xpub => (
          <React.Fragment key={`paymail_${xpub.id}`}>
            <TableRow
              hover
              selected={selectedXPubs.indexOf(xpub.id) !== -1}
              style={{
                opacity: xpub.spending_tx_id ? 0.5 : 1
              }}
              onClick={() => {
                if (selectedXPubs.indexOf(xpub.id) !== -1) {
                  setSelectedXPubs([])
                } else {
                  setSelectedXPubs([xpub.id])
                }
              }}
            >
              <TableCell><span title={xpub.id}>{xpub.id.substr(0, 12)}...</span></TableCell>
              <TableCell>{xpub.script_pub_key}</TableCell>
              <TableCell>{xpub.satoshis}</TableCell>
              <TableCell>
                {new Date(xpub.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link to={`/transaction?tx_id=${xpub.spending_tx_id}`}>
                  <span title={xpub.spending_tx_id}>{xpub.spending_tx_id ? 'SPENT' : ''}</span>
                </Link>
              </TableCell>
            </TableRow>
            {selectedXPubs.indexOf(xpub.id) !== -1 &&
              <TableRow>
                <TableCell colSpan={5}>
                  <JsonView jsonData={xpub}/>
                </TableCell>
              </TableRow>
            }
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

UtxosList.propTypes = {
  items: PropTypes.array.isRequired,
  refetch: PropTypes.func,
};
