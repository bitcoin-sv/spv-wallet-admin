export const truncateId = (id: string, length: number = 12): string => {
  if (id.length <= length) {
    return id;
  }
  const halfLength = Math.floor(length / 2);
  return `${id.slice(0, halfLength)}...${id.slice(-halfLength)}`;
};
