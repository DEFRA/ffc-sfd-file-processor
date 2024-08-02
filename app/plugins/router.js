const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/file-upload')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
