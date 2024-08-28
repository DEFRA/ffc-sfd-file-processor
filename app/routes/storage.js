module.exports = [{
  method: 'POST',
  path: '/storage',
  options: {
    handler: async (request, h) => {
      try {
        console.log('Received request from Event Grid')
        for (const event of request.payload) {
          const body = event
          // Deserialize the event data into the appropriate type based on event type
          if (body.data && body.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent') {
            console.log(`Got SubscriptionValidation event data, validation code: ${body.data.validationCode}, topic: ${body.topic}`)
            const code = body.data.validationCode
            return h.response({ ValidationResponse: code }).code(200)
          } else {
            console.log('Received blob storage event:', body)
          }
        }
        return h.response().code(200)
      } catch (error) {
        console.error('Error processing blob storage event:', error)
        return h.response().code(500)
      }
    }
  }
}]
