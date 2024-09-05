const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/file-upload'),
  require('../routes/file-download'),
  require('../routes/file-delete'),
  require('../routes/AV-scan-web-hook')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
