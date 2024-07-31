const { refreshToken } = require('ffc-auth')
const { serverConfig } = require('../config')
module.exports = {
  plugin: {
    name: 'auth-refresh',
    register: (server, options) => {
      server.ext('onPreAuth', (request, h) => {
        if (!serverConfig.refreshTokens) {
          return h.continue
        }
        return refreshToken(request, h)
      })
    }
  }
}
