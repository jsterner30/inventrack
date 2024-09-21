import { pino } from 'pino'
// export const logger = pino({
//     transport: {
//         target: 'pino-pretty',
//         options: { translateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\'' }
//     }
// })

const ENV_LEVELS: Record<string, string> = {
    production: 'info',
    test: 'silent',
    default: 'debug'
}
export function logger() {
    const opts = {
        level: ENV_LEVELS[process.env.NODE_ENV ?? 'default'],
        messageKey: 'message',
        formatters: {
            level: (level: any) => ({ level }) // display the level not the number value of the level
        },
        base: {}, // don't display the process pid, nor hostname
        redact: {
            // redact bearer tokens and JWTs
            paths: ['req.headers.authorization', 'req.headers.assertion', 'req.headers["x-jwt-assertion"]', 'req.headers["x-jwt-assertion-original"]'],
            censor: '***'
        },
        transport: {
            target: 'pino-pretty',
            options: {translateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\''}
        }
    }
    return pino(opts)
}

// export default logger;