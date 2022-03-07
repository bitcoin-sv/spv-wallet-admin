import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';

export const AccessKeysList = ({ accessKeys, handleRevokeAccessKey, ...rest }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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
                <TableCell>ID</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Revoke</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accessKeys.slice(page*limit, page*limit + limit).map(accessKey => (
                <TableRow
                  hover
                  key={`access_key_${accessKey.id}`}
                  selected={selectedTransactions.indexOf(accessKey.id) !== -1}
                  style={{
                    opacity: accessKey.revoked_at ? 0.5 : 1
                  }}
                  onClick={() => {
                    if (selectedTransactions.indexOf(accessKey.id) !== -1) {
                      setSelectedTransactions([])
                    } else {
                      setSelectedTransactions([accessKey.id])
                    }
                  }}
                >
                  <TableCell>{accessKey.id}</TableCell>
                  <TableCell>
                    {format(new Date(accessKey.created_at), 'dd/MM/yyyy hh:mm')}
                  </TableCell>
                  <TableCell>
                    {accessKey.revoked_at
                      ?
                      <span title={`Revoked at ${accessKey.revoked_at}`}>Revoked</span>
                      :
                      <Button
                        onClick={() => handleRevokeAccessKey(accessKey)}
                      >
                        Revoke key
                      </Button>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={accessKeys.length}
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

AccessKeysList.propTypes = {
  accessKeys: PropTypes.array.isRequired,
  handleRevokeAccessKey: PropTypes.func.isRequired,
};
