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

export const DestinationsList = (
  {
    destinations,
    ...rest
  }
) => {
  const [selectedDestinations, setSelectedDestinations] = useState([]);

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
                <TableCell>Address</TableCell>
                <TableCell>Locking Script</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {destinations.slice(page*limit, page*limit + limit).map((destination) => (
                <React.Fragment key={destination.id}>
                  <TableRow
                    hover
                    selected={selectedDestinations.indexOf(destination.id) !== -1}
                    onClick={() => {
                      if (selectedDestinations.indexOf(destination.id) !== -1) {
                        setSelectedDestinations([])
                      } else {
                        setSelectedDestinations([destination.id])
                      }
                    }}
                  >
                    <TableCell>{destination.address}</TableCell>
                    <TableCell>{destination.locking_script}</TableCell>
                    <TableCell>
                      {format(new Date(destination.created_at), 'dd/MM/yyyy hh:mm')}
                    </TableCell>
                  </TableRow>
                  {selectedDestinations.indexOf(destination.id) !== -1 &&
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Link to={`/destination?id=${destination.id}`}>Open Destination details</Link>
                        <JsonView jsonData={destination} />
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
        count={destinations.length}
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

DestinationsList.propTypes = {
  destinations: PropTypes.array.isRequired
};
