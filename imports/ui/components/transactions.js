import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Link } from "react-router-dom";
import { JsonView } from "./json-view";

export const TransactionsList = ({ transactions, ...rest }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedTransactions;

    if (event.target.checked) {
      newSelectedTransactions = transactions.map((transaction) => transaction.id);
    } else {
      newSelectedTransactions = [];
    }

    setSelectedTransactions(newSelectedTransactions);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedTransactions.indexOf(id);
    let newSelectedTransactions = [];

    if (selectedIndex === -1) {
      newSelectedTransactions = newSelectedTransactions.concat(selectedTransactions, id);
    } else if (selectedIndex === 0) {
      newSelectedTransactions = newSelectedTransactions.concat(selectedTransactions.slice(1));
    } else if (selectedIndex === selectedTransactions.length - 1) {
      newSelectedTransactions = newSelectedTransactions.concat(selectedTransactions.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTransactions = newSelectedTransactions.concat(
        selectedTransactions.slice(0, selectedIndex),
        selectedTransactions.slice(selectedIndex + 1)
      );
    }

    setSelectedTransactions(newSelectedTransactions);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                {/*
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTransactions.length === transactions.length}
                    color="primary"
                    indeterminate={
                      selectedTransactions.length > 0
                      && selectedTransactions.length < transactions.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                */}
                <TableCell>ID</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(page*limit, page*limit + limit).map((transaction) => (
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
                    {/*
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedTransactions.indexOf(transaction.id) !== -1}
                        onChange={(event) => handleSelectOne(event, transaction.id)}
                        value="true"
                      />
                    </TableCell>
                    */}
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.output_value}</TableCell>
                    <TableCell>
                      {format(new Date(transaction.created_at), 'dd/MM/yyyy hh:mm')}
                    </TableCell>
                  </TableRow>
                  {selectedTransactions.indexOf(transaction.id) !== -1 &&
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Link to={`/transaction?tx_id=${transaction.id}`}>Open Transaction details</Link>
                        <JsonView jsonData={transaction} />
                      </TableCell>
                    </TableRow>
                  }
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={transactions.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
        showFirstButton={true}
        showLastButton={true}
      />
    </Card>
  );
};

TransactionsList.propTypes = {
  transactions: PropTypes.array.isRequired
};
