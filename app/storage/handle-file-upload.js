const { checkFileExtension } = require('../utils/file-checks/extension-check')
const { uploadFileToBlob } = require('./upload-file-to-blob')
const { handleMessage } = require('../message')
const { deleteBlob } = require('./delete-blob')

const handleFileUpload = async (file, payload) => {
  let blockBlobClient
  try {
    checkFileExtension(file.hapi.filename)
    const uploadResult = await uploadFileToBlob(file, payload)
    blockBlobClient = uploadResult.blockBlobClient
    await handleMessage({ body: uploadResult.metadata })
    return { message: 'File uploaded successfully', metadata: uploadResult.metadata }
  } catch (error) {
    if (blockBlobClient) {
      await deleteBlob(blockBlobClient)
    }
    return { error: `Failed to upload metadata, file: ${file.hapi.filename} is not saved` }
  }
}
module.exports = { handleFileUpload }
