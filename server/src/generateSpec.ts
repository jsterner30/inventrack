import server from './server'
import * as fs from 'fs'
import { logger } from './util/logger'

async function generateSpec (): Promise<void> {
  const app = await server()
  await app.ready().then(() => {
    // generate the swagger file
    const yaml = (app as any).swagger({ yaml: true })
    fs.writeFileSync('./spec.yml', yaml)
  })
}

generateSpec()
  .then(r => {
    logger.info('done')
    process.exit(0)
  })
  .catch(err => {
    logger.error({ err }, 'Error generating spec file')
    process.exit(1)
  })
