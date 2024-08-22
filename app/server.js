const Joi = require('joi')
const Hapi = require('@hapi/hapi')
const { serverConfig } = require('./config')

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
  await server.register(require('hapi-auth-jwt2'))
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/router'), { routes: { prefix: serverConfig.routePrefix } })
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/crumb'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/auth-refresh'))
  if (serverConfig.isDev) {
    await server.register(require('blipp'))
  }

  return server
}
module.exports = { createServer }
