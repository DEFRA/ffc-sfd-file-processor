const { SFD_EVENT_GRID_KEY } = require('../config')

module.exports = {
  method: 'POST',
  path: '/webhook',
  options: {
    payload: {
      output: 'data',
      parse: true,
      allow: 'application/json'
    }
  },
  handler: async (request, h) => {
    const accessKey = request.query.access_key

    // Verify the access key
    if (accessKey !== SFD_EVENT_GRID_KEY) {
      return h.response({ status: 'Unauthorized' }).code(401)
    }

    const { payload } = request
    console.log('Received Webhook event:', payload)

    // Handle the validation request
    if (payload && payload.validationCode) {
      console.log('Received validation request')
      return h.response({ validationResponse: payload.validationCode }).code(200)
    }

    // Handle other events
    return h.response({ status: 'success' }).code(200)
  }
}
