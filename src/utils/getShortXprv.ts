export const getShortXprv = (key: string) => {
  const pre = key.substring(0, 6);
  const post = key.substring(key.length - 6);
  return `${pre}****${post}`;
};
