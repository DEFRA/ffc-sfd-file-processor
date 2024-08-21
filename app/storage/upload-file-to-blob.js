const { blobServiceClient } = require('./blob-storage')
const { v4: uuidv4 } = require('uuid')
const { storageConfig } = require('../config')

const uploadFileToBlob = async (file, payload) => {
  const containerClient = blobServiceClient.getContainerClient(storageConfig.container)
  const uniqueId = uuidv4()
  const blobName = `${storageConfig.folder}/${uniqueId}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  await blockBlobClient.uploadStream(file)

  const metadata = {
    filename: file.hapi.filename,
    blobReference: uniqueId,
    scheme: payload.scheme,
    sbi: payload.sbi,
    crn: payload.crn,
    collection: payload.collection
  }

  const blobMetadata = {
    filename: file.hapi.filename
  }
  await blockBlobClient.setMetadata(blobMetadata)

  return { blockBlobClient, metadata }
}

module.exports = {
  uploadFileToBlob
}
