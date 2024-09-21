import server from './server'
import { logger } from './util/logger'

async function run (): Promise<void> {
    const app = await server()
    await app?.listen({
        host: '0.0.0.0',
        port: 8080
    })
}

run()
    .then(r => {})
    .catch(async err => {
        logger.error({ err }, 'Error in running app')
        // close any db stuff
        process.exit()
    })
