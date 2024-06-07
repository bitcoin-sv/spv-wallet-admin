export const prepareXPubFilters = (str: string) => {
  let id: string | undefined;
  let currentBalance: number | undefined;

  if (isNaN(+str)) {
    id = str.length > 0 ? str : undefined;
  } else {
    currentBalance = parseInt(str);
  }

  return { id, currentBalance };
};
