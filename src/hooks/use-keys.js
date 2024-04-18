import bsv from 'bsv';
import { useMemo } from 'react';
import { CredTypeAccessKey, CredTypeAdmin, CredTypeXPriv, useCredentials } from './useCredentials';

export const useKeys = () => {
  const { type, cred } = useCredentials();

  return useMemo(() => {
    switch (type) {
      case CredTypeAdmin:
        return {
          adminKey: bsv.HDPrivateKey.fromString(cred),
          adminId: bsv.crypto.Hash.sha256(Buffer.from(cred)).toString('hex'),
        };
      case CredTypeXPriv:
        const xPriv = bsv.HDPrivateKey.fromString(cred);
        const xPub = xPriv.hdPublicKey;
        return {
          xPriv,
          xPub,
          xPubId: bsv.crypto.Hash.sha256(Buffer.from(xPub.toString())).toString('hex'),
        };
      case CredTypeAccessKey:
        const accessKey = bsv.PrivateKey.fromString(cred);
        return {
          accessKey,
          xPubId: bsv.crypto.Hash.sha256(Buffer.from(accessKey.publicKey.toString())).toString('hex'),
        };
      default:
        return {};
    }
  }, [cred, type]);
};
