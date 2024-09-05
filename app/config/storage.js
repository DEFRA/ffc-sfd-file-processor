const Joi = require('joi')
const { DEVELOPMENT, TEST, PRODUCTION } = require('../constants/enviroments')

const schema = Joi.object().keys({
  connectionStr: Joi.string().optional(),
  storageAccount: Joi.string().optional(),
  container: Joi.string().default('test'),
  folder: Joi.string().default('files'),
  useConnectionStr: Joi.boolean().default(true).optional(),
  createContainers: Joi.boolean().default(true),
  endpoint: Joi.string().optional(),
  managedIdentityClientId: Joi.string().optional()
})
const config = {
  connectionStr: process.env.STORAGE_CONNECTION_STRING,
  storageAccount: process.env.STORAGE_ACCOUNT_NAME,
  container: process.env.STORAGE_CONTAINER,
  folder: process.env.STORAGE_FOLDER,
  useConnectionStr: process.env.STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.STORAGE_CREATE_CONTAINERS,
  endpoint: process.env.STORAGE_ACCOUNT_ENDPOINT,
  managedIdentityClientId: process.env.AZURE_CLIENT_ID
}
const { error, value } = schema.validate(config, { abortEarly: false })

value.isDev = (process.env.NODE_ENV === DEVELOPMENT || process.env.NODE_ENV === TEST)
value.isTest = process.env.NODE_ENV === TEST
value.isProd = process.env.NODE_ENV === PRODUCTION

if (error) {
  throw new Error(`The storage config is invalid. ${error.message}`)
}

module.exports = value
