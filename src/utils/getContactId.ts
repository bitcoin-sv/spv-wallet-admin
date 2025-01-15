import { CONTACT_ID_LENGTH } from '@/constants';

export const getContactId = (filter: string) => (filter.length === CONTACT_ID_LENGTH ? filter : undefined);
