import { AccessKey, Contact, OldAccessKey, OldContact, OldTx, Tx } from '@bsv/spv-wallet-js-client';

type ExtractElementType<T> = T extends (infer U)[] ? U : never;

export const addStatusField = <T extends object[]>(data: T): Array<ExtractElementType<T> & { status: string }> => {
  return data.map((el) => {
    const element = el as ExtractElementType<T>;
    const { revokedAt, deletedAt, banned } = el as { revokedAt?: string; deletedAt?: string; banned?: boolean };

    let status;

    if (revokedAt) {
      status = 'revoked';
    } else if (deletedAt) {
      status = 'deleted';
    } else if (banned) {
      status = 'banned';
    } else {
      status = 'active';
    }
    return {
      ...element,
      status,
    };
  }) as Array<ExtractElementType<T> & { status: string }>;
};

export const getRevokedElements = <T extends { status: string }>(mappedData: T[]) => {
  return mappedData.filter((el) => el.status === 'revoked');
};

export const getDeletedElements = <T extends { status: string }>(mappedData: T[]) => {
  return mappedData.filter((el) => el.status === 'deleted');
};

export const mapOldAccessKeyToAccessKey = (accessKey: OldAccessKey): AccessKey => {
  return {
    id: accessKey.id,
    key: accessKey.key,
    xpubId: accessKey.xpub_id,
    createdAt: accessKey.created_at,
    metadata: accessKey.metadata,
    deletedAt: accessKey.deleted_at,
    revokedAt: accessKey.revoked_at,
    updatedAt: accessKey.updated_at,
  };
};

export const mapOldAccessKeysToAccessKeys = (oldAccessKeys: OldAccessKey[]): AccessKey[] => {
  if (oldAccessKeys.length === 0) {
    return [];
  }
  return oldAccessKeys.map((element) => {
    return mapOldAccessKeyToAccessKey(element);
  });
};

export const mapOldTxToTx = (oldTx: OldTx): Tx => {
  return {
    updatedAt: oldTx.updated_at,
    deletedAt: oldTx.deleted_at,
    metadata: oldTx.metadata,
    createdAt: oldTx.created_at,
    id: oldTx.id,
    fee: oldTx.fee,
    hex: oldTx.hex,
    blockHash: oldTx.block_hash,
    blockHeight: oldTx.block_height,
    direction: oldTx.direction,
    totalValue: oldTx.total_value,
    outputValue: oldTx.output_value,
    numberOfInputs: oldTx.number_of_inputs,
    numberOfOutputs: oldTx.number_of_outputs,
  };
};

export const mapOldTxsToTxs = (oldTransactions: OldTx[]): Tx[] => {
  if (oldTransactions.length === 0) {
    return [];
  }
  return oldTransactions.map((element) => {
    return mapOldTxToTx(element);
  });
};

export const mapOldContactToContact = (oldContact: OldContact): Contact => {
  return {
    id: oldContact.id,
    createdAt: oldContact.created_at,
    metadata: oldContact.metadata,
    deletedAt: oldContact.deleted_at,
    updatedAt: oldContact.updated_at,
    pubKey: oldContact.pub_key,
    status: oldContact.status,
    paymail: oldContact.paymail,
    fullName: oldContact.full_name,
  };
};

export const mapOldContactsToContacts = (oldContacts: OldContact[]): Contact[] => {
  if (oldContacts.length === 0) {
    return [];
  }

  return oldContacts.map((element) => {
    return mapOldContactToContact(element);
  });
};
