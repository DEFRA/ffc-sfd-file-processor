const { strategy } = require('ffc-auth')
module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, _options) => {
      server.auth.strategy('jwt', 'jwt', strategy)
      server.auth.default({ strategy: 'jwt', mode: 'try' })
    }
  }
}
