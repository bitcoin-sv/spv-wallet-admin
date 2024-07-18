export const getLockingScript = (str: string) => (str.startsWith('76') ? str : undefined);
