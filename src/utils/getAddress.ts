export const getAddress = (filter: string) => (filter.length > 0 && filter.length < 30 ? filter : undefined);
