const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('../config')

let blobServiceClient
let containersInitialised

if (storageConfig.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const credential = new DefaultAzureCredential({ managedIdentityClientId: storageConfig.managedIdentityClientId })
  blobServiceClient = new BlobServiceClient(storageConfig.endpoint, credential)
}

const container = blobServiceClient.getContainerClient(storageConfig.container)

const initialiseFolders = async () => {
  const placeHolderText = 'Placeholder'
  const client = container.getBlockBlobClient(`${storageConfig.folder}/default.txt`)
  await client.upload(placeHolderText, placeHolderText.length)
}

const initialiseContainers = async () => {
  if (storageConfig.createContainers) {
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
  return container.getBlockBlobClient(`${storageConfig.folder}/${filename}`)
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
