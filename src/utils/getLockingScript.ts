export const getLockingScript = (filter: string) => (filter.startsWith('76') ? filter : undefined);
