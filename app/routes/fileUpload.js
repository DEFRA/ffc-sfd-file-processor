const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../config/storage')

const uploadFile = async (request, h) => {
  const { payload } = request
  const { file } = payload

  const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
  const containerClient = blobServiceClient.getContainerClient(config.container)

  const blobName = `${config.folder}/${file.hapi.filename}`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  await blockBlobClient.upload(file._data)

  return h.response({ message: 'File uploaded successfully', blobName }).code(201)
}

module.exports = {
  method: 'POST',
  path: '/upload',
  options: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      maxBytes: 30485760 // 30MB
    }
  },
  handler: uploadFile
}
