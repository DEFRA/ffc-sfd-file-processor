const { getAsync, setAsync, keysAsync, delAsync } = require('../redis/redis-client')

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
    const { payload } = request
    console.log('Received Webhook event:', JSON.stringify(payload, null, 2))

    if (Array.isArray(payload) && payload.length > 0) {
      const event = payload[0]
      console.log('Event data:', JSON.stringify(event, null, 2))

      // Handle the validation request
      if (event.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent') {
        console.log('Received validation request')
        return h.response({ validationResponse: event.data.validationCode }).code(200)
      }

      // Handle other events
      const blobUri = event.data && event.data.blobUri
      const correlationId = blobUri ? blobUri.split('/').pop() : null
      console.log(`Extracted correlationId: ${correlationId}`)

      if (!correlationId) {
        console.error('correlationId is undefined')
        return h.response({ status: 'error', message: 'correlationId is undefined' }).code(400)
      }

      // Look up the file metadata using the correlationId
      const fileMetadata = await getAsync(correlationId)

      if (fileMetadata) {
        const metadata = JSON.parse(fileMetadata)
        // Update the file metadata with the scan results
        metadata.scanResult = event.data.scanResultType
        metadata.scanDetails = event.data.scanResultDetails
        await setAsync(correlationId, JSON.stringify(metadata))
        console.log('Updated file metadata:', metadata)
      } else {
        console.log('No matching file metadata found for correlationId:', correlationId)
      }
    }

    return h.response({ status: 'success' }).code(200)
  }
}
