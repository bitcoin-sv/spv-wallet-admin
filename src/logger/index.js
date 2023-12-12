import pino from 'pino'

const levels = { 60: "fatal", 50: "error", 40: "warn", 30: "info", 20: "debug", 10: "trace" }

const getDefaultObject = (o) => ({ ...o, level: levels[o.level],
    name: 'bux-console'})

const pinoLogger = pino({
    level: 'trace',
    name: "bux-console",
    browser: {
        asObject: true,
        write: {
            trace: (o = {}) => {
                console.trace(getDefaultObject(o))
            },
            debug: (o = {}) => {
                console.debug(getDefaultObject(o))
            },
            info: (o = {}) => {
                console.log(getDefaultObject(o))
            },
            warn: (o = {}) => {
                console.warn(getDefaultObject(o))
            },
            error: (o = {}) => {
                console.error(getDefaultObject(o))
            },
            fatal: (o = {}) => {
                console.error(getDefaultObject(o))
            }
        },

    },
})

const logger = {
    trace: (o) => pinoLogger.trace({}, o),
    debug: (o) => pinoLogger.debug({}, o),
    info: (o) => pinoLogger.info({}, o),
    warn: (o) => pinoLogger.warn({}, o),
    error: (o) => pinoLogger.error({}, o),
    fatal: (o) => pinoLogger.error({}, o)
}

export default logger