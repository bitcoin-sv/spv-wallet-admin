export const getContactPaymail = (filter: string) => (filter.includes('@') ? filter : undefined);
