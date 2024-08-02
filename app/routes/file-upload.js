const { BlobServiceClient } = require('@azure/storage-blob')
const { v4: uuidv4 } = require('uuid')
const config = require('../config/storage')

const uploadFile = async (request, h) => {
  const { payload } = request
  const { file } = payload

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
    const containerClient = blobServiceClient.getContainerClient(config.container)

    // Generate a unique identifier
    const uniqueId = uuidv4()
    const blobName = `${config.folder}/${uniqueId}-${file.hapi.filename}`
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    await blockBlobClient.uploadStream(file)

    // Return the unique filename to the user
    return h.response({ message: 'File uploaded successfully', blobName: `${uniqueId}-${file.hapi.filename}` }).code(201)
  } catch (error) {
    console.error('Error uploading file:', error.message)
    return h.response({ error: 'File upload failed', details: error.message }).code(500)
  }
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
