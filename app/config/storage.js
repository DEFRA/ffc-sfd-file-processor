const Joi = require('joi')
const { DEVELOPMENT } = require('../constants/enviroments')

const schema = Joi.object().keys({
  connectionStr: Joi.string().required(),
  storageAccount: Joi.string().required(),
  container: Joi.string().default('file-storage'),
  folder: Joi.string().default('files'),
  useConnectionStr: Joi.boolean().default(true),
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
const { error, value } = schema.validate(config)
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}
value.isDev = value.env === DEVELOPMENT

module.exports = value
