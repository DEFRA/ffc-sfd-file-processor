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

function getFileExtension (filename) {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

function checkFileExtension (filename) {
  const extension = getFileExtension(filename)
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Invalid file extension: ${extension}`)
  }
}

module.exports = { checkFileExtension }
