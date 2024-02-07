import {Table, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';

import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {JsonView} from "./json-view";

export const BlockHeadersList = (
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
          <TableCell>Height</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(xpub => (
          <React.Fragment key={`paymail_${xpub.id}`}>
            <TableRow
              hover
              selected={selectedXPubs.indexOf(xpub.id) !== -1}
              style={{
                opacity: xpub.deleted_at ? 0.5 : 1
              }}
              onClick={() => {
                if (selectedXPubs.indexOf(xpub.id) !== -1) {
                  setSelectedXPubs([])
                } else {
                  setSelectedXPubs([xpub.id])
                }
              }}
            >
              <TableCell>{xpub.id}</TableCell>
              <TableCell>{xpub.height}</TableCell>
              <TableCell>
                {new Date(xpub.time*1000).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(xpub.created_at).toLocaleString()}
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

BlockHeadersList.propTypes = {
  items: PropTypes.array.isRequired,
  refetch: PropTypes.func,
};
