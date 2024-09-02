const { MAX_FILES } = require('../../app/constants/max-files')
const { handleFileLimitExceeded } = require('../../app/utils/file-checks/lenght-of-files-array-check')
const filesArray = [1, 2, 3]

describe('check length of files array', () => {
  test('should throw an error when files array length is greater than MAX_FILES', () => {
    const result = handleFileLimitExceeded(filesArray)
    expect(result.error).toBe(`Uploaded files must be less than ${MAX_FILES} files.`)
  })
})
