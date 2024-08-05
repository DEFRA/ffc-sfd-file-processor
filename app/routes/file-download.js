const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../config/storage')

const downloadFile = async (request, h) => {
  const { uniqueId } = request.params

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
    const containerClient = blobServiceClient.getContainerClient(config.container)

    const blobName = `${config.folder}/${uniqueId}`

    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    const exists = await blockBlobClient.exists()
    if (!exists) {
      return h.response({ error: 'File not found' }).code(404)
    }

    const downloadBlockBlobResponse = await blockBlobClient.download(0)
    const stream = downloadBlockBlobResponse.readableStreamBody

    return h.response(stream)
  } catch (error) {
    console.error('Error downloading file:', error.message)
    return h.response({ error: 'File download failed', details: error.message }).code(500)
  }
}

module.exports = {
  method: 'GET',
  path: '/download/{uniqueId}',
  handler: downloadFile
}
