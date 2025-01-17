type ExtractElementType<T> = T extends (infer U)[] ? U : never;

export const addStatusField = <T extends object[]>(data: T): Array<ExtractElementType<T> & { status: string }> => {
  return data.map((el) => {
    const element = el as ExtractElementType<T>;
    const { revokedAt, deletedAt, banned, revoked_at, deleted_at } = el as {
      revoked_at?: string;
      deleted_at?: string;
      revokedAt?: string;
      deletedAt?: string;
      banned?: boolean;
    };

    let status;

    if (revokedAt || revoked_at) {
      status = 'revoked';
    } else if (deletedAt || deleted_at) {
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
