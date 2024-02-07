import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {JsonView} from "./json-view";

export const TransactionsList = ({items}) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Block Height</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((transaction) => (
          <React.Fragment key={transaction.id}>
            <TableRow
              hover
              selected={selectedTransactions.indexOf(transaction.id) !== -1}
              onClick={() => {
                if (selectedTransactions.indexOf(transaction.id) !== -1) {
                  setSelectedTransactions([])
                } else {
                  setSelectedTransactions([transaction.id])
                }
              }}
            >
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.block_height}</TableCell>
              <TableCell>
                {new Date(transaction.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
            {selectedTransactions.indexOf(transaction.id) !== -1 &&
            <TableRow>
              <TableCell colSpan={3}>
                <Link to={`/transaction?tx_id=${transaction.id}`}>Open Transaction details</Link>
                <JsonView jsonData={transaction}/>
              </TableCell>
            </TableRow>
            }
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

TransactionsList.propTypes = {
  items: PropTypes.array.isRequired
};
