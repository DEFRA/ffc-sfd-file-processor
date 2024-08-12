const allowedExtensions = [
  'doc',
  'docx',
  'xls',
  'xlsx',
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'mpg',
  'mp4',
  'wmv',
  'mov'
]

const getFileExtension = async (filename) => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

const checkFileExtension = async (filename) => {
  const extension = getFileExtension(filename)
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Invalid file extension: ${extension}`)
  }
}

module.exports = { checkFileExtension }
