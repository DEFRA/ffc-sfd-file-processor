const Joi = require('joi')
const { PRODUCTION } = require('../constants/enviroments')

const schema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    managedIdentityClientId: Joi.string().optional(),
    appInsights: Joi.object()
  },
  receiverSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().allow('subscription')
  }
})

const config = {
  messageQueue: {
    host: process.env.MESSAGE_HOST,
    username: process.env.MESSAGE_USER,
    password: process.env.MESSAGE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    appInsights:
      process.env.NODE_ENV === PRODUCTION
        ? require('applicationinsights')
        : undefined
  },
  receiverSubscription: {
    address: process.env.FILE_RECEIVER_SUBSCRIPTION_ADDRESS,
    topic: process.env.FILE_RECEIVER_TOPIC_ADDRESS,
    type: 'subscription'
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The messaging config is invalid. ${result.error.message}`)
}

const receiverSubscription = {
  ...result.value.messageQueue,
  ...result.value.receiverSubscription
}

module.exports = { receiverSubscription }
