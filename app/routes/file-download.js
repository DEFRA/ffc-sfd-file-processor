const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../config/storage')

const downloadFile = async (request, h) => {
  const { uniqueId, filename } = request.params

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
    const containerClient = blobServiceClient.getContainerClient(config.container)

    // Construct the blob name using the uniqueId and filename
    const blobName = `${config.folder}/${uniqueId}-${filename}`

    // Get the block blob client for the specified blob
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    // Check if the blob exists
    const exists = await blockBlobClient.exists()
    if (!exists) {
      return h.response({ error: 'File not found' }).code(404)
    }

    // Download the blob
    const downloadBlockBlobResponse = await blockBlobClient.download(0)
    const stream = downloadBlockBlobResponse.readableStreamBody
    const blobProperties = await blockBlobClient.getProperties()

    return h.response(stream)
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .header('Content-Type', blobProperties.contentType || 'application/octet-stream')
  } catch (error) {
    console.error('Error downloading file:', error.message)
    return h.response({ error: 'File download failed', details: error.message }).code(500)
  }
}

module.exports = {
  method: 'GET',
  path: '/download/{uniqueId}-{filename}',
  handler: downloadFile
}
