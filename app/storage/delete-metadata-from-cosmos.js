const Wreck = require('@hapi/wreck')
const { serverConfig } = require('../config')

const deleteMetadataFromCosmos = async (request, blobReference) => {
  console.log('Deleting metadata from Cosmos:', blobReference)
  try {
    const mutation = `mutation DeleteFileMetadataByBlobReference {
    deleteFileMetadataByBlobReference(blobReference: "${blobReference}") {
        code
        success
        message
    }
}`

    const { payload } = await Wreck.post(serverConfig.dataHost, {
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({ query: mutation }),
      json: true
    })

    return payload.data.deleteFileMetadataByBlobReference
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = { deleteMetadataFromCosmos }
