import bsv from 'bsv';
import {SpvWalletClient} from "@bsv/spv-wallet-js-client";
import {useCredentials} from "./use-credentials";
export const useUser = () => {
  const {
    xPrivString,
    xPubString: xPubStringCtx,
    accessKeyString,
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

  let spvWalletClient, spvWalletAdminClient;
  if (server) {
    spvWalletClient = new SpvWalletClient(server, {
      xPriv,
      xPub,
      accessKey,
      signRequest: true,
    });
    if (adminKey) {
      spvWalletAdminClient = new SpvWalletClient(server, {
        xPriv,
        xPub,
        accessKey,
        signRequest: true,
      });
      spvWalletAdminClient.SetAdminKey(adminKey);
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
    server,
    adminKey,
    adminId,
    spvWalletClient,
    spvWalletAdminClient,
  };
};
