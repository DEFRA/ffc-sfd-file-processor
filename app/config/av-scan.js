const Joi = require('joi')
const { DEVELOPMENT } = require('../constants/enviroments')

const schema = Joi.object().keys({
  tokenUrl: Joi.string().uri().required(),
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  scope: Joi.string().required(),
  grantType: Joi.string().required(),
  avBaseUrl: Joi.string().uri().required(),
  connectionStr: Joi.string().required(),
  container: Joi.string().default('av-container'),
  folder: Joi.string().default('av-files')
})

const config = {
  tokenUrl: process.env.AV_ACCESS_TOKEN_URL,
  clientId: process.env.AV_CLIENT_ID,
  clientSecret: process.env.AV_CLIENT_SECRET,
  scope: process.env.AV_SCOPE,
  grantType: process.env.AV_AUTH_GRANT_TYPE,
  avBaseUrl: process.env.AV_BASE_URL,
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  container: process.env.AZURE_STORAGE_CONTAINER_NAME,
  folder: process.env.AZURE_STORAGE_FOLDER_NAME
}

const { error, value } = schema.validate(config)
if (error) {
  throw new Error(`The AV scan config is invalid. ${error.message}`)
}

value.isDev = value.env === DEVELOPMENT

module.exports = value
