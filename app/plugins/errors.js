const { handle401 } = require('ffc-auth')

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response
        if (response.isBoom) {
          const statusCode = response.output.statusCode
          const errorMessage = response.output.payload.message
          if (statusCode === 401) {
            return handle401(request, h)
          }
          if (statusCode === 403) {
            return h.response({
              statusCode: 403,
              error: 'Forbidden',
              message: 'You do not have permission to access this resource.'
            }).code(403)
          }
          if (statusCode === 404) {
            return h.response({
              statusCode: 404,
              error: 'Not Found',
              message: 'The requested resource could not be found.'
            }).code(404)
          }
          if (errorMessage === 'Invalid multipart payload format') {
            return h.response({
              statusCode: 413,
              error: 'Payload Too Large',
              message: 'The request payload is too large.'
            }).code(413)
          }
          request.log('error', {
            statusCode,
            data: response.data,
            message: response.message,
            stack: response.stack
          })
          return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred.'
          }).code(500)
        }
        return h.continue
      })
    }
  }
}
