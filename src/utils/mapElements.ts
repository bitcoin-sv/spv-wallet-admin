type ExtractElementType<T> = T extends (infer U)[] ? U : never;

export const addStatusField = <T extends object[]>(data: T): Array<ExtractElementType<T> & { status: string }> => {
  return data.map((el) => {
    const element = el as ExtractElementType<T>;
    const { revoked_at, deleted_at } = el as { revoked_at?: string; deleted_at?: string };

    let status;

    if (revoked_at) {
      status = 'revoked';
    } else if (deleted_at) {
      status = 'deleted';
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