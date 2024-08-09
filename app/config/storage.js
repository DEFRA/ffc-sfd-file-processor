const Joi = require('joi')
const { DEVELOPMENT } = require('../constants/enviroments')

const schema = Joi.object().keys({
  connectionStr: Joi.string().required(),
  storageAccount: Joi.string().required(),
  container: Joi.string().default('file-storage'),
  folder: Joi.string().default('files'),
  useConnectionStr: Joi.boolean().default(true),
  createContainers: Joi.boolean().default(true)
})
const config = {
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  container: process.env.AZURE_STORAGE_CONTAINER,
  folder: process.env.AZURE_STORAGE_FOLDER,
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS
}
const { error, value } = schema.validate(config)
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}
value.isDev = value.env === DEVELOPMENT

module.exports = value
