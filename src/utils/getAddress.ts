export const getAddress = (str: string) => (str.length > 0 && str.length < 30 ? str : undefined);
