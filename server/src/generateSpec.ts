import server from './src/server'
import * as fs from 'fs'
import { logger } from './src/util/logger'
import { Db } from './src/db/db-class'
import { envMock, mockProcessEnv } from './test/helpers'

async function generateSpec (): Promise<void> {
  mockProcessEnv()
  const app = await server({
    db: new Db(envMock.dbUser, envMock.dbPassword, envMock.dbAddress, envMock.dbPort, envMock.dbName),
    authenticate: false,
    authorize: false
  }
  )
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
