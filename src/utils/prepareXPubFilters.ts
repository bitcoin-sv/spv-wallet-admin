export const prepareXPubFilters = (str: string) => {
  let id: string | undefined;

  if (isNaN(+str)) {
    id = str.length > 0 ? str : undefined;
  } 

  return { id };
};
