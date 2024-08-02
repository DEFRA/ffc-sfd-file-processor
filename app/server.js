const Joi = require('joi')
const Hapi = require('@hapi/hapi')
const { serverConfig } = require('./config')
const { createAzuriteInfrastructure } = require('./blob-storage')

const createServer = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Register the plugins
  server.validator(Joi)
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/logging'))
  if (serverConfig.isDev) {
    await server.register(require('blipp'))
  }
  try {
    await createAzuriteInfrastructure()
  } catch (error) {
    console.error('Failed to create Azurite infrastructure:', error.message)
  }

  return server
}
module.exports = { createServer }
