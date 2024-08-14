const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config').storageConfig

let blobServiceClient
let containersInitialised

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const credential = new DefaultAzureCredential({ managedIdentityClientId: cosmosConfig.managedIdentityClientId })
  blobServiceClient = new BlobServiceClient(config.endpoint, credential)
}

const container = blobServiceClient.getContainerClient(config.container)

const initialiseFolders = async () => {
  const placeHolderText = 'Placeholder'
  const client = container.getBlockBlobClient(`${config.folder}/default.txt`)
  await client.upload(placeHolderText, placeHolderText.length)
}

const initialiseContainers = async () => {
  if (config.createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
  }
  await initialiseFolders()
  containersInitialised = true
}

const getOutboundBlobClient = async (filename) => {
  if (!containersInitialised) {
    await initialiseContainers()
  }
  return container.getBlockBlobClient(`${config.folder}/${filename}`)
}

const createAzuriteInfrastructure = async () => {
  await initialiseContainers()
  console.log('Azurite infrastructure created successfully')
}

module.exports = {
  initialiseContainers,
  blobServiceClient,
  getOutboundBlobClient,
  createAzuriteInfrastructure
}
