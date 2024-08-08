require('./insights').setup()
require('log-timestamp')
const { createServer } = require('./server')
const { createAzuriteInfrastructure } = require('./blob-storage')
const { startMessaging } = require('./message')

const init = async () => {
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri)
  await createAzuriteInfrastructure()
  await startMessaging()
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
