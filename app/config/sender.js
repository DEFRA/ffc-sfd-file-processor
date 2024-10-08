const Joi = require('joi')
const { PRODUCTION } = require('../constants/enviroments')

const schema = Joi.object({
  host: Joi.string(),
  username: Joi.string(),
  password: Joi.string(),
  useCredentialChain: Joi.bool().default(false),
  managedIdentityClientId: Joi.string().optional(),
  appInsights: Joi.object(),
  address: Joi.string(),
  subscription: Joi.string(),
  type: Joi.string().allow('topic')

})

const config = {
  host: process.env.MESSAGE_HOST,
  username: process.env.MESSAGE_USER,
  password: process.env.MESSAGE_PASSWORD,
  useCredentialChain: process.env.NODE_ENV === PRODUCTION,
  managedIdentityClientId: process.env.AZURE_CLIENT_ID,
  appInsights:
      process.env.NODE_ENV === PRODUCTION
        ? require('applicationinsights')
        : undefined,
  address: process.env.FILE_RECEIVER_TOPIC_ADDRESS,
  subscription: process.env.FILE_RECEIVER_SUBSCRIPTION_ADDRESS,
  type: 'topic'
}

const { error, value } = schema.validate(config, {
  abortEarly: false
})

if (error) {
  throw new Error(`The sender config is invalid. ${error.message}`)
}

module.exports = value
