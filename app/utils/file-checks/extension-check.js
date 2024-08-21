const { allowedExtensions } = require('../../constants/allowed-extensions')

const getFileExtension = (filename) => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

const checkFileExtension = (filename) => {
  const extension = getFileExtension(filename)
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Invalid file extension: ${extension}`)
  }
}

module.exports = { checkFileExtension }
