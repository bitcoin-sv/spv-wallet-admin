import {Button, Table, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {JsonView} from "./json-view";

const RevokeAccessKeyButton = ({accessKeyToRevoke, handleRevokeAccessKey}) => {
  if(handleRevokeAccessKey) {
    return <Button
      onClick={() => handleRevokeAccessKey(accessKeyToRevoke)}
    >
      Revoke key
    </Button>
  } else {
    return null;
  }
}

export const AccessKeysList = ({items, handleRevokeAccessKey}) => {
  const [selectedAccessKeys, setSelectedAccessKeys] = useState([]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Revoked</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(accessKey => (
          <>
            <TableRow
              hover
              key={`access_key_${accessKey.id}`}
              selected={selectedAccessKeys.indexOf(accessKey.id) !== -1}
              style={{
                opacity: accessKey.revoked_at ? 0.5 : 1
              }}
              onClick={() => {
                if (selectedAccessKeys.indexOf(accessKey.id) !== -1) {
                  setSelectedAccessKeys([])
                } else {
                  setSelectedAccessKeys([accessKey.id])
                }
              }}
            >
              <TableCell>{accessKey.id}</TableCell>
              <TableCell>
                {new Date(accessKey.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                {accessKey.revoked_at
                  ? <span title={`Revoked at ${accessKey.revoked_at}`}>Revoked</span>
                  : <RevokeAccessKeyButton accessKeyToRevoke={accessKey} handleRevokeAccessKey={handleRevokeAccessKey} />
                }
              </TableCell>
            </TableRow>
            {selectedAccessKeys.indexOf(accessKey.id) !== -1 &&
            <TableRow>
              <TableCell colSpan={5}>
                <JsonView jsonData={accessKey}/>
              </TableCell>
            </TableRow>
            }
          </>
        ))}
      </TableBody>
    </Table>
  );
};

AccessKeysList.propTypes = {
  items: PropTypes.array.isRequired,
  handleRevokeAccessKey: PropTypes.func,
};
