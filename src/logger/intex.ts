import pino, { Logger, LoggerOptions } from 'pino';

// Define the levels type
const levels: { [key: number]: string } = {
  60: 'fatal',
  50: 'error',
  40: 'warn',
  30: 'info',
  20: 'debug',
  10: 'trace',
};

// Type for log objects
type LogObject = {
  level?: number | string;
  [key: string]: any;
};

const serializers = {
  err: pino.stdSerializers.err,
};

const prettyOptions = {
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname', // Customize to ignore specific fields if needed
};

// Add types to the getDefaultObject function
const getDefaultObject = (o: any): any => ({
  ...o,
  level: levels[o.level as number] || 'info', // Ensure level is a string from levels
  name: 'spv-wallet-admin',
  msg: o.message,
  stack: o.stack,
});

const pinoLogger: Logger = pino({
  level: 'trace',
  name: 'spv-wallet-admin',
  // serializers,
  // prettyfier: pino.pretty,
  // prettyPrint: prettyOptions,
  browser: {
    asObject: true,
    write: {
      trace: (o: LogObject = {}) => {
        console.trace(getDefaultObject(o));
      },
      debug: (o: LogObject = {}) => {
        console.debug(getDefaultObject(o));
      },
      info: (o: LogObject = {}) => {
        console.log(getDefaultObject(o));
      },
      warn: (o: LogObject = {}) => {
        console.warn(getDefaultObject(o));
      },
      // error: (o: LogObject = {}) => {
      //   console.log('TEst', o);
      //   console.error(getDefaultObject(o));
      // },
      error: (o: LogObject = {}) => {
        // console.log('TEst', o);
        console.error('error', o);
        // console.error(getDefaultObject(o));
      },
      fatal: (o: LogObject = {}) => {
        console.error(getDefaultObject(o));
      },
    },
  } as LoggerOptions, // Added type assertion to fix type compatibility
});

const logger = {
  trace: (o: unknown) => pinoLogger.trace(o),
  debug: (o: unknown) => pinoLogger.debug(o),
  info: (o: unknown) => pinoLogger.info(o),
  warn: (o: unknown) => pinoLogger.warn(o),
  // error: (o: unknown) => pinoLogger.error(o),
  error: (o: unknown) => {
    // console.log('OO', o.message);
    // console.log('start', o.stack);
    return pinoLogger.error(o);
  },
  fatal: (o: unknown) => pinoLogger.fatal(o),
};

export default logger;
