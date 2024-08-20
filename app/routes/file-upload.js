const { checkFileExtension } = require('../utils/file-checks/extension-check')
const { handleFileLimitExceeded } = require('../utils/file-checks/lenght-of-files-array-check')
const { handleMessage } = require('../message')
const { uploadFileToBlob } = require('../message/upload-file-to-blob')

module.exports = {
  method: 'POST',
  path: '/upload',
  options: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data',
      multipart: true,
      maxBytes: 50 * 1024 * 1024
    }
  },
  handler: async (request, h) => {
    const { payload } = request
    const { files, collection } = payload
    const filesArray = Array.isArray(files) ? files : [files]
    try {
      handleFileLimitExceeded(filesArray)
    } catch (error) {
      return h.response({ error: error.message }).code(400)
    }
    try {
      const results = []
      for (const file of filesArray) {
        try {
          checkFileExtension(file.hapi.filename)
        } catch (error) {
          results.push({ error: error.message, fileName: file.hapi.filename })
          continue
        }
        const scanResult = { isSafe: true }
        if (!scanResult.isSafe) {
          results.push({ error: 'File is malicious and has been rejected', fileName: file.hapi.filename })
          continue
        }
        try {
          const { blockBlobClient, metadata } = await uploadFileToBlob(file, payload)
          await handleMessage({ body: metadata })
          results.push({ message: 'File uploaded successfully', metadata })
        } catch (error) {
          await blockBlobClient.delete()
          results.push({ error: `Failed to upload metadata, file: ${file.hapi.filename} is not saved` })
        }
      }
      return h.response(results).code(201)
    } catch (error) {
      console.error('Error uploading files:', error.message)
      return h.response({ error: 'File upload failed', details: error.message }).code(500)
    }
  }
}
