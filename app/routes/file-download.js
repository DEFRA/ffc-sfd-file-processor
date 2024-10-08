const { blobServiceClient } = require('../storage')
const { storageConfig } = require('../config')

module.exports = {
  method: 'GET',
  path: '/download/{uniqueId}',
  handler: async (request, h) => {
    const { uniqueId } = request.params
    console.log(`Downloading file with uniqueId: ${uniqueId}`)
    try {
      const containerClient = blobServiceClient.getContainerClient(storageConfig.container)

      const blobName = `${storageConfig.folder}/${uniqueId}`

      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const exists = await blockBlobClient.exists()
      if (!exists) {
        return h.response({ error: 'File not found' }).code(404)
      }

      const properties = await blockBlobClient.getProperties()
      const filename = properties.metadata.filename || 'downloaded-file'

      const downloadBlockBlobResponse = await blockBlobClient.download(0)
      const stream = downloadBlockBlobResponse.readableStreamBody

      return h.response(stream)
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .header('Content-Type', properties.contentType || 'application/octet-stream')
    } catch (error) {
      console.error('Error downloading file:', error.message)
      return h.response({ error: 'File download failed', details: error.message }).code(500)
    }
  }
}
