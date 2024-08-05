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

module.exports = config
