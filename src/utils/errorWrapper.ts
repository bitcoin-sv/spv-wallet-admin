import logger from '@/logger';

export const errorWrapper = (error: unknown) => {
  if (error instanceof Error) {
    logger.error({ msg: error.message, stack: error.stack, err: error });
    throw error;
  }
  console.error('Unknown error', error);
  throw new Error('An unknown error occurred');
};
