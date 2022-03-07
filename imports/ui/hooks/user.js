import { useTracker } from "meteor/react-meteor-data";
import bsv from 'bsv';

const _xPrivString = new ReactiveVar();
const _xPubString = new ReactiveVar();
const _accessKeyString = new ReactiveVar();
const _transportType = new ReactiveVar();
const _server = new ReactiveVar();
const _adminKeyString = new ReactiveVar();

export const setXPrivString = function(xPrivString) {
  _xPrivString.set(xPrivString);
}
export const setXPubString = function(xPubString) {
  _xPubString.set(xPubString);
}
export const setAccessKeyString = function(accessKey) {
  _accessKeyString.set(accessKey);
}
export const setServer = function(server) {
  _server.set(server);
}
export const setTransportType = function(transportType) {
  _transportType.set(transportType);
}
export const setAdminKey = function(adminKeyString) {
  _adminKeyString.set(adminKeyString);
}

export const useUser = () => useTracker(() => {
  const xPrivString = _xPrivString.get();
  let xPubString = _xPubString.get();
  const accessKeyString = _accessKeyString.get();

  const transportType = _transportType.get();
  const server = _server.get();
  const adminKeyString = _adminKeyString.get();
  let xPriv, xPub, xPubId, accessKey, adminKey, adminId;

  if (xPrivString) {
    xPriv = bsv.HDPrivateKey.fromString(xPrivString);
    xPub = xPriv.hdPublicKey;
    xPubString = xPub.toString();
    xPubId = bsv.crypto.Hash.sha256(Buffer.from(xPubString)).toString('hex')
  } else if (xPubString) {
    xPriv = null;
    xPub = bsv.HDPublicKey.fromString(xPubString)
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
  } ;
});
