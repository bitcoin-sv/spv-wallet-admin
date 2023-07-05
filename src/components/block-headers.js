import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'

import { useUser } from "../hooks/user";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { JsonView } from "./json-view";

export const BlockHeadersList = (
  {
    items,
    refetch,
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
                {format(new Date(xpub.time*1000), 'dd/MM/yyyy hh:mm')}
              </TableCell>
              <TableCell>
                {format(new Date(xpub.created_at), 'dd/MM/yyyy hh:mm')}
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
