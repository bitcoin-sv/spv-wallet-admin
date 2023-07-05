import bsv from 'bsv';
import {BuxClient} from "@buxorg/js-buxclient";
import {useCredentials} from "./use-credentials";
export const useUser = () => {
  const {
    xPrivString,
    xPubString: xPubStringCtx,
    accessKeyString,
    transportType,
    server,
    adminKeyString,
  } = useCredentials()

  let xPubString, xPriv, xPub, xPubId, accessKey, adminKey, adminId;

  if (xPrivString) {
    xPriv = bsv.HDPrivateKey.fromString(xPrivString);
    xPub = xPriv.hdPublicKey;
    xPubString = xPub.toString();
    xPubId = bsv.crypto.Hash.sha256(Buffer.from(xPubString)).toString('hex')
  } else if (xPubString) {
    xPriv = null;
    xPub = bsv.HDPublicKey.fromString(xPubStringCtx)
    xPubString = xPub.toString();
    xPubId = bsv.crypto.Hash.sha256(Buffer.from(xPubString)).toString('hex')
  } else if (accessKeyString) {
    xPriv = null;
    xPubString = null;
    xPub = null;
    accessKey = bsv.PrivateKey.fromString(accessKeyString);
    xPubId = bsv.crypto.Hash.sha256(Buffer.from(accessKey.publicKey.toString())).toString('hex')
  }

  if (adminKeyString) {
    adminKey = bsv.HDPrivateKey.fromString(adminKeyString);
    adminId = bsv.crypto.Hash.sha256(Buffer.from(adminKeyString)).toString('hex')
  }

  let buxClient, buxAdminClient;
  if (server && transportType) {
    buxClient = new BuxClient(server, {
      transportType: transportType,
      xPriv,
      xPub,
      accessKey,
      signRequest: true,
    });
    if (adminKey) {
      buxAdminClient = new BuxClient(server, {
        transportType: transportType,
        xPriv,
        xPub,
        accessKey,
        signRequest: true,
      });
      buxAdminClient.SetAdminKey(adminKey);
    }
  }

  return {
    xPrivString,
    xPriv,
    xPubString,
    xPub,
    xPubId,
    accessKey,
    accessKeyString,
    transportType,
    server,
    adminKey,
    adminId,
    buxClient,
    buxAdminClient,
  };
};
