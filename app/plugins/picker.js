const { picker } = require('ffc-auth')
module.exports = {
  plugin: {
    name: 'picker',
    register: (server, options) => {
      server.ext('onRequest', (request, h) => {
        return picker(request, h)
      })
    }
  }
}
