const { deleteBlob } = require('./delete-blob')
const { deleteMetadataFromCosmos } = require('./delete-metadata-from-cosmos')
const { handleFileupload } = require('./handle-file-upload')
const { uploadtoBlob } = require('./upload-to-blob')

module.exports = {
  deleteBlob,
  deleteMetadataFromCosmos,
  handleFileupload,
  uploadtoBlob
}
