const { handleFileLimitExceeded } = require('../utils/file-checks/lenght-of-files-array-check')
const { handleFileUpload } = require('../storage/handle-file-upload')

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
        const result = await handleFileUpload(file, payload)
        results.push(result)
      }

      return h.response(results).code(201)
    } catch (error) {
      console.error('Error uploading files:', error.message)
      return h.response({ error: 'File upload failed', details: error.message }).code(500)
    }
  }
}
