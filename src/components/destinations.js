import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {JsonView} from "./json-view";

export const DestinationsList = ({items}) => {
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Address</TableCell>
          <TableCell>Locking Script</TableCell>
          <TableCell>Created</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((destination) => (
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
                {new Date(destination.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
            {selectedDestinations.indexOf(destination.id) !== -1 &&
            <TableRow>
              <TableCell colSpan={3}>
                <Link to={`/destination?id=${destination.id}`}>Open Destination details</Link>
                <JsonView jsonData={destination}/>
              </TableCell>
            </TableRow>
            }
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

DestinationsList.propTypes = {
  items: PropTypes.array.isRequired
};
