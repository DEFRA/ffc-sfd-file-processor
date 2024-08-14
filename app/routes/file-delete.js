const { BlobServiceClient } = require('@azure/storage-blob')
const storageConfig = require('../config/storage')
const deleteMetadataFromCosmos = require('../message/delete-metadata-from-cosmos')

module.exports = {
  method: 'DELETE',
  path: '/delete/{uniqueId}',
  handler: async (request, h) => {
    const { uniqueId } = request.params

    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
      const containerClient = blobServiceClient.getContainerClient(storageConfig.container)
      const blobName = `${storageConfig.folder}/${uniqueId}`
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const exists = await blockBlobClient.exists()
      if (!exists) {
        return h.response({ error: 'File not found' }).code(404)
      }
      await deleteMetadataFromCosmos(request, uniqueId)

      await blockBlobClient.delete()
      return h.response({ message: 'File deleted successfully' }).code(200)
    } catch (error) {
      console.error('Error deleting file:', error.message)
      return h.response({ error: 'File deletion failed', details: error.message }).code(500)
    }
  }
}
