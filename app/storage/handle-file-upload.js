const { checkFileExtension } = require('../utils/file-checks/extension-check')
const { uploadFileToBlob } = require('./upload-file-to-blob')
const { handleMessage } = require('../message')
const { deleteBlob } = require('./delete-blob')
const { setAsync, getAsync, expireAsync, keysAsync, delAsync } = require('../redis/redis-client')

const handleFileUpload = async (file, payload) => {
  let blockBlobClient
  try {
    checkFileExtension(file.hapi.filename)
    const uploadResult = await uploadFileToBlob(file, payload)
    blockBlobClient = uploadResult.blockBlobClient
    console.log(uploadResult)

    // Use the uniqueId as the correlationId
    const correlationId = uploadResult.metadata.blobReference
    console.log(`Extracted correlationId: ${correlationId}`)

    if (!correlationId) {
      throw new Error('correlationId is undefined')
    }

    await setAsync(correlationId, JSON.stringify(uploadResult.metadata))
    await expireAsync(correlationId, 60) // Set TTL to 60 seconds

    // Wait for the Webhook response
    const scanResult = await waitForScanResult(correlationId)
    const allKeysBefore = await keysAsync('*')
    console.log('All keys before deletion:', allKeysBefore)

    // Delete the key-value pair from Redis
    await delAsync(correlationId)
    console.log(`Deleted key: ${correlationId}`)

    // Log all key-value pairs in Redis after deletion
    const allKeysAfter = await keysAsync('*')
    console.log('All keys after deletion:', allKeysAfter)

    // Take action based on the scan result
    if (scanResult === 'No threats found') {
      await handleMessage({ body: uploadResult.metadata })
      return { message: 'File uploaded and scanned successfully', metadata: uploadResult.metadata }
    } else {
      await deleteBlob(blockBlobClient)
      return { error: `File upload failed due to scan result: ${scanResult}` }
    }
  } catch (error) {
    if (blockBlobClient) {
      await deleteBlob(blockBlobClient)
    }
    return { error: `Failed to upload metadata, file: ${file.hapi.filename} is not saved` }
  }
}

const waitForScanResult = (correlationId) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const fileMetadata = await getAsync(correlationId)

      if (fileMetadata) {
        const metadata = JSON.parse(fileMetadata)
        if (metadata.scanResult) {
          clearInterval(interval)
          resolve(metadata.scanResult)
        }
      }
    }, 1000) // Check every second

    setTimeout(() => {
      clearInterval(interval)
      reject(new Error('Scan result timeout'))
    }, 60000) // Timeout after 60 seconds
  })
}

module.exports = { handleFileUpload }
