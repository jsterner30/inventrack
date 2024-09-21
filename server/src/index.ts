import server from './server'

async function run (): Promise<void> {
    console.log('2')

    let app
    try {
    app = await server()
    } catch (e) {
        console.error(e)
    }
    console.log('3')
    await app?.listen({
        host: '0.0.0.0',
        port: 8080
    })
}

console.log('1')
run()
    .then(r => {})
    .catch(async err => {
        // logger.error({ err }, 'Error in running app')
        // close any db stuff
        process.exit()
    })
