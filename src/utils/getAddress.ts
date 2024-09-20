export const getAddress = (filter: string) => {
  return filter.length > 0 && filter.length < 35 ? filter : undefined;
};
