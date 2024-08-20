const { checkFileExtension } = require('../utils/file-checks/extension-check')
const { handleFileLimitExceeded } = require('../utils/file-checks/lenght-of-files-array-check')
const { handleMessage } = require('../message')
const { uploadFileToBlob } = require('../message/upload-file-to-blob')
const { deleteBlob } = require('../message/delete-blob')

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
    const { files } = payload
    const filesArray = Array.isArray(files) ? files : [files]
    const results = []

    try {
      handleFileLimitExceeded(filesArray)

      for (const file of filesArray) {
        let blockBlobClient
        try {
          checkFileExtension(file.hapi.filename)
          const scanResult = { isSafe: true }
          if (!scanResult.isSafe) {
            results.push({ error: 'File is malicious and has been rejected', fileName: file.hapi.filename })
            continue
          }
          const uploadResult = await uploadFileToBlob(file, payload)
          blockBlobClient = uploadResult.blockBlobClient
          await handleMessage({ body: uploadResult.metadata })
          results.push({ message: 'File uploaded successfully', metadata: uploadResult.metadata })
        } catch (error) {
          if (blockBlobClient) {
            await deleteBlob(blockBlobClient)
          }
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
