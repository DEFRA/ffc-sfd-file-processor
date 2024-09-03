require('./insights').setup()
require('log-timestamp')
const { createServer } = require('./server')
const { connectToBlob } = require('./storage')
const { startMessaging } = require('./message')

const init = async () => {
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri)
  await connectToBlob()
  console.log('Connected to blob storage')
  await startMessaging()
  console.log('Started messaging')
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
