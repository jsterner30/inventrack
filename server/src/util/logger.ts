import { pino } from 'pino'

const ENV_LEVELS: Record<string, string> = {
    production: 'info',
    test: 'silent',
    default: 'debug'
}

const loggerOptions = {
    level: ENV_LEVELS[process.env.NODE_ENV ?? 'default'],
    formatters: {
        level: (level: any) => ({ level }) // display the level not the number value of the level
    },
    base: {}, // don't display the process pid, nor hostname
    transport: {
        target: 'pino-pretty',
        options: {translateTime: 'SYS:HH:MM:ss Z-07:00'}
    }
}
export const fastifyLogOpts = {...loggerOptions, messageKey: 'message' }
export const logger = pino(loggerOptions)
