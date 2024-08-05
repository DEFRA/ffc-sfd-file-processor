const MAX_FILES = 3

function handleFileLimitExceeded (files) {
  if (files.length > MAX_FILES) {
    throw new Error(`Uploaded files must be less than ${MAX_FILES} files.`)
  }
}

module.exports = { MAX_FILES, handleFileLimitExceeded }
