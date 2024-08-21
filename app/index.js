require('./insights').setup()
require('log-timestamp')
const { createServer } = require('./server')
const { connectToBlob } = require('./storage')

const init = async () => {
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri)
  await connectToBlob()
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
