const { BlobServiceClient } = require('@azure/storage-blob')
const { v4: uuidv4 } = require('uuid')
const storageConfig = require('../config/storage')
const { checkFileExtension } = require('../utils/file-checks/extension-check')
const { handleFileLimitExceeded } = require('../utils/file-checks/lenght-of-files-array-check')
// const avConfig = require('../config/av-scan')
// const { getAVToken } = require('../utils/av-scan/get-av-token')
// const { sendToAvScan } = require('../utils/av-scan/send-to-AV')
module.exports = {
  method: 'POST',
  path: '/upload',
  options: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      maxBytes: 1530485760
    }
  },
  handler: async (request, h) => {
    const { payload } = request
    const { files, collection } = payload
    console.log('Payload:', files)
    const filesArray = Array.isArray(files) ? files : [files]
    try {
      handleFileLimitExceeded(filesArray)
    } catch (error) {
      return h.response({ error: error.message }).code(400)
    }
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
      const containerClient = blobServiceClient.getContainerClient(storageConfig.container)
      // const token = await getAVToken()
      const results = []
      for (const file of filesArray) {
        try {
          checkFileExtension(file.hapi.filename)
        } catch (error) {
          results.push({ error: error.message, fileName: file.hapi.filename })
          continue
        }
        // const scanResult = await sendToAvScan(token, file)
        const scanResult = { isSafe: true }
        if (!scanResult.isSafe) {
          results.push({ error: 'File is malicious and has been rejected', fileName: file.hapi.filename })
          continue
        }
        const uniqueId = uuidv4()
        const blobName = `${storageConfig.folder}/${uniqueId}`
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        await blockBlobClient.uploadStream(file)
        const metadata = {
          filename: file.hapi.filename,
          blobReference: uniqueId,
          scheme: payload.scheme,
          collection
        }
        // Update blob metadata
        await blockBlobClient.setMetadata(metadata)
        results.push({ message: 'File uploaded successfully', metadata })
      }
      return h.response(results).code(201)
    } catch (error) {
      console.error('Error uploading files:', error.message)
      return h.response({ error: 'File upload failed', details: error.message }).code(500)
    }
  }
}
